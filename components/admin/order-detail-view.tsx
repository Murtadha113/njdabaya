"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import { CheckCircle2, Printer } from "lucide-react"
import type { MockOrder } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/types"
import { formatPrice, cn, imgSrc } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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

export function OrderDetailView({ order: initialOrder }: { order: MockOrder }) {
  const [order, setOrder] = useState(initialOrder)
  const [status, setStatus] = useState<OrderStatus>(initialOrder.status)
  const [note, setNote] = useState("")
  const [paymentConfirmed, setPaymentConfirmed] = useState(initialOrder.paymentConfirmed ?? false)
  const [savingStatus, setSavingStatus] = useState(false)
  const [confirmingPayment, setConfirmingPayment] = useState(false)

  const currentIndex = fullFlow.indexOf(status)

  async function saveStatus() {
    setSavingStatus(true)
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()
      setOrder((o) => ({ ...o, status }))
      toast.success("تم تحديث حالة الطلب", { description: ORDER_STATUS_LABELS[status] })
    } catch {
      toast.error("تعذّر تحديث حالة الطلب")
    } finally {
      setSavingStatus(false)
    }
  }

  async function confirmPayment() {
    setConfirmingPayment(true)
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentConfirmed: true }),
      })
      if (!res.ok) throw new Error()
      setPaymentConfirmed(true)
      toast.success("تم تأكيد استلام التحويل البنكي")
    } catch {
      toast.error("تعذّر تأكيد الدفع")
    } finally {
      setConfirmingPayment(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-2xl">طلب رقم {order.id}</h1>
          <p className="text-sm text-muted-foreground">{order.date}</p>
        </div>
        <Button variant="outline" className="w-fit gap-1.5" onClick={() => toast.info("جارِ تجهيز الفاتورة للطباعة")}>
          <Printer className="size-4" />
          طباعة الفاتورة
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-border bg-background p-5">
            <h2 className="mb-4 font-heading text-lg">حالة الطلب</h2>
            <div className="mb-5 flex flex-wrap gap-y-4">
              {fullFlow.map((step, i) => (
                <div key={step} className="flex min-w-[90px] flex-1 flex-col items-center gap-1.5 text-center">
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
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1 space-y-1.5">
                <Label htmlFor="statusSelect">تحديث الحالة</Label>
                <Select value={status} onValueChange={(v) => v && setStatus(v as OrderStatus)}>
                  <SelectTrigger id="statusSelect" className="w-full">
                    <SelectValue>{(v: string) => ORDER_STATUS_LABELS[v as OrderStatus]}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={saveStatus} disabled={savingStatus}>
                {savingStatus ? "..." : "حفظ الحالة"}
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background p-5">
            <h2 className="mb-4 font-heading text-lg">المنتجات</h2>
            <div className="space-y-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image src={imgSrc(item.image)} alt={item.name} fill className="object-cover" sizes="64px" />
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
            <div className="mt-4 flex justify-between border-t border-border pt-4 text-base font-semibold">
              <span>الإجمالي</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background p-5">
            <Label htmlFor="internalNote" className="mb-2 block">ملاحظات داخلية</Label>
            <Textarea id="internalNote" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="ملاحظات خاصة بفريق العمل، لا تظهر للعميلة" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-background p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-heading text-lg">الدفع</h2>
              <Badge variant={order.paymentMethod === "cod" ? "secondary" : paymentConfirmed ? "default" : "outline"}>
                {order.paymentMethod === "cod" ? "الدفع عند الاستلام" : paymentConfirmed ? "تحويل بنكي مؤكد" : "بانتظار تأكيد التحويل"}
              </Badge>
            </div>
            {order.paymentMethod === "bankTransfer" && (
              <div className="space-y-3">
                {order.paymentProof ? (
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted">
                    <Image src={order.paymentProof} alt="إيصال التحويل" fill className="object-cover" sizes="300px" />
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">لم تُرفع صورة إيصال بعد</p>
                )}
                {!paymentConfirmed && (
                  <Button size="sm" className="w-full" onClick={confirmPayment} disabled={confirmingPayment}>
                    {confirmingPayment ? "..." : "تأكيد استلام التحويل"}
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border bg-background p-5">
            <h2 className="mb-3 font-heading text-lg">بيانات العميلة</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">الاسم</dt>
                <dd>{order.customerName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">الهاتف</dt>
                <dd dir="ltr">{order.customerPhone}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">المدينة</dt>
                <dd>{order.city}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
