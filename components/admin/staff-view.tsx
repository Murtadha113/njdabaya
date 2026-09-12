"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { ADMIN_ROLE_LABELS, type AdminStaff } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function StaffView({ staff: initialStaff }: { staff: AdminStaff[] }) {
  const [staff, setStaff] = useState<AdminStaff[]>(initialStaff)

  async function toggleActive(id: string) {
    const member = staff.find((s) => s.id === id)
    if (!member) return
    const nextActive = !member.isActive
    const res = await fetch(`/api/admin/staff/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: nextActive }),
    })
    if (!res.ok) {
      toast.error("تعذّر تحديث حالة المستخدم")
      return
    }
    setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, isActive: nextActive } : s)))
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-2xl">المستخدمون والصلاحيات</h1>
          <p className="text-sm text-muted-foreground">إدارة فريق العمل وأدوارهم</p>
        </div>
        <Button className="gap-1.5">
          <Plus className="size-4" />
          إضافة مستخدم
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الاسم</TableHead>
              <TableHead>البريد الإلكتروني</TableHead>
              <TableHead>الدور</TableHead>
              <TableHead>آخر نشاط</TableHead>
              <TableHead>مفعّل</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell dir="ltr" className="text-muted-foreground">{s.email}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{ADMIN_ROLE_LABELS[s.role]}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{s.lastActive}</TableCell>
                <TableCell>
                  <Switch checked={s.isActive} onCheckedChange={() => toggleActive(s.id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
