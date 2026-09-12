import { NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const body = await req.json()
  const update: Record<string, unknown> = {}
  if (typeof body.isActive === "boolean") update.isActive = body.isActive
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "لا يوجد شيء للتحديث" }, { status: 400 })
  }
  await adminDb.collection("coupons").doc(id).update(update)
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: Request, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  await adminDb.collection("coupons").doc(id).delete()
  return NextResponse.json({ ok: true })
}
