"use client"

import { useState } from "react"
import Link from "next/link"
import type { MockOrder } from "@/lib/data"
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/types"
import { formatPrice } from "@/lib/utils"
import { OrderStatusBadge } from "@/components/admin/order-status-badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const statusFilters: ("all" | OrderStatus)[] = [
  "all",
  "new",
  "confirmed",
  "preparing",
  "shipped",
  "delivered",
  "completed",
  "cancelled",
  "returnRequested",
]

export function OrdersView({ orders }: { orders: MockOrder[] }) {
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all")

  const filtered = statusFilter === "all" ? orders : orders.filter((o) => o.status === statusFilter)

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-2xl">الطلبات</h1>
          <p className="text-sm text-muted-foreground">{orders.length} طلب إجمالي</p>
        </div>
        <Select value={statusFilter} onValueChange={(v) => v && setStatusFilter(v as "all" | OrderStatus)}>
          <SelectTrigger className="w-52">
            <SelectValue>
              {(v: string) => (v === "all" ? "كل الحالات" : ORDER_STATUS_LABELS[v as OrderStatus])}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {statusFilters.map((s) => (
              <SelectItem key={s} value={s}>
                {s === "all" ? "كل الحالات" : ORDER_STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>رقم الطلب</TableHead>
              <TableHead>العميلة</TableHead>
              <TableHead>المدينة</TableHead>
              <TableHead>التاريخ</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>الإجمالي</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  <Link href={`/admin/orders/${order.id}`} className="hover:underline">
                    {order.id}
                  </Link>
                </TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell className="text-muted-foreground">{order.city}</TableCell>
                <TableCell className="text-muted-foreground">{order.date}</TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell>{formatPrice(order.total)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
