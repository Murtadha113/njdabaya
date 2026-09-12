import { OrdersView } from "@/components/admin/orders-view"
import { getOrders } from "@/lib/data"

export const dynamic = "force-dynamic"

export default async function AdminOrdersPage() {
  const orders = await getOrders()
  return <OrdersView orders={orders} />
}
