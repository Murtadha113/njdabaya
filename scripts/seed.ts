import { config } from "dotenv"
config({ path: ".env.local" })
import { initializeApp, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import {
  products,
  categories,
  testimonials,
  shippingMethods,
  cities,
  bankDetails,
  mockOrders,
  coupons,
  contactMessages,
  adminReviews,
  adminStaff,
} from "../lib/mock-data"

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
})
const db = getFirestore(app)
db.settings({ ignoreUndefinedProperties: true })

async function seedCollection<T extends { id: string }>(name: string, items: T[]) {
  const batch = db.batch()
  for (const item of items) {
    const { id, ...rest } = item
    batch.set(db.collection(name).doc(id), rest)
  }
  await batch.commit()
  console.log(`✓ ${name}: ${items.length} documents`)
}

async function main() {
  await seedCollection("products", products)
  await seedCollection("categories", categories)
  await seedCollection("testimonials", testimonials)
  await seedCollection("shippingMethods", shippingMethods)
  await seedCollection("orders", mockOrders)
  await seedCollection("coupons", coupons)
  await seedCollection("contactMessages", contactMessages)
  await seedCollection("reviews", adminReviews)
  await seedCollection("staff", adminStaff)

  await db.collection("settings").doc("store").set({
    storeName: "نجد",
    storeDescription: "متجر إلكتروني فاخر لعرض وبيع العبايات بتصاميم عصرية وخامات راقية",
    whatsapp: "+973 3300 0000",
    email: "info@store.bh",
    currency: "BHD",
    taxRate: 0,
    freeShippingThreshold: 30,
    cities,
    bankDetails,
  })
  console.log("✓ settings/store")

  console.log("\nDone seeding najd-abaya Firestore.")
  process.exit(0)
}

main().catch((err) => {
  console.error("Seed failed:", err)
  process.exit(1)
})
