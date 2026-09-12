import { NextResponse } from "next/server"
import { FieldValue } from "firebase-admin/firestore"
import { adminDb } from "@/lib/firebase-admin"
import { getShippingMethods, getCouponByCode, getProductById } from "@/lib/data"

interface OrderRequestItem {
  productId: string
  color: string
  size: string
  quantity: number
}

export async function POST(req: Request) {
  const body = await req.json()
  const { fullName, phone, city, address, notes, shippingId, payment, couponCode, items } = body as {
    fullName?: string
    phone?: string
    city?: string
    address?: string
    notes?: string
    shippingId?: string
    payment?: string
    couponCode?: string
    items?: OrderRequestItem[]
  }

  if (!fullName || !phone || !city || !address || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "الرجاء تعبئة جميع بيانات الشحن المطلوبة" }, { status: 400 })
  }

  const shippingMethods = await getShippingMethods()
  const shippingMethod = shippingMethods.find((m) => m.id === shippingId)
  if (!shippingMethod) {
    return NextResponse.json({ error: "طريقة شحن غير صالحة" }, { status: 400 })
  }

  // نعيد احتساب كل الأسعار من قاعدة البيانات — لا نثق بأي سعر قادم من المتصفح
  let subtotal = 0
  const verifiedItems = []
  for (const item of items) {
    const product = await getProductById(item.productId)
    if (!product) {
      return NextResponse.json({ error: "أحد المنتجات لم يعد متوفراً" }, { status: 400 })
    }
    const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1))
    subtotal += product.price * quantity
    verifiedItems.push({
      productId: product.id,
      name: product.name,
      image: product.images[0] ?? "",
      quantity,
      price: product.price,
      color: item.color,
      size: item.size,
    })
  }

  let discountAmount = 0
  let appliedCouponId: string | null = null
  if (couponCode) {
    const coupon = await getCouponByCode(couponCode)
    const validForOrder =
      coupon &&
      coupon.isActive &&
      (!coupon.expiresAt || new Date(coupon.expiresAt) >= new Date()) &&
      (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit) &&
      (!coupon.minOrder || subtotal >= coupon.minOrder)
    if (validForOrder && coupon) {
      discountAmount =
        coupon.type === "percentage" ? (subtotal * coupon.value) / 100 : coupon.value
      discountAmount = Math.min(discountAmount, subtotal)
      appliedCouponId = coupon.id
    }
  }

  const shippingCost =
    shippingMethod.freeAbove && subtotal >= shippingMethod.freeAbove ? 0 : shippingMethod.price
  const total = Math.max(0, subtotal - discountAmount + shippingCost)

  const orderId = `AB-${Math.floor(100000 + Math.random() * 900000)}`
  const order = {
    date: new Date().toISOString().slice(0, 10),
    status: "new" as const,
    total,
    customerName: fullName,
    customerPhone: phone,
    city,
    address: address ?? "",
    notes: notes ?? "",
    trackingSteps: ["new"],
    items: verifiedItems,
    paymentMethod: payment === "bankTransfer" ? "bankTransfer" : "cod",
    paymentConfirmed: false,
  }

  await adminDb.collection("orders").doc(orderId).set(order)

  if (appliedCouponId) {
    await adminDb
      .collection("coupons")
      .doc(appliedCouponId)
      .update({ usedCount: FieldValue.increment(1) })
  }

  return NextResponse.json({ orderId, total })
}
