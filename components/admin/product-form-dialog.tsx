"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import type { Product, ProductBadge, Category } from "@/lib/types"
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
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const ALL_BADGES: ProductBadge[] = ["جديد", "الأكثر مبيعاً", "خصم", "محدود الكمية", "حصري"]

function makeEmptyForm(categories: Category[]) {
  return {
    name: "",
    price: "",
    compareAtPrice: "",
    categoryId: categories[0]?.id ?? "",
    stock: "",
    fabric: "",
    shortDescription: "",
    badges: [] as ProductBadge[],
  }
}

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  categories,
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product | null
  categories: Category[]
  onSave: (data: ReturnType<typeof makeEmptyForm>) => void
}) {
  const [form, setForm] = useState(() => makeEmptyForm(categories))

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        price: String(product.price),
        compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : "",
        categoryId: product.categoryId,
        stock: String(product.stock),
        fabric: product.fabric,
        shortDescription: product.shortDescription,
        badges: product.badges,
      })
    } else {
      setForm(makeEmptyForm(categories))
    }
  }, [product, open, categories])

  function toggleBadge(badge: ProductBadge) {
    setForm((f) => ({
      ...f,
      badges: f.badges.includes(badge) ? f.badges.filter((b) => b !== badge) : [...f.badges, badge],
    }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.price) {
      toast.error("الرجاء تعبئة اسم المنتج والسعر")
      return
    }
    onSave(form)
    toast.success(product ? "تم تحديث المنتج" : "تمت إضافة المنتج")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{product ? "تعديل المنتج" : "إضافة منتج جديد"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="pName">اسم المنتج</Label>
            <Input id="pName" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="pPrice">السعر (د.ب)</Label>
              <Input id="pPrice" type="number" step="0.001" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pCompare">السعر قبل الخصم</Label>
              <Input id="pCompare" type="number" step="0.001" value={form.compareAtPrice} onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="pCategory">التصنيف</Label>
              <Select value={form.categoryId} onValueChange={(v) => v && setForm({ ...form, categoryId: v })}>
                <SelectTrigger id="pCategory" className="w-full">
                  <SelectValue>{(v: string) => categories.find((c) => c.id === v)?.name}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pStock">الكمية المتوفرة</Label>
              <Input id="pStock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pFabric">نوع القماش</Label>
            <Input id="pFabric" value={form.fabric} onChange={(e) => setForm({ ...form, fabric: e.target.value })} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pDesc">وصف مختصر</Label>
            <Textarea id="pDesc" rows={3} value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} />
          </div>

          <div className="space-y-2">
            <Label>الشارات</Label>
            <div className="flex flex-wrap gap-4">
              {ALL_BADGES.map((badge) => (
                <label key={badge} className="flex items-center gap-2 text-sm">
                  <Checkbox checked={form.badges.includes(badge)} onCheckedChange={() => toggleBadge(badge)} />
                  {badge}
                </label>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">{product ? "حفظ التغييرات" : "إضافة المنتج"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
