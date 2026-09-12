"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Grid2x2, Heart, Home, ShoppingBag, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { bottomNavItems } from "@/lib/nav"
import { useCartStore, cartTotals } from "@/lib/store/cart-store"
import { useWishlistStore } from "@/lib/store/wishlist-store"

const icons = {
  home: Home,
  grid: Grid2x2,
  heart: Heart,
  bag: ShoppingBag,
  user: User,
}

export function BottomNav() {
  const pathname = usePathname()
  const items = useCartStore((s) => s.items)
  const wishlistCount = useWishlistStore((s) => s.productIds.length)
  const { totalItems } = cartTotals(items)

  const badges: Record<string, number> = {
    "/cart": totalItems,
    "/wishlist": wishlistCount,
  }

  return (
    <nav className="fixed inset-x-4 bottom-4 z-40 md:hidden">
      <div className="flex items-center justify-between gap-1 rounded-full bg-primary/95 p-1.5 shadow-lg shadow-black/20 backdrop-blur">
        {bottomNavItems.map((item) => {
          const Icon = icons[item.icon]
          const active = pathname === item.href
          const badge = badges[item.href]
          return (
            <Link key={item.href} href={item.href} className="relative">
              <motion.span
                layout
                transition={{ type: "spring", stiffness: 500, damping: 34 }}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-2.5 text-xs font-medium",
                  active
                    ? "bg-background text-foreground shadow-sm"
                    : "text-primary-foreground/65"
                )}
              >
                <span className="relative flex size-5 shrink-0 items-center justify-center">
                  <Icon className="size-5" />
                  {!!badge && (
                    <span className="absolute -end-2 -top-2 flex size-3.5 items-center justify-center rounded-full bg-gold text-[9px] text-gold-foreground">
                      {badge}
                    </span>
                  )}
                </span>
                {active && <span className="whitespace-nowrap">{item.label}</span>}
              </motion.span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
