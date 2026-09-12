"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Check, Copy, Upload } from "lucide-react"
import { useCartStore, cartTotals } from "@/lib/store/cart-store"
import type { ShippingMethod, BankDetails } from "@/lib/data"
import { formatPrice } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button, buttonVariants } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export function CheckoutForm({
  shippingMethods,
  cities,
  bankDetails,
}: {
  shippingMethods: ShippingMethod[]
  cities: string[]
  bankDetails: BankDetails
}) {
  const router = useRouter()
  const items = useCartStore((s) => s.items)
  const clearCart = useCartStore((s) => s.clear)
  const { totalPrice } = cartTotals(items)

  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [city, setCity] = useState(cities[0])
  const [address, setAddress] = useState("")
  const [notes, setNotes] = useState("")
  const [shippingId, setShippingId] = useState(shippingMethods[0]?.id ?? "")
  const [payment, setPayment] = useState("cod")
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [copiedIban, setCopiedIban] = useState(false)
  const [coupon, setCoupon] = useState("")
  const [couponCode, setCouponCode] = useState<string | null>(null)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [applyingCoupon, setApplyingCoupon] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const shippingMethod = shippingMethods.find((m) => m.id === shippingId) ?? shippingMethods[0]
  const shippingCost =
    shippingMethod?.freeAbove && totalPrice >= shippingMethod.freeAbove ? 0 : (shippingMethod?.price ?? 0)

  const finalTotal = Math.max(0, totalPrice - discountAmount + shippingCost)

  async function applyCoupon() {
    if (!coupon.trim()) return
    setApplyingCoupon(true)
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: coupon.trim(), subtotal: totalPrice }),
      })
      const data = await res.json()
      if (data.valid) {
        setDiscountAmount(data.discountAmount)
        setCouponCode(data.code)
        toast.success(data.message)
      } else {
        setDiscountAmount(0)
        setCouponCode(null)
        toast.error(data.message ?? "كود الخصم غير صحيح")
      }
    } catch {
      toast.error("تعذّر التحقق من كود الخصم، حاولي مرة أخرى")
    } finally {
      setApplyingCoupon(false)
    }
  }

  function handleCopyIban() {
    navigator.clipboard?.writeText(bankDetails.iban.replace(/\s/g, ""))
    setCopiedIban(true)
    toast.success("تم نسخ رقم الآيبان")
    setTimeout(() => setCopiedIban(false), 2000)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!fullName || !phone || !address) {
      toast.error("الرجاء تعبئة جميع بيانات الشحن المطلوبة")
      return
    }
    if (payment === "bankTransfer" && !receiptFile) {
      toast.error("الرجاء رفع صورة إيصال التحويل البنكي لإتمام الطلب")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          city,
          address,
          notes,
          shippingId,
          payment,
          couponCode,
          items: items.map((i) => ({
            productId: i.productId,
            color: i.color,
            size: i.size,
            quantity: i.quantity,
          })),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? "تعذّر إتمام الطلب")
        setSubmitting(false)
        return
      }
      clearCart()
      router.push(`/checkout/success?order=${data.orderId}`)
    } catch {
      toast.error("تعذّر إتمام الطلب، تأكدي من اتصالك بالإنترنت وحاولي مرة أخرى")
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
        <h1 className="font-heading text-2xl">سلتك فارغة</h1>
        <p className="text-sm text-muted-foreground">أضيفي منتجات إلى سلتك أولاً لإتمام الطلب</p>
        <Link href="/products" className={cn(buttonVariants({ size: "lg" }))}>
          تسوّقي الآن
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14">
      <h1 className="mb-8 font-heading text-3xl">إتمام الطلب</h1>

      <form onSubmit={handleSubmit} className="grid gap-10 md:grid-cols-[1fr_360px]">
        <div className="space-y-10">
          <section>
            <h2 className="mb-4 font-heading text-lg">بيانات الشحن</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="fullName">الاسم الكامل</Label>
                <Input id="fullName" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input id="phone" required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="city">المدينة</Label>
                <Select value={city} onValueChange={(v) => v && setCity(v)}>
                  <SelectTrigger id="city" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="address">العنوان التفصيلي</Label>
                <Input id="address" required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="المنطقة، الشارع، رقم المبنى" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="notes">ملاحظات على الطلب (اختياري)</Label>
                <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 font-heading text-lg">طريقة التوصيل</h2>
            <RadioGroup value={shippingId} onValueChange={setShippingId}>
              {shippingMethods.map((method) => (
                <label
                  key={method.id}
                  htmlFor={method.id}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-3 rounded-lg border p-4 text-sm",
                    shippingId === method.id ? "border-foreground" : "border-border"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <div>
                      <p className="font-medium">{method.name}</p>
                      <p className="text-xs text-muted-foreground">{method.description}</p>
                    </div>
                  </div>
                  <span className="font-medium">
                    {method.price === 0
                      ? "مجاني"
                      : method.freeAbove && totalPrice >= method.freeAbove
                        ? "مجاني"
                        : formatPrice(method.price)}
                  </span>
                </label>
              ))}
            </RadioGroup>
          </section>

          <section>
            <h2 className="mb-4 font-heading text-lg">طريقة الدفع</h2>
            <RadioGroup value={payment} onValueChange={setPayment}>
              <label htmlFor="cod" className={cn("flex cursor-pointer items-center gap-3 rounded-lg border p-4 text-sm", payment === "cod" ? "border-foreground" : "border-border")}>
                <RadioGroupItem value="cod" id="cod" />
                الدفع عند الاستلام
              </label>
              <label htmlFor="bankTransfer" className={cn("flex cursor-pointer items-center gap-3 rounded-lg border p-4 text-sm", payment === "bankTransfer" ? "border-foreground" : "border-border")}>
                <RadioGroupItem value="bankTransfer" id="bankTransfer" />
                تحويل بنكي
              </label>
            </RadioGroup>

            {payment === "bankTransfer" && (
              <div className="mt-4 space-y-4 rounded-lg border border-border bg-secondary/30 p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">اسم البنك</span>
                    <span className="font-medium">{bankDetails.bankName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">اسم صاحب الحساب</span>
                    <span className="font-medium">{bankDetails.accountName}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 border-t border-border pt-2">
                    <span className="text-muted-foreground">رقم الآيبان</span>
                    <div className="flex items-center gap-2">
                      <span dir="ltr" className="font-mono font-medium">{bankDetails.iban}</span>
                      <button
                        type="button"
                        onClick={handleCopyIban}
                        aria-label="نسخ رقم الآيبان"
                        className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        {copiedIban ? <Check className="size-4" /> : <Copy className="size-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-muted-foreground">
                  حوّلي المبلغ الإجمالي إلى الحساب أعلاه، ثم ارفعي صورة إيصال التحويل هنا — سيتم مراجعة طلبك وتأكيده بعد التحقق من التحويل.
                </p>

                <div className="space-y-1.5">
                  <Label htmlFor="receipt">صورة إيصال التحويل</Label>
                  <label
                    htmlFor="receipt"
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-background px-4 py-6 text-sm text-muted-foreground hover:border-foreground/40"
                  >
                    <Upload className="size-4" />
                    {receiptFile ? receiptFile.name : "اضغطي لرفع صورة الإيصال"}
                  </label>
                  <input
                    id="receipt"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => setReceiptFile(e.target.files?.[0] ?? null)}
                  />
                </div>
              </div>
            )}
          </section>
        </div>

        <div className="h-fit space-y-5 rounded-xl border border-border p-6">
          <h2 className="font-heading text-lg">ملخص الطلب</h2>
          <div className="max-h-56 space-y-3 overflow-y-auto">
            {items.map((item) => (
              <div key={`${item.productId}-${item.color}-${item.size}`} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {item.name} × {item.quantity}
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input placeholder="كود الخصم" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
            <Button type="button" variant="outline" onClick={applyCoupon} disabled={applyingCoupon}>
              {applyingCoupon ? "..." : "تطبيق"}
            </Button>
          </div>

          <div className="space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">المجموع الفرعي</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-destructive">
                <span>خصم الكوبون</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">الشحن</span>
              <span>{shippingCost === 0 ? "مجاني" : formatPrice(shippingCost)}</span>
            </div>
          </div>

          <div className="flex justify-between border-t border-border pt-4 text-base font-semibold">
            <span>الإجمالي</span>
            <span>{formatPrice(finalTotal)}</span>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? "جارِ تأكيد الطلب..." : "تأكيد الطلب"}
          </Button>
        </div>
      </form>
    </div>
  )
}
