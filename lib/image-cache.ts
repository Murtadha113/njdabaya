import crypto from "crypto"
import sharp from "sharp"
import { adminDb } from "./firebase-admin"

// نخزّن نسخة دائمة من كل صورة داخل Firestore نفسه (نفس قاعدة البيانات المستخدمة
// أصلاً بكل الموقع) بدل الاعتماد على استضافة ImgBB وقت كل زيارة. ImgBB يضل هو
// مكان الرفع (كما هو مطلوب)، لكن العرض للزوار يصير من مصدر داخلي دائم لا يتأثر
// ببطء ImgBB ولا بإعادة نشر الموقع على فيرسال.
const COLLECTION = "imageCache"
// هامش أمان تحت حد 1MB لحجم مستند Firestore، بعد احتساب تضخم ترميز base64 (~33%)
const MAX_RAW_BYTES = 650_000

function keyFor(url: string) {
  return crypto.createHash("sha1").update(url).digest("hex")
}

export async function getCachedImage(url: string): Promise<{ data: Buffer; contentType: string } | null> {
  const doc = await adminDb.collection(COLLECTION).doc(keyFor(url)).get()
  if (!doc.exists) return null
  const { data, contentType } = doc.data() as { data: string; contentType: string }
  return { data: Buffer.from(data, "base64"), contentType: contentType || "image/jpeg" }
}

export async function cacheImage(url: string, buffer: Buffer) {
  const optimized = await optimizeForStorage(buffer)
  await adminDb
    .collection(COLLECTION)
    .doc(keyFor(url))
    .set({
      data: optimized.toString("base64"),
      contentType: "image/jpeg",
      sourceUrl: url,
      cachedAt: new Date().toISOString(),
    })
}

/** يضغط/يصغّر الصورة عند الحاجة فقط، عشان تبقى ضمن حد حجم مستند Firestore */
async function optimizeForStorage(buffer: Buffer): Promise<Buffer> {
  if (buffer.length <= MAX_RAW_BYTES) {
    // حتى لو الحجم مناسب، نمررها على sharp لتوحيد الصيغة لـ JPEG وتصحيح الدوران (EXIF)
    return sharp(buffer).rotate().jpeg({ quality: 88 }).toBuffer()
  }

  let width = 1600
  let quality = 82
  for (let i = 0; i < 5; i++) {
    const out = await sharp(buffer).rotate().resize({ width, withoutEnlargement: true }).jpeg({ quality }).toBuffer()
    if (out.length <= MAX_RAW_BYTES) return out
    width = Math.round(width * 0.8)
    quality = Math.max(45, quality - 10)
  }
  return sharp(buffer).rotate().resize({ width: 700 }).jpeg({ quality: 45 }).toBuffer()
}
