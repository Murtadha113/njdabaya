"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import type { Category } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

const emptyForm = { name: "", description: "", showOnHome: true, isSeasonal: false }

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
  onSave: (data: typeof emptyForm) => void
}) {
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (category) {
      setForm({
        name: category.name,
        description: category.description,
        showOnHome: !!category.showOnHome,
        isSeasonal: !!category.isSeasonal,
      })
    } else {
      setForm(emptyForm)
    }
  }, [category, open])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name) {
      toast.error("الرجاء إدخال اسم القسم")
      return
    }
    onSave(form)
    toast.success(category ? "تم تحديث القسم" : "تمت إضافة القسم")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{category ? "تعديل القسم" : "إضافة قسم جديد"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="cName">اسم القسم</Label>
            <Input id="cName" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cDesc">الوصف</Label>
            <Textarea id="cDesc" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="flex items-center justify-between rounded-md border border-border p-3">
            <Label htmlFor="cHome" className="cursor-pointer">إظهار في الصفحة الرئيسية</Label>
            <Switch id="cHome" checked={form.showOnHome} onCheckedChange={(v) => setForm({ ...form, showOnHome: v })} />
          </div>
          <div className="flex items-center justify-between rounded-md border border-border p-3">
            <Label htmlFor="cSeasonal" className="cursor-pointer">مجموعة موسمية</Label>
            <Switch id="cSeasonal" checked={form.isSeasonal} onCheckedChange={(v) => setForm({ ...form, isSeasonal: v })} />
          </div>
          <DialogFooter>
            <Button type="submit">{category ? "حفظ التغييرات" : "إضافة القسم"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
