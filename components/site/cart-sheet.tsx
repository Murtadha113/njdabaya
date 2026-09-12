"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { buttonVariants } from "@/components/ui/button"
import { useCartStore, cartTotals } from "@/lib/store/cart-store"
import { formatPrice, imgSrc } from "@/lib/utils"

export function CartSheet({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const items = useCartStore((s) => s.items)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const { totalItems, totalPrice } = cartTotals(items)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader className="border-b border-border">
          <SheetTitle>سلة المشتريات ({totalItems})</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag className="size-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">سلتك فارغة حالياً</p>
            <SheetClose
              render={<Link href="/products" className={buttonVariants({ size: "lg" })} />}
            >
              تسوّقي الآن
            </SheetClose>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto px-4">
              {items.map((item) => (
                <div key={`${item.productId}-${item.color}-${item.size}`} className="flex gap-3">
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-muted">
                    <Image src={imgSrc(item.image)} alt={item.name} fill className="object-cover" sizes="80px" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.color} · مقاس {item.size}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-md border border-border">
                        <button
                          className="p-1.5"
                          onClick={() => updateQuantity(item.productId, item.color, item.size, item.quantity - 1)}
                          aria-label="إنقاص الكمية"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="min-w-4 text-center text-xs">{item.quantity}</span>
                        <button
                          className="p-1.5"
                          onClick={() => updateQuantity(item.productId, item.color, item.size, item.quantity + 1)}
                          aria-label="زيادة الكمية"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
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

            <SheetFooter className="border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">المجموع</span>
                <span className="text-base font-semibold">{formatPrice(totalPrice)}</span>
              </div>
              <SheetClose
                render={
                  <Link href="/checkout" className={buttonVariants({ size: "lg", className: "w-full" })} />
                }
              >
                إتمام الطلب
              </SheetClose>
              <SheetClose
                render={
                  <Link
                    href="/cart"
                    className={buttonVariants({ variant: "outline", size: "lg", className: "w-full" })}
                  />
                }
              >
                عرض السلة
              </SheetClose>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
