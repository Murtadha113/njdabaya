import { NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const body = await req.json()
  const update: Record<string, unknown> = {}

  if (typeof body.name === "string") update.name = body.name
  if (body.price !== undefined) update.price = Number(body.price)
  if (body.compareAtPrice !== undefined) {
    update.compareAtPrice = body.compareAtPrice ? Number(body.compareAtPrice) : null
  }
  if (typeof body.categoryId === "string") update.categoryId = body.categoryId
  if (body.stock !== undefined) update.stock = Number(body.stock)
  if (typeof body.fabric === "string") update.fabric = body.fabric
  if (typeof body.shortDescription === "string") update.shortDescription = body.shortDescription
  if (Array.isArray(body.badges)) update.badges = body.badges

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "لا يوجد شيء للتحديث" }, { status: 400 })
  }

  await adminDb.collection("products").doc(id).update(update)
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: Request, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  await adminDb.collection("products").doc(id).delete()
  return NextResponse.json({ ok: true })
}
