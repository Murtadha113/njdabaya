"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Heart, Minus, Plus, Share2, ShoppingBag, Star } from "lucide-react"
import { toast } from "sonner"
import type { Product } from "@/lib/types"
import { cn, discountPercent, formatPrice, imgSrc } from "@/lib/utils"
import { ProductBadgePill } from "@/components/site/product-badge"
import { ProductGallery } from "./product-gallery"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCartStore } from "@/lib/store/cart-store"
import { useWishlistStore } from "@/lib/store/wishlist-store"

export function ProductDetail({ product }: { product: Product }) {
  const router = useRouter()
  const [color, setColor] = useState(product.colors[0]?.name ?? "")
  const [size, setSize] = useState(product.sizes[0] ?? "")
  const [quantity, setQuantity] = useState(1)
  const [note, setNote] = useState("")

  const addItem = useCartStore((s) => s.addItem)
  const isWished = useWishlistStore((s) => s.has(product.id))
  const toggleWish = useWishlistStore((s) => s.toggle)
  const discount = discountPercent(product.price, product.compareAtPrice)

  function buildCartItem() {
    return {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: imgSrc(product.images[0]),
      price: product.price,
      color,
      size,
      quantity,
      note: note || undefined,
    }
  }

  function handleAddToCart() {
    addItem(buildCartItem())
    toast.success("أُضيف المنتج إلى السلة", { description: product.name })
  }

  function handleBuyNow() {
    addItem(buildCartItem())
    router.push("/checkout")
  }

  function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: product.name, url: window.location.href }).catch(() => {})
    } else if (typeof navigator !== "undefined") {
      navigator.clipboard?.writeText(window.location.href)
      toast.success("تم نسخ رابط المنتج")
    }
  }

  return (
    <div className="grid gap-10 pb-24 md:grid-cols-2 md:gap-12 md:pb-0">
      <ProductGallery images={product.images} name={product.name} />

      <div>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {product.badges.map((b) => (
            <ProductBadgePill key={b} badge={b} />
          ))}
        </div>

        <h1 className="font-heading text-2xl md:text-3xl">{product.name}</h1>

        <div className="mt-2 flex items-center gap-2 text-sm">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={cn("size-3.5", i < Math.round(product.rating) ? "fill-gold text-gold" : "text-muted-foreground/30")} />
            ))}
          </div>
          <span className="text-muted-foreground">({product.reviewsCount} تقييم)</span>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <span className="text-2xl font-semibold">{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <>
              <span className="text-base text-muted-foreground line-through">{formatPrice(product.compareAtPrice)}</span>
              <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">‎-{discount}%</span>
            </>
          )}
        </div>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{product.shortDescription}</p>

        {product.colors.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 text-sm font-medium">اللون: {color}</p>
            <div className="flex gap-2">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColor(c.name)}
                  aria-label={c.name}
                  className={cn(
                    "size-8 rounded-full border-2 transition-transform",
                    color === c.name ? "border-foreground scale-110" : "border-transparent"
                  )}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>
        )}

        {product.sizes.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 text-sm font-medium">المقاس: {size}</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={cn(
                    "flex h-10 min-w-10 items-center justify-center rounded-md border px-3 text-sm transition-colors",
                    size === s ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground/40"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <p className="mb-2 text-sm font-medium">الكمية</p>
          <div className="flex w-fit items-center gap-3 rounded-md border border-border">
            <button className="flex size-11 items-center justify-center" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="إنقاص الكمية">
              <Minus className="size-4" />
            </button>
            <span className="w-6 text-center text-sm">{quantity}</span>
            <button className="flex size-11 items-center justify-center" onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} aria-label="زيادة الكمية">
              <Plus className="size-4" />
            </button>
          </div>
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium" htmlFor="note">
            ملاحظات إضافية (اختياري)
          </label>
          <Textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="مثال: طول إضافي، تعديل خاص..."
            rows={3}
          />
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" onClick={handleBuyNow} className="h-12 flex-1 rounded-full text-sm">
            شراء الآن
          </Button>
          <Button size="lg" variant="outline" onClick={handleAddToCart} className="h-12 flex-1 gap-2 rounded-full text-sm">
            <ShoppingBag className="size-4" />
            أضيفي للسلة
          </Button>
        </div>

        <div className="mt-3 flex gap-3">
          <button
            onClick={() => toggleWish(product.id)}
            className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full border border-border text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
          >
            <Heart className={cn("size-4", isWished && "fill-destructive text-destructive")} />
            {isWished ? "في المفضلة" : "أضيفي للمفضلة"}
          </button>
          <button
            onClick={handleShare}
            className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full border border-border text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
          >
            <Share2 className="size-4" />
            مشاركة
          </button>
        </div>

        <Tabs defaultValue="description" className="mt-10">
          <TabsList variant="line">
            <TabsTrigger value="description">الوصف</TabsTrigger>
            <TabsTrigger value="specs">تفاصيل المنتج</TabsTrigger>
            <TabsTrigger value="reviews">التقييمات</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="pt-4 leading-relaxed text-muted-foreground">
            {product.description}
          </TabsContent>
          <TabsContent value="specs" className="pt-4">
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between border-b border-border pb-2">
                <dt className="text-muted-foreground">نوع القماش</dt>
                <dd>{product.fabric}</dd>
              </div>
              {product.length && (
                <div className="flex justify-between border-b border-border pb-2">
                  <dt className="text-muted-foreground">الطول</dt>
                  <dd>{product.length}</dd>
                </div>
              )}
              <div className="flex justify-between border-b border-border pb-2">
                <dt className="text-muted-foreground">تعليمات الغسيل</dt>
                <dd>{product.careInstructions}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">التوفر</dt>
                <dd>{product.status === "available" ? "متوفر" : product.status === "preOrder" ? "طلب مسبق" : "نفدت الكمية"}</dd>
              </div>
            </dl>
          </TabsContent>
          <TabsContent value="reviews" className="pt-4">
            {product.reviews.length === 0 ? (
              <p className="text-sm text-muted-foreground">لا توجد تقييمات بعد، كوني أول من يقيّم هذا المنتج</p>
            ) : (
              <div className="space-y-4">
                {product.reviews.map((r) => (
                  <div key={r.id} className="border-b border-border pb-4">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-sm font-medium">{r.customerName}</span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={cn("size-3", i < r.rating ? "fill-gold text-gold" : "text-muted-foreground/30")} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
