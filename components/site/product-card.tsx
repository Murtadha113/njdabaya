"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingBag } from "lucide-react"
import { cn, formatPrice, discountPercent, imgSrc } from "@/lib/utils"
import type { Product } from "@/lib/types"
import { ProductBadgePill } from "./product-badge"
import { useWishlistStore } from "@/lib/store/wishlist-store"
import { useCartStore } from "@/lib/store/cart-store"
import { toast } from "sonner"

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const isWished = useWishlistStore((s) => s.has(product.id))
  const toggleWish = useWishlistStore((s) => s.toggle)
  const addItem = useCartStore((s) => s.addItem)
  const discount = discountPercent(product.price, product.compareAtPrice)

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: imgSrc(product.images[0]),
      price: product.price,
      color: product.colors[0]?.name ?? "",
      size: product.sizes[0] ?? "",
      quantity: 1,
    })
    toast.success("أُضيف المنتج إلى السلة", { description: product.name })
  }

  function toggleWishlist(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    toggleWish(product.id)
  }

  return (
    <Link href={`/products/${product.slug}`} className={cn("group block", className)}>
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted ring-1 ring-transparent transition-all duration-300 group-hover:ring-gold/60">
        <Image
          src={imgSrc(product.images[0])}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className={cn(
            "object-cover transition-all duration-500 ease-out group-hover:scale-[1.04]",
            product.images[1] && "group-hover:opacity-0"
          )}
        />
        {product.images[1] && (
          <Image
            src={product.images[1]}
            alt=""
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover opacity-0 transition-all duration-500 ease-out group-hover:scale-[1.04] group-hover:opacity-100"
          />
        )}

        <div className="absolute inset-x-2 top-2 flex flex-wrap gap-1.5">
          {product.badges.map((b) => (
            <ProductBadgePill key={b} badge={b} />
          ))}
        </div>

        <button
          onClick={toggleWishlist}
          aria-label="إضافة للمفضلة"
          className="absolute end-2 top-2 flex size-8 items-center justify-center rounded-full bg-background/80 backdrop-blur transition-transform hover:scale-105"
        >
          <Heart className={cn("size-4", isWished ? "fill-destructive text-destructive" : "text-foreground")} />
        </button>

        <button
          onClick={quickAdd}
          className="absolute inset-x-2 bottom-2 flex translate-y-10 items-center justify-center gap-1.5 rounded-md bg-primary py-2 text-xs font-medium text-primary-foreground opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100"
        >
          <ShoppingBag className="size-3.5" />
          أضيفي للسلة
        </button>
      </div>

      <div className="mt-3 space-y-1">
        <h3 className="text-sm font-medium text-foreground">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <>
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
              <span className="text-xs font-medium text-destructive">‎-{discount}%</span>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}
