import { getCustomers } from "@/lib/data"
import { formatPrice } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export const dynamic = "force-dynamic"

export default async function AdminCustomersPage() {
  const adminCustomers = await getCustomers()
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-heading text-2xl">العملاء</h1>
        <p className="text-sm text-muted-foreground">{adminCustomers.length} عميلة مسجّلة</p>
      </div>

      <div className="rounded-xl border border-border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الاسم</TableHead>
              <TableHead>الهاتف</TableHead>
              <TableHead>المدينة</TableHead>
              <TableHead>عدد الطلبات</TableHead>
              <TableHead>إجمالي الإنفاق</TableHead>
              <TableHead>آخر طلب</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adminCustomers.map((c) => (
              <TableRow key={c.phone}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell dir="ltr" className="text-muted-foreground">{c.phone}</TableCell>
                <TableCell className="text-muted-foreground">{c.city}</TableCell>
                <TableCell>{c.ordersCount}</TableCell>
                <TableCell>{formatPrice(c.totalSpent)}</TableCell>
                <TableCell className="text-muted-foreground">{c.lastOrderDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
