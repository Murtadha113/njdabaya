import { NextResponse } from "next/server"
import { getCouponByCode } from "@/lib/data"

export async function POST(req: Request) {
  const { code, subtotal } = await req.json()
  if (typeof code !== "string" || !code.trim()) {
    return NextResponse.json({ valid: false, message: "أدخلي كود الخصم" }, { status: 400 })
  }

  const coupon = await getCouponByCode(code.trim())
  if (!coupon || !coupon.isActive) {
    return NextResponse.json({ valid: false, message: "كود الخصم غير صحيح" })
  }
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return NextResponse.json({ valid: false, message: "انتهت صلاحية كود الخصم" })
  }
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return NextResponse.json({ valid: false, message: "تم استنفاد عدد مرات استخدام هذا الكود" })
  }
  if (coupon.minOrder && subtotal < coupon.minOrder) {
    return NextResponse.json({
      valid: false,
      message: `هذا الكود يتطلب حد أدنى للطلب ${coupon.minOrder} د.ب`,
    })
  }

  const discountAmount = coupon.type === "percentage" ? (subtotal * coupon.value) / 100 : coupon.value

  return NextResponse.json({
    valid: true,
    code: coupon.code,
    discountAmount: Math.min(discountAmount, subtotal),
    message: "تم تطبيق كود الخصم",
  })
}
