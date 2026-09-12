import Link from "next/link"
import { Package } from "lucide-react"
import { getOrders } from "@/lib/data"
import { ORDER_STATUS_LABELS } from "@/lib/types"
import { formatPrice } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default async function OrdersPage() {
  const orders = await getOrders()

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <Package className="size-10 text-muted-foreground" />
        <p className="text-muted-foreground">لا توجد طلبات سابقة</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/account/orders/${order.id}`}
          className="flex flex-col gap-2 rounded-lg border border-border p-4 text-sm hover:border-foreground/30 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-medium">طلب رقم {order.id}</p>
            <p className="text-xs text-muted-foreground">{order.date} · {order.items.length} منتج</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-fit rounded-full bg-muted px-3 py-1 text-xs">{ORDER_STATUS_LABELS[order.status]}</span>
            <span className="font-medium">{formatPrice(order.total)}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}
