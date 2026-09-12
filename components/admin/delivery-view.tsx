"use client"

import { useState } from "react"
import { Plus, Trash2, X } from "lucide-react"
import { toast } from "sonner"
import type { ShippingMethod } from "@/lib/data"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function DeliveryView({
  shippingMethods: initialMethods,
  cities: initialCities,
}: {
  shippingMethods: ShippingMethod[]
  cities: string[]
}) {
  const [methods, setMethods] = useState(initialMethods.map((m) => ({ ...m, isActive: m.isActive ?? true })))
  const [cities, setCities] = useState(initialCities)
  const [newCity, setNewCity] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<ShippingMethod | null>(null)

  const [newMethod, setNewMethod] = useState({ name: "", description: "", price: "" })

  async function updatePrice(id: string, price: string) {
    const value = Number(price) || 0
    setMethods((prev) => prev.map((m) => (m.id === id ? { ...m, price: value } : m)))
    await fetch(`/api/admin/shipping-methods/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price: value }),
    })
  }

  async function toggleActive(id: string) {
    const method = methods.find((m) => m.id === id)
    if (!method) return
    const nextActive = !method.isActive
    const res = await fetch(`/api/admin/shipping-methods/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: nextActive }),
    })
    if (!res.ok) {
      toast.error("تعذّر تحديث طريقة التوصيل")
      return
    }
    setMethods((prev) => prev.map((m) => (m.id === id ? { ...m, isActive: nextActive } : m)))
  }

  async function addMethod(e: React.FormEvent) {
    e.preventDefault()
    if (!newMethod.name.trim()) return
    const res = await fetch("/api/admin/shipping-methods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newMethod.name.trim(),
        description: newMethod.description.trim(),
        price: Number(newMethod.price) || 0,
      }),
    })
    if (!res.ok) {
      toast.error("تعذّر إضافة طريقة التوصيل")
      return
    }
    const created = (await res.json()) as ShippingMethod
    setMethods((prev) => [...prev, { ...created, isActive: created.isActive ?? true }])
    setNewMethod({ name: "", description: "", price: "" })
    toast.success("تمت إضافة طريقة التوصيل")
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    const res = await fetch(`/api/admin/shipping-methods/${deleteTarget.id}`, { method: "DELETE" })
    if (!res.ok) {
      toast.error("تعذّر حذف طريقة التوصيل")
      return
    }
    setMethods((prev) => prev.filter((m) => m.id !== deleteTarget.id))
    toast.success("تم حذف طريقة التوصيل")
    setDeleteTarget(null)
  }

  async function saveCities(next: string[]) {
    setCities(next)
    await fetch("/api/admin/cities", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cities: next }),
    })
  }

  function addCity(e: React.FormEvent) {
    e.preventDefault()
    if (!newCity.trim()) return
    saveCities([...cities, newCity.trim()])
    setNewCity("")
    toast.success("تمت إضافة المدينة")
  }

  function removeCity(city: string) {
    saveCities(cities.filter((c) => c !== city))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl">التوصيل والشحن</h1>
        <p className="text-sm text-muted-foreground">إدارة طرق الشحن والمناطق المشمولة</p>
      </div>

      <div className="rounded-xl border border-border bg-background p-5">
        <h2 className="mb-4 font-heading text-lg">طرق التوصيل</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الطريقة</TableHead>
              <TableHead>مدة التوصيل</TableHead>
              <TableHead>السعر (د.ب)</TableHead>
              <TableHead>مفعّلة</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {methods.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="font-medium">{m.name}</TableCell>
                <TableCell className="text-muted-foreground">{m.description}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.001"
                    value={m.price}
                    onChange={(e) => updatePrice(m.id, e.target.value)}
                    className="w-28"
                  />
                </TableCell>
                <TableCell>
                  <Switch checked={m.isActive} onCheckedChange={() => toggleActive(m.id)} />
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => setDeleteTarget(m)}
                    aria-label={`حذف ${m.name}`}
                    className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <form onSubmit={addMethod} className="mt-5 flex flex-col gap-2 border-t border-border pt-5 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="methodName" className="text-xs">اسم الطريقة</Label>
            <Input id="methodName" placeholder="مثال: شحن دولي" value={newMethod.name} onChange={(e) => setNewMethod((s) => ({ ...s, name: e.target.value }))} />
          </div>
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="methodDesc" className="text-xs">مدة التوصيل</Label>
            <Input id="methodDesc" placeholder="مثال: 5 إلى 7 أيام" value={newMethod.description} onChange={(e) => setNewMethod((s) => ({ ...s, description: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="methodPrice" className="text-xs">السعر (د.ب)</Label>
            <Input id="methodPrice" type="number" step="0.001" placeholder="0.000" className="w-28" value={newMethod.price} onChange={(e) => setNewMethod((s) => ({ ...s, price: e.target.value }))} />
          </div>
          <Button type="submit" className="gap-1.5">
            <Plus className="size-4" />
            إضافة طريقة
          </Button>
        </form>
      </div>

      <div className="rounded-xl border border-border bg-background p-5">
        <h2 className="mb-4 font-heading text-lg">المدن المشمولة بالتوصيل</h2>
        <div className="mb-4 flex flex-wrap gap-2">
          {cities.map((city) => (
            <span key={city} className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-sm">
              {city}
              <button onClick={() => removeCity(city)} aria-label={`حذف ${city}`}>
                <X className="size-3.5 text-muted-foreground hover:text-destructive" />
              </button>
            </span>
          ))}
        </div>
        <form onSubmit={addCity} className="flex max-w-sm gap-2">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="newCity" className="sr-only">مدينة جديدة</Label>
            <Input id="newCity" value={newCity} onChange={(e) => setNewCity(e.target.value)} placeholder="اسم المدينة" />
          </div>
          <Button type="submit" size="icon" aria-label="إضافة">
            <Plus className="size-4" />
          </Button>
        </form>
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف طريقة التوصيل</AlertDialogTitle>
            <AlertDialogDescription>
              متأكدة تبين تحذفين "{deleteTarget?.name}"؟ هذا الإجراء ما يرجع.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-white hover:bg-destructive/90">
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
