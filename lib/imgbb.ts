import { after } from "next/server"

export async function uploadToImgbb(fileBuffer: Buffer, name?: string): Promise<string> {
  const apiKey = process.env.IMGBB_API_KEY
  if (!apiKey) throw new Error("IMGBB_API_KEY is not set")

  const form = new FormData()
  form.append("key", apiKey)
  form.append("image", fileBuffer.toString("base64"))
  if (name) form.append("name", name)

  const res = await fetch("https://api.imgbb.com/1/upload", {
    method: "POST",
    body: form,
  })
  const data = await res.json()
  if (!data.success) {
    throw new Error(data.error?.message ?? "فشل رفع الصورة إلى ImgBB")
  }

  const url = data.data.url as string

  // نسخّن الصورة فور رفعها بدل ما نعتمد على تشغيل سكربت تسخين يدوي بعد كل رفعة.
  // أي صورة تُرفع من الأدمن أو أي استيراد مستقبلي تمر من هنا، فالتسخين مضمون
  // تلقائياً من نفس نقطة الرفع، مو خطوة منفصلة يسهل نسيانها.
  try {
    after(() => warmImageCache(url))
  } catch {
    // uploadToImgbb تُستدعى أيضاً من سكربتات مستقلة (import-instagram-products.ts)
    // ما فيها سياق طلب HTTP، فـ after() ما تشتغل هناك — نسخّن مباشرة بدلاً منها.
    await warmImageCache(url)
  }

  return url
}

/**
 * ImgBB بطيء جداً على أول طلب لصورة (20-40 ثانية) لكنه يسرّع تلقائياً على الطلبات
 * المتكررة لنفس الرابط (مقاس فعلياً: ~22s ← ~9s ← ~3s). نسخّن الأصل عند ImgBB
 * نفسه، ثم نمرّ على بروكسي الموقع (/api/img) عشان كاش فيرسال يخزّن الصورة قبل
 * ما يوصلها أي زائر حقيقي.
 */
async function warmImageCache(url: string) {
  try {
    await fetch(url).catch(() => {})
    await fetch(url).catch(() => {})

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    if (siteUrl && !siteUrl.includes("localhost")) {
      await fetch(`${siteUrl}/api/img?u=${encodeURIComponent(url)}`).catch(() => {})
    }
  } catch {
    // التسخين تحسين إضافي فقط، أي فشل هنا ما يوقف رفع الصورة أبداً
  }
}
