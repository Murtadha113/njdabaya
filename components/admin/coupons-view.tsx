"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { Coupon } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CouponFormDialog } from "@/components/admin/coupon-form-dialog"

export function CouponsView({ coupons: initialCoupons }: { coupons: Coupon[] }) {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons)
  const [formOpen, setFormOpen] = useState(false)

  async function handleSave(data: { code: string; type: "percentage" | "fixed"; value: string; minOrder: string; usageLimit: string }) {
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      toast.error("تعذّر إضافة الكوبون")
      return
    }
    const created = await res.json()
    setCoupons((prev) => [created as Coupon, ...prev])
    toast.success("تمت إضافة الكوبون")
  }

  async function toggleActive(id: string) {
    const coupon = coupons.find((c) => c.id === id)
    if (!coupon) return
    const nextActive = !coupon.isActive
    const res = await fetch(`/api/admin/coupons/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: nextActive }),
    })
    if (!res.ok) {
      toast.error("تعذّر تحديث الكوبون")
      return
    }
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, isActive: nextActive } : c)))
  }

  async function remove(id: string) {
    const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" })
    if (!res.ok) {
      toast.error("تعذّر حذف الكوبون")
      return
    }
    setCoupons((prev) => prev.filter((c) => c.id !== id))
    toast.success("تم حذف الكوبون")
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-2xl">الكوبونات والعروض</h1>
          <p className="text-sm text-muted-foreground">{coupons.length} كوبون</p>
        </div>
        <Button onClick={() => setFormOpen(true)} className="gap-1.5">
          <Plus className="size-4" />
          إضافة كوبون
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الرمز</TableHead>
              <TableHead>الخصم</TableHead>
              <TableHead>الحد الأدنى</TableHead>
              <TableHead>الاستخدام</TableHead>
              <TableHead>مفعّل</TableHead>
              <TableHead>إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <Badge variant="outline" className="font-mono">{c.code}</Badge>
                </TableCell>
                <TableCell>{c.type === "percentage" ? `${c.value}%` : `${c.value.toFixed(3)} د.ب`}</TableCell>
                <TableCell className="text-muted-foreground">{c.minOrder ? `${c.minOrder} د.ب` : "—"}</TableCell>
                <TableCell className="text-muted-foreground">
                  {c.usedCount}{c.usageLimit ? ` / ${c.usageLimit}` : ""}
                </TableCell>
                <TableCell>
                  <Switch checked={c.isActive} onCheckedChange={() => toggleActive(c.id)} />
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon-sm" onClick={() => remove(c.id)} aria-label="حذف">
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CouponFormDialog open={formOpen} onOpenChange={setFormOpen} onSave={handleSave} />
    </div>
  )
}
