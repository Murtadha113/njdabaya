import { NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"

export async function POST(req: Request) {
  const body = await req.json()
  const { name, email, phone, subject, message } = body as {
    name?: string
    email?: string
    phone?: string
    subject?: string
    message?: string
  }

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "الرجاء تعبئة جميع الحقول المطلوبة" }, { status: 400 })
  }

  const id = `m${Date.now()}`
  await adminDb
    .collection("contactMessages")
    .doc(id)
    .set({
      name,
      email,
      phone: phone || undefined,
      subject,
      message,
      date: new Date().toISOString().slice(0, 10),
      isRead: false,
    })

  return NextResponse.json({ ok: true })
}
