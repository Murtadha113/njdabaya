"use client"

import Link from "next/link"
import { Package, Heart, MapPin } from "lucide-react"
import { useAuthStore } from "@/lib/store/auth-store"
import { useWishlistStore } from "@/lib/store/wishlist-store"
import { ORDER_STATUS_LABELS } from "@/lib/types"
import type { MockOrder } from "@/lib/data"
import { formatPrice } from "@/lib/utils"

export function AccountOverview({ orders }: { orders: MockOrder[] }) {
  const name = useAuthStore((s) => s.name)
  const addresses = useAuthStore((s) => s.addresses)
  const wishlistCount = useWishlistStore((s) => s.productIds.length)

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-muted-foreground">أهلاً بعودتك</p>
        <h2 className="font-heading text-2xl">{name || "عميلتنا العزيزة"}</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/account/orders" className="rounded-xl border border-border p-5 hover:border-foreground/30">
          <Package className="mb-3 size-5 text-gold" />
          <p className="text-2xl font-semibold">{orders.length}</p>
          <p className="text-sm text-muted-foreground">طلباتي</p>
        </Link>
        <Link href="/wishlist" className="rounded-xl border border-border p-5 hover:border-foreground/30">
          <Heart className="mb-3 size-5 text-gold" />
          <p className="text-2xl font-semibold">{wishlistCount}</p>
          <p className="text-sm text-muted-foreground">المفضلة</p>
        </Link>
        <Link href="/account/addresses" className="rounded-xl border border-border p-5 hover:border-foreground/30">
          <MapPin className="mb-3 size-5 text-gold" />
          <p className="text-2xl font-semibold">{addresses.length}</p>
          <p className="text-sm text-muted-foreground">العناوين المحفوظة</p>
        </Link>
      </div>

      <div>
        <h3 className="mb-4 font-heading text-lg">آخر الطلبات</h3>
        <div className="space-y-3">
          {orders.slice(0, 3).map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="flex items-center justify-between rounded-lg border border-border p-4 text-sm hover:border-foreground/30"
            >
              <div>
                <p className="font-medium">{order.id}</p>
                <p className="text-xs text-muted-foreground">{order.date}</p>
              </div>
              <span className="rounded-full bg-muted px-3 py-1 text-xs">{ORDER_STATUS_LABELS[order.status]}</span>
              <span className="font-medium">{formatPrice(order.total)}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
