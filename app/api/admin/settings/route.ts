import { NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"

export async function PUT(req: Request) {
  const body = await req.json()
  const {
    storeName,
    storeDescription,
    whatsapp,
    email,
    currency,
    taxRate,
    freeShippingThreshold,
    bankDetails,
  } = body as {
    storeName?: string
    storeDescription?: string
    whatsapp?: string
    email?: string
    currency?: string
    taxRate?: string
    freeShippingThreshold?: string
    bankDetails?: { bankName: string; accountName: string; iban: string }
  }

  if (!storeName) {
    return NextResponse.json({ error: "اسم المتجر مطلوب" }, { status: 400 })
  }

  await adminDb.collection("settings").doc("store").update({
    storeName,
    storeDescription: storeDescription ?? "",
    whatsapp: whatsapp ?? "",
    email: email ?? "",
    currency: currency ?? "BHD",
    taxRate: Number(taxRate) || 0,
    freeShippingThreshold: Number(freeShippingThreshold) || 0,
    bankDetails,
  })

  return NextResponse.json({ ok: true })
}
