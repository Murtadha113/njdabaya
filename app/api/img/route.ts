import { NextRequest, NextResponse } from "next/server"
import { after } from "next/server"
import { getCachedImage, cacheImage } from "@/lib/image-cache"

export const maxDuration = 30

const ALLOWED_HOSTS = ["i.ibb.co"]

export async function GET(req: NextRequest) {
  const u = req.nextUrl.searchParams.get("u")
  if (!u) return new NextResponse("رابط الصورة مفقود", { status: 400 })

  let target: URL
  try {
    target = new URL(u)
  } catch {
    return new NextResponse("رابط غير صالح", { status: 400 })
  }

  if (!ALLOWED_HOSTS.includes(target.hostname)) {
    return new NextResponse("مصدر غير مسموح", { status: 403 })
  }

  // المسار الأساسي: الصورة محفوظة أصلاً بالفايرستور (تُخزَّن تلقائياً وقت الرفع)،
  // فترجع فوراً بدون أي اعتماد على سرعة ImgBB أو استمرار كاش فيرسال بين النشرات.
  const cached = await getCachedImage(u)
  if (cached) {
    return new NextResponse(new Uint8Array(cached.data), {
      status: 200,
      headers: {
        "Content-Type": cached.contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  }

  // مسار احتياطي نادر فقط (صورة قديمة ما تخزّنت وقت رفعها). مهلة أقل من سقف
  // تنفيذ فيرسال الفعلي حتى نرجّع خطأ واضح بدل ما تُقتل الدالة فجأة.
  let upstream: Response
  try {
    upstream = await fetch(target.toString(), { signal: AbortSignal.timeout(11000) })
  } catch {
    return new NextResponse("تعذّر تحميل الصورة", { status: 504 })
  }

  if (!upstream.ok || !upstream.body) {
    return new NextResponse("تعذّر تحميل الصورة", { status: 502 })
  }

  const buffer = Buffer.from(await upstream.arrayBuffer())
  const contentType = upstream.headers.get("content-type") ?? "image/jpeg"

  // نخزّنها بالفايرستور فوراً عشان ما تتكرر هذي المشكلة لنفس الصورة مرة ثانية أبداً
  try {
    after(() => cacheImage(u, buffer))
  } catch {
    await cacheImage(u, buffer)
  }

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
