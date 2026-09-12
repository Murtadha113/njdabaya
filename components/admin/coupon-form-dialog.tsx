"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const emptyForm = { code: "", type: "percentage" as "percentage" | "fixed", value: "", minOrder: "", usageLimit: "" }

export function CouponFormDialog({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: typeof emptyForm) => void
}) {
  const [form, setForm] = useState(emptyForm)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.code || !form.value) {
      toast.error("الرجاء تعبئة رمز الكوبون والقيمة")
      return
    }
    onSave(form)
    toast.success("تمت إضافة الكوبون")
    onOpenChange(false)
    setForm(emptyForm)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>إضافة كوبون جديد</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="couponCode">رمز الكوبون</Label>
            <Input id="couponCode" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="EXAMPLE10" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="couponType">نوع الخصم</Label>
              <Select value={form.type} onValueChange={(v) => v && setForm({ ...form, type: v as "percentage" | "fixed" })}>
                <SelectTrigger id="couponType" className="w-full">
                  <SelectValue>{(v: string) => (v === "percentage" ? "نسبة مئوية %" : "مبلغ ثابت")}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">نسبة مئوية %</SelectItem>
                  <SelectItem value="fixed">مبلغ ثابت</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="couponValue">القيمة</Label>
              <Input id="couponValue" type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="couponMin">الحد الأدنى للطلب</Label>
              <Input id="couponMin" type="number" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="couponLimit">حد الاستخدام</Label>
              <Input id="couponLimit" type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">إضافة الكوبون</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
