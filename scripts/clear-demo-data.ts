import { config } from "dotenv"
config({ path: ".env.local" })
import { initializeApp, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
})
const db = getFirestore(app)

// نحذف كل بيانات العرض التجريبي (منتجات، أقسام، تقييمات، طلبات، ...) بحيث تبدئين
// من لوحة تحكم فاضية وتضيفين بياناتك الحقيقية بنفسك. لا نلمس settings/store ولا
// shippingMethods لأنها إعدادات حقيقية أدخلتِها بنفسك (اسم المتجر، الآيبان، طرق الشحن).
const collectionsToClear = [
  "products",
  "categories",
  "testimonials",
  "orders",
  "reviews",
  "contactMessages",
  "staff",
  "coupons",
]

async function clearCollection(name: string) {
  const snap = await db.collection(name).get()
  if (snap.empty) {
    console.log(`- ${name}: فاضية أصلاً`)
    return
  }
  const batch = db.batch()
  snap.docs.forEach((doc) => batch.delete(doc.ref))
  await batch.commit()
  console.log(`✓ ${name}: حذفت ${snap.size} مستند`)
}

async function main() {
  for (const name of collectionsToClear) {
    await clearCollection(name)
  }
  console.log("\nخلصنا. لوحة التحكم فاضية وجاهزة تضيفين منتجاتك الحقيقية.")
  process.exit(0)
}

main().catch((err) => {
  console.error("Clear failed:", err)
  process.exit(1)
})
