"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { toast } from "sonner"
import type { ShippingMethod } from "@/lib/data"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
    </div>
  )
}
