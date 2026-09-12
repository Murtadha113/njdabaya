import { NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"
import { getShippingMethods } from "@/lib/data"

export async function POST(req: Request) {
  const body = await req.json()
  const { name, description, price } = body as { name?: string; description?: string; price?: number }

  if (!name) {
    return NextResponse.json({ error: "اسم طريقة التوصيل مطلوب" }, { status: 400 })
  }

  const methods = await getShippingMethods()
  const id = `ship-${Date.now()}`
  const doc = {
    name,
    description: description ?? "",
    price: Number(price) || 0,
    isActive: true,
    order: methods.length,
  }

  await adminDb.collection("shippingMethods").doc(id).set(doc)
  return NextResponse.json({ id, ...doc })
}
