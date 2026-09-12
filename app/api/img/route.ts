import { NextRequest, NextResponse } from "next/server"

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

  let upstream: Response
  try {
    upstream = await fetch(target.toString(), { signal: AbortSignal.timeout(28000) })
  } catch {
    return new NextResponse("تعذّر تحميل الصورة", { status: 504 })
  }

  if (!upstream.ok || !upstream.body) {
    return new NextResponse("تعذّر تحميل الصورة", { status: 502 })
  }

  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "image/jpeg",
      // كاش دائم على شبكة فيرسال: أول زائر يدفع بطء ImgBB، وبعدها كل الزوار
      // ياخذون الصورة فوراً من كاش فيرسال (edge) بدون رجوع لـ ImgBB مرة ثانية.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
