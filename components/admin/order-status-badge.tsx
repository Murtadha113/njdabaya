import type { OrderStatus } from "@/lib/types"
import { ORDER_STATUS_LABELS } from "@/lib/types"
import { cn } from "@/lib/utils"

const styles: Partial<Record<OrderStatus, string>> = {
  new: "bg-blue-100 text-blue-700",
  reviewing: "bg-amber-100 text-amber-700",
  confirmed: "bg-indigo-100 text-indigo-700",
  preparing: "bg-amber-100 text-amber-700",
  readyToShip: "bg-indigo-100 text-indigo-700",
  shipped: "bg-cyan-100 text-cyan-700",
  outForDelivery: "bg-cyan-100 text-cyan-700",
  delivered: "bg-emerald-100 text-emerald-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
  returnRequested: "bg-orange-100 text-orange-700",
  exchangeRequested: "bg-orange-100 text-orange-700",
}

export function OrderStatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  return (
    <span className={cn("inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-medium", styles[status], className)}>
      {ORDER_STATUS_LABELS[status]}
    </span>
  )
}
