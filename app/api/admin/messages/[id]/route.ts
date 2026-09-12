import { NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const body = await req.json()
  if (body.isRead !== true) {
    return NextResponse.json({ error: "قيمة غير صالحة" }, { status: 400 })
  }
  await adminDb.collection("contactMessages").doc(id).update({ isRead: true })
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: Request, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  await adminDb.collection("contactMessages").doc(id).delete()
  return NextResponse.json({ ok: true })
}
