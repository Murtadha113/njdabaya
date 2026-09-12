import { NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"
import type { Coupon } from "@/lib/types"

export async function POST(req: Request) {
  const data = await req.json()
  const { code, type, value, minOrder, usageLimit } = data as {
    code?: string
    type?: "percentage" | "fixed"
    value?: string
    minOrder?: string
    usageLimit?: string
  }

  if (!code || !type || !value) {
    return NextResponse.json({ error: "بيانات الكوبون ناقصة" }, { status: 400 })
  }

  const id = `c${Date.now()}`
  const doc: Omit<Coupon, "id"> = {
    code: code.toUpperCase(),
    type,
    value: Number(value),
    minOrder: minOrder ? Number(minOrder) : undefined,
    usageLimit: usageLimit ? Number(usageLimit) : undefined,
    usedCount: 0,
    isActive: true,
  }

  await adminDb.collection("coupons").doc(id).set(doc)
  return NextResponse.json({ id, ...doc })
}
