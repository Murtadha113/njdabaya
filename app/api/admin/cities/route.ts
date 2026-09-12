import { NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"

export async function PUT(req: Request) {
  const body = await req.json()
  if (!Array.isArray(body.cities)) {
    return NextResponse.json({ error: "قيمة غير صالحة" }, { status: 400 })
  }
  await adminDb.collection("settings").doc("store").update({ cities: body.cities })
  return NextResponse.json({ ok: true })
}
