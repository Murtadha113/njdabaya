import { config } from "dotenv"
config({ path: ".env.local" })
import fs from "fs"
import path from "path"
import { initializeApp, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { uploadToImgbb } from "../lib/imgbb"

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
})
const db = getFirestore(app)
db.settings({ ignoreUndefinedProperties: true })

const SCRATCH = path.join(
  "C:\\Users\\morta\\AppData\\Local\\Temp\\claude\\C--Users-morta-Desktop-sheediaa-main\\411bac59-e56c-41d2-832f-019532296ef8\\scratchpad\\ig-import"
)

interface ProductSpec {
  id: string
  name: string
  price: number
  images: string[] // local filenames in SCRATCH
  colors: { name: string; hex: string }[]
  badges: string[]
}

const colorMap: Record<string, string> = {
  أسود: "#0b0b0c",
  كحلي: "#1b2333",
  بني: "#4a3728",
  رصاصي: "#6b6b6b",
  أبيض: "#f2efe9",
}

const specs: ProductSpec[] = [
  {
    id: "ig-28",
    name: "عباية NJD-28",
    price: 33,
    images: ["Da75gqZDQB6.jpg", "Da75cOYDf9u.jpg", "Da75XtADeUH.jpg"],
    colors: [{ name: "كحلي", hex: colorMap["كحلي"] }],
    badges: ["جديد"],
  },
  {
    id: "ig-30a",
    name: "عباية NJD-30",
    price: 35,
    images: ["DaDLDHejTdK.jpg", "DaDK_lnDV4V.jpg"],
    colors: [{ name: "أسود", hex: colorMap["أسود"] }],
    badges: ["جديد"],
  },
  {
    id: "ig-27",
    name: "عباية NJD-27",
    price: 32,
    images: ["DZQnIobDufn.jpg", "DZQnDY9DqGy.jpg"],
    colors: ["بني", "كحلي", "رصاصي", "أسود", "أبيض"].map((c) => ({ name: c, hex: colorMap[c] })),
    badges: [],
  },
  {
    id: "ig-30b",
    name: "عباية NJD-30 (بني)",
    price: 35,
    images: ["DZQmRIzDvHj.jpg", "DZQmMSmjrBa.jpg"],
    colors: [
      { name: "أسود", hex: colorMap["أسود"] },
      { name: "بني", hex: colorMap["بني"] },
    ],
    badges: [],
  },
  {
    id: "ig-25",
    name: "عباية NJD-25",
    price: 25,
    images: ["DXcHewejBWu.jpg"],
    colors: [{ name: "أسود", hex: colorMap["أسود"] }],
    badges: ["الأكثر مبيعاً"],
  },
  {
    id: "ig-28b",
    name: "عباية NJD-28 (موديل ثاني)",
    price: 28,
    images: ["DXJ0KfaDV-n.jpg", "DXJ0G67jZNg.jpg"],
    colors: [{ name: "أسود", hex: colorMap["أسود"] }],
    badges: [],
  },
]

async function main() {
  // قسم واحد مبدئي لكل المنتجات المستوردة من انستقرام
  const categoryId = "ig-collection"
  await db.collection("categories").doc(categoryId).set({
    slug: "instagram-collection",
    name: "التشكيلة الجديدة",
    description: "أحدث القطع المستوردة من صفحة الانستقرام",
    coverImage: "",
    order: 1,
    showOnHome: true,
    isSeasonal: false,
  })
  console.log("✓ category: التشكيلة الجديدة")

  for (const spec of specs) {
    const imageUrls: string[] = []
    for (const filename of spec.images) {
      const filePath = path.join(SCRATCH, filename)
      const buffer = fs.readFileSync(filePath)
      const url = await uploadToImgbb(buffer, spec.id)
      imageUrls.push(url)
      console.log(`  uploaded ${filename} -> ${url}`)
    }

    const doc = {
      slug: spec.id,
      name: spec.name,
      shortDescription: "عباية فاخرة بقصة أنيقة وقماش ناعم يمنحك إطلالة راقية في كل مناسبة.",
      description:
        "عباية مصممة بعناية فائقة من أجود الأقمشة، تجمع بين الحشمة والأناقة العصرية. صممت بالتعاون مع أمهر الأيادي في التفصيل، ومناسبة للإطلالة اليومية والمناسبات الخاصة.",
      images: imageUrls,
      price: spec.price,
      categoryId,
      colors: spec.colors,
      sizes: ["52", "54", "56", "58", "60"],
      length: "145 سم",
      fabric: "قماش فاخر",
      careInstructions: "غسيل جاف يُفضّل، أو غسيل يدوي بماء بارد",
      stock: 10,
      status: "available",
      badges: spec.badges,
      relatedProductIds: [],
      reviews: [],
      rating: 0,
      reviewsCount: 0,
      createdAt: new Date().toISOString(),
    }

    await db.collection("products").doc(spec.id).set(doc)
    console.log(`✓ product: ${spec.name} (${imageUrls.length} صور)`)
  }

  const allIds = specs.map((s) => s.id)
  for (const spec of specs) {
    const related = allIds.filter((id) => id !== spec.id).slice(0, 4)
    await db.collection("products").doc(spec.id).update({ relatedProductIds: related })
  }
  console.log("✓ ربط المنتجات ببعضها (قد يعجبك أيضاً)")

  console.log("\nتم استيراد 6 منتجات حقيقية من انستقرام.")
  process.exit(0)
}

main().catch((err) => {
  console.error("Import failed:", err)
  process.exit(1)
})
