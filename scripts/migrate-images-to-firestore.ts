import { adminDb as db } from "../lib/firebase-admin"
import { cacheImage, getCachedImage } from "../lib/image-cache"

async function main() {
  const urls = new Set<string>()
  const products = await db.collection("products").get()
  products.forEach((d) => (d.data().images || []).forEach((u: string) => urls.add(u)))
  const categories = await db.collection("categories").get()
  categories.forEach((d) => {
    if (d.data().coverImage) urls.add(d.data().coverImage)
  })

  console.log(`ترحيل ${urls.size} صورة إلى Firestore...`)
  for (const url of urls) {
    const already = await getCachedImage(url)
    if (already) {
      console.log(`= موجودة مسبقاً: ${url}`)
      continue
    }
    const start = Date.now()
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const buffer = Buffer.from(await res.arrayBuffer())
      await cacheImage(url, buffer)
      console.log(`✓ ${((Date.now() - start) / 1000).toFixed(1)}s ${url}`)
    } catch (e) {
      console.log(`✗ فشل: ${url} — ${(e as Error).message}`)
    }
  }
  console.log("تم الترحيل.")
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
