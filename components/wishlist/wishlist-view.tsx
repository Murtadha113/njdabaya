"use client"

import Link from "next/link"
import { Heart } from "lucide-react"
import { useWishlistStore } from "@/lib/store/wishlist-store"
import type { Product } from "@/lib/types"
import { ProductCard } from "@/components/site/product-card"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function WishlistView({ products }: { products: Product[] }) {
  const productIds = useWishlistStore((s) => s.productIds)
  const wishedProducts = products.filter((p) => productIds.includes(p.id))

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
      <h1 className="mb-8 font-heading text-3xl">المفضلة</h1>

      {wishedProducts.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <Heart className="size-12 text-muted-foreground" />
          <p className="text-muted-foreground">لم تضيفي أي منتج إلى المفضلة بعد</p>
          <Link href="/products" className={cn(buttonVariants({ size: "lg" }))}>
            تسوّقي الآن
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
          {wishedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
