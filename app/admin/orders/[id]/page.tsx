import Link from "next/link"
import { OrderDetailView } from "@/components/admin/order-detail-view"
import { getOrderById } from "@/lib/data"

export default async function AdminOrderDetailPage(props: PageProps<"/admin/orders/[id]">) {
  const { id } = await props.params
  const order = await getOrderById(id)

  if (!order) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        <p>لم يتم العثور على هذا الطلب</p>
        <Link href="/admin/orders" className="mt-3 inline-block underline">
          العودة للطلبات
        </Link>
      </div>
    )
  }

  return <OrderDetailView order={order} />
}
