import { NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"
import type { Product } from "@/lib/types"

export async function POST(req: Request) {
  const data = await req.json()
  const { name, price, compareAtPrice, categoryId, stock, fabric, shortDescription, badges } = data as {
    name?: string
    price?: string
    compareAtPrice?: string
    categoryId?: string
    stock?: string
    fabric?: string
    shortDescription?: string
    badges?: Product["badges"]
  }

  if (!name || !price || !categoryId) {
    return NextResponse.json({ error: "بيانات المنتج ناقصة" }, { status: 400 })
  }

  const id = `p${Date.now()}`
  const doc: Omit<Product, "id"> = {
    slug: `product-${Date.now()}`,
    name,
    shortDescription: shortDescription ?? "",
    description: shortDescription ?? "",
    images: [],
    price: Number(price),
    compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
    categoryId,
    colors: [{ name: "أسود", hex: "#0b0b0c" }],
    sizes: ["52", "54", "56", "58", "60"],
    fabric: fabric ?? "",
    careInstructions: "غسيل جاف يُفضّل",
    stock: Number(stock) || 0,
    status: "available",
    badges: badges ?? [],
    relatedProductIds: [],
    reviews: [],
    rating: 0,
    reviewsCount: 0,
    createdAt: new Date().toISOString(),
  }

  await adminDb.collection("products").doc(id).set(doc)
  return NextResponse.json({ id, ...doc })
}
