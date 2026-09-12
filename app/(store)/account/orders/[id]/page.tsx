import Image from "next/image"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { getOrderById } from "@/lib/data"
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/types"
import { formatPrice, cn, imgSrc } from "@/lib/utils"

const fullFlow: OrderStatus[] = [
  "new",
  "confirmed",
  "preparing",
  "readyToShip",
  "shipped",
  "outForDelivery",
  "delivered",
  "completed",
]

export default async function OrderDetailPage(props: PageProps<"/account/orders/[id]">) {
  const { id } = await props.params
  const order = await getOrderById(id)

  if (!order) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        <p>لم يتم العثور على هذا الطلب</p>
        <Link href="/account/orders" className="mt-3 inline-block underline">
          العودة إلى طلباتي
        </Link>
      </div>
    )
  }

  const currentIndex = fullFlow.indexOf(order.status)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-2xl">طلب رقم {order.id}</h2>
        <p className="text-sm text-muted-foreground">{order.date}</p>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-semibold">حالة الطلب</h3>
        <div className="flex flex-wrap gap-y-4">
          {fullFlow.map((step, i) => (
            <div key={step} className="flex flex-1 min-w-[100px] flex-col items-center gap-1.5 text-center">
              <div
                className={cn(
                  "flex size-7 items-center justify-center rounded-full text-xs",
                  i <= currentIndex ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
                )}
              >
                {i <= currentIndex ? <CheckCircle2 className="size-4" /> : i + 1}
              </div>
              <span className={cn("text-xs", i <= currentIndex ? "text-foreground" : "text-muted-foreground")}>
                {ORDER_STATUS_LABELS[step]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-semibold">المنتجات</h3>
        <div className="space-y-4">
          {order.items.map((item, i) => (
            <div key={i} className="flex gap-4">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image src={imgSrc(item.image)} alt={item.name} fill className="object-cover" sizes="80px" />
              </div>
              <div className="flex flex-1 flex-col justify-center">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.color} · مقاس {item.size} · الكمية {item.quantity}
                </p>
              </div>
              <span className="self-center text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between border-t border-border pt-4 text-base font-semibold">
        <span>الإجمالي</span>
        <span>{formatPrice(order.total)}</span>
      </div>
    </div>
  )
}
