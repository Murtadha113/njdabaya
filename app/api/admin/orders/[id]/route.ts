import { NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const body = await req.json()
  const update: Record<string, unknown> = {}

  if (typeof body.status === "string") update.status = body.status
  if (typeof body.paymentConfirmed === "boolean") update.paymentConfirmed = body.paymentConfirmed
  if (typeof body.internalNote === "string") update.internalNote = body.internalNote

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "لا يوجد شيء للتحديث" }, { status: 400 })
  }

  const ref = adminDb.collection("orders").doc(id)
  const doc = await ref.get()
  if (!doc.exists) {
    return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 })
  }

  if (update.status) {
    const existing = doc.data()!
    const steps: string[] = existing.trackingSteps ?? []
    if (!steps.includes(update.status as string)) {
      update.trackingSteps = [...steps, update.status]
    }
  }

  await ref.update(update)
  return NextResponse.json({ ok: true })
}
