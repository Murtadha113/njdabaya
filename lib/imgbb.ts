import { after } from "next/server"
import { cacheImage } from "./image-cache"

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

  // نخزّن نفس البايتات اللي بأيدينا أصلاً مباشرة بالفايرستور — بدون أي طلب شبكة
  // إضافي لـ ImgBB. فبمجرد رفع الصورة، عرضها للزوار يصير فوراً ودائماً من عندنا،
  // بغض النظر عن سرعة أو استقرار ImgBB لاحقاً.
  try {
    after(() => cacheImage(url, fileBuffer))
  } catch {
    // uploadToImgbb تُستدعى أيضاً من سكربتات مستقلة (import-instagram-products.ts)
    // بدون سياق طلب HTTP، فـ after() ما تشتغل هناك — نخزّن مباشرة بدلاً منها.
    await cacheImage(url, fileBuffer)
  }

  return url
}
