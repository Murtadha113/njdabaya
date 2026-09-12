import Link from "next/link"
import { AlertTriangle, Package, Sparkles, Star, TrendingUp, Users } from "lucide-react"
import { StatCard } from "@/components/admin/stat-card"
import { SalesChart } from "@/components/admin/sales-chart"
import { OrderStatusBadge } from "@/components/admin/order-status-badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getCustomers, getOrders, getProducts } from "@/lib/data"
import { formatPrice } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  const [mockOrders, products, adminCustomers] = await Promise.all([
    getOrders(),
    getProducts(),
    getCustomers(),
  ])
  const totalRevenue = mockOrders.reduce((sum, o) => sum + o.total, 0)
  const pendingOrders = mockOrders.filter((o) => ["new", "reviewing", "preparing"].includes(o.status)).length
  const lowStock = products.filter((p) => p.stock <= 12).slice(0, 4)

  return (
    <div className="space-y-6 pt-2">
      <div>
        <p className="text-sm text-muted-foreground">أهلاً بعودتك، نورة 👋</p>
        <h1 className="font-heading text-3xl">نظرة عامة</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard title="إجمالي الإيرادات" value={formatPrice(totalRevenue)} icon={Sparkles} color="pink" trend={{ value: "12% عن الأسبوع الماضي", positive: true }} />
        <StatCard title="الطلبات قيد المعالجة" value={String(pendingOrders)} icon={Package} color="peach" />
        <StatCard title="العملاء" value={String(adminCustomers.length)} icon={Users} color="lavender" trend={{ value: "3 عملاء جدد", positive: true }} />
        <StatCard title="المنتجات" value={String(products.length)} icon={Star} color="sage" />
        <StatCard title="نسبة التحويل" value="3.8%" icon={TrendingUp} color="blue" trend={{ value: "0.4% عن الأسبوع الماضي", positive: true }} />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm shadow-black/[0.03] lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-lg">المبيعات خلال الأسبوع</h2>
          </div>
          <SalesChart />
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm shadow-black/[0.03]">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="size-4 text-[#E0985A]" />
            <h2 className="font-heading text-lg">مخزون منخفض</h2>
          </div>
          <div className="space-y-3">
            {lowStock.map((p) => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <span>{p.name}</span>
                <span className="rounded-full bg-[#F7DEE3] px-2 py-0.5 text-xs text-[#D98AA0]">{p.stock} قطعة</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm shadow-black/[0.03]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg">أحدث الطلبات</h2>
          <Link href="/admin/orders" className="text-sm text-muted-foreground hover:text-foreground">
            عرض الكل
          </Link>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>رقم الطلب</TableHead>
              <TableHead>العميلة</TableHead>
              <TableHead>التاريخ</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>الإجمالي</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockOrders.slice(0, 5).map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  <Link href={`/admin/orders/${order.id}`} className="hover:underline">
                    {order.id}
                  </Link>
                </TableCell>
                <TableCell>{order.customerName}</TableCell>
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

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-[#7CA3C4] to-[#9FC0DA] p-6 text-white sm:p-8">
        <div className="pointer-events-none absolute -left-6 -top-10 size-32 rounded-full bg-[#F7DEE3]/40 blur-sm" />
        <div className="pointer-events-none absolute left-24 bottom-[-40px] size-24 rounded-full bg-[#FBE3D0]/50" />
        <div className="pointer-events-none absolute left-4 top-8 size-10 rounded-full bg-white/30" />
        <div className="relative z-10 max-w-sm">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-white/75">لا تنسي</p>
          <h3 className="font-heading text-xl sm:text-2xl">جهّزي عروض نهاية الأسبوع الآن</h3>
          <Link
            href="/admin/coupons"
            className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-[#7CA3C4]"
          >
            الذهاب إلى الكوبونات
          </Link>
        </div>
      </div>
    </div>
  )
}
