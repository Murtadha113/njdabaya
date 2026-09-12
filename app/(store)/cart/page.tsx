"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import { useCartStore, cartTotals } from "@/lib/store/cart-store"
import { formatPrice, imgSrc } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function CartPage() {
  const items = useCartStore((s) => s.items)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const { totalItems, totalPrice } = cartTotals(items)

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
        <ShoppingBag className="size-12 text-muted-foreground" />
        <h1 className="font-heading text-2xl">سلتك فارغة</h1>
        <p className="text-sm text-muted-foreground">لم تضيفي أي منتج إلى سلتك بعد</p>
        <Link href="/products" className={cn(buttonVariants({ size: "lg" }))}>
          تسوّقي الآن
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14">
      <h1 className="mb-8 font-heading text-3xl">سلة المشتريات ({totalItems})</h1>

      <div className="grid gap-10 md:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {items.map((item) => (
            <div key={`${item.productId}-${item.color}-${item.size}`} className="flex gap-4 border-b border-border pb-6">
              <div className="relative size-28 shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image src={imgSrc(item.image)} alt={item.name} fill className="object-cover" sizes="112px" />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link href={`/products/${item.slug}`} className="font-medium hover:underline">
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.color} · مقاس {item.size}
                  </p>
                  {item.note && <p className="mt-1 text-xs text-muted-foreground">ملاحظة: {item.note}</p>}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 rounded-md border border-border">
                    <button
                      className="p-2"
                      onClick={() => updateQuantity(item.productId, item.color, item.size, item.quantity - 1)}
                      aria-label="إنقاص الكمية"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="min-w-4 text-center text-sm">{item.quantity}</span>
                    <button
                      className="p-2"
                      onClick={() => updateQuantity(item.productId, item.color, item.size, item.quantity + 1)}
                      aria-label="زيادة الكمية"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                  <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                </div>
              </div>
              <button
                onClick={() => removeItem(item.productId, item.color, item.size)}
                aria-label="حذف من السلة"
                className="self-start text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-xl border border-border p-6">
          <h2 className="mb-4 font-heading text-lg">ملخص الطلب</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">المجموع الفرعي</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">الشحن</span>
              <span className="text-muted-foreground">يُحسب عند الدفع</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-border pt-4 text-base font-semibold">
            <span>الإجمالي</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <Link href="/checkout" className={cn(buttonVariants({ size: "lg" }), "mt-6 w-full")}>
            إتمام الطلب
          </Link>
          <Link href="/products" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "mt-2 w-full")}>
            متابعة التسوق
          </Link>
        </div>
      </div>
    </div>
  )
}
