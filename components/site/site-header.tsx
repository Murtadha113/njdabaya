"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { mainNav } from "@/lib/nav"
import { useCartStore, cartTotals } from "@/lib/store/cart-store"
import { useWishlistStore } from "@/lib/store/wishlist-store"
import { CartSheet } from "./cart-sheet"

export function SiteHeader() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const items = useCartStore((s) => s.items)
  const wishlistCount = useWishlistStore((s) => s.productIds.length)
  const { totalItems } = cartTotals(items)

  return (
    <header className="sticky top-0 z-40 border-transparent bg-transparent md:border-b md:border-border md:bg-background/95 md:backdrop-blur md:supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
        <button
          onClick={() => setMenuOpen(true)}
          className="-m-2.5 flex size-11 items-center justify-center md:hidden"
          aria-label="فتح القائمة"
        >
          <Menu className="size-6" />
        </button>

        <Link href="/" className="flex items-center" aria-label="نجد">
          <Image
            src="/images/njd-logo-wordmark.webp"
            alt="نجد"
            width={124}
            height={60}
            priority
            className="h-9 w-auto md:h-10"
          />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm text-foreground/80 transition-colors hover:text-foreground",
                pathname === item.href && "text-foreground font-medium"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link href="/search" aria-label="بحث">
            <Search className="size-5" />
          </Link>
          <Link href="/account" aria-label="حسابي">
            <User className="size-5" />
          </Link>
          <Link href="/wishlist" aria-label="المفضلة" className="relative">
            <Heart className="size-5" />
            {wishlistCount > 0 && (
              <span className="absolute -end-2 -top-2 flex size-4 items-center justify-center rounded-full bg-gold text-[10px] text-gold-foreground">
                {wishlistCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setCartOpen(true)}
            aria-label="السلة"
            className="relative -m-2.5 flex size-11 items-center justify-center"
          >
            <ShoppingBag className="size-5" />
            {totalItems > 0 && (
              <span className="absolute end-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-gold text-[10px] text-gold-foreground">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      <DialogPrimitive.Root open={menuOpen} onOpenChange={setMenuOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm duration-150 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
          <DialogPrimitive.Popup
            className={cn(
              "fixed inset-y-3 left-3 z-50 flex w-[78vw] max-w-[300px] flex-col overflow-hidden rounded-[28px] bg-background shadow-xl shadow-black/20 duration-200",
              "data-open:animate-in data-open:slide-in-from-left-6 data-open:fade-in-0",
              "data-closed:animate-out data-closed:slide-out-to-left-6 data-closed:fade-out-0"
            )}
          >
            <DialogPrimitive.Title className="sr-only">القائمة</DialogPrimitive.Title>
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <Image
                src="/images/njd-logo-wordmark.webp"
                alt="نجد"
                width={124}
                height={60}
                className="h-7 w-auto"
              />
              <DialogPrimitive.Close
                aria-label="إغلاق"
                className="-m-2 flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
              >
                <X className="size-4" />
              </DialogPrimitive.Close>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 py-3">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-3 py-3 text-sm hover:bg-muted"
                >
                  {item.label}
                </Link>
              ))}
              <Link href="/account" onClick={() => setMenuOpen(false)} className="block rounded-xl px-3 py-3 text-sm hover:bg-muted">
                حسابي
              </Link>
              <Link href="/wishlist" onClick={() => setMenuOpen(false)} className="block rounded-xl px-3 py-3 text-sm hover:bg-muted">
                المفضلة
              </Link>
            </nav>
          </DialogPrimitive.Popup>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </header>
  )
}
