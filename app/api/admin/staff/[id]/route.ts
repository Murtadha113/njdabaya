import { NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const body = await req.json()
  if (typeof body.isActive !== "boolean") {
    return NextResponse.json({ error: "قيمة غير صالحة" }, { status: 400 })
  }
  await adminDb.collection("staff").doc(id).update({ isActive: body.isActive })
  return NextResponse.json({ ok: true })
}
