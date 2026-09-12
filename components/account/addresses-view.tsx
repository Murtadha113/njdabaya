"use client"

import { useState } from "react"
import { MapPin, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useAuthStore } from "@/lib/store/auth-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function AddressesView({ cities }: { cities: string[] }) {
  const addresses = useAuthStore((s) => s.addresses)
  const addAddress = useAuthStore((s) => s.addAddress)
  const removeAddress = useAuthStore((s) => s.removeAddress)

  const [label, setLabel] = useState("")
  const [city, setCity] = useState(cities[0])
  const [details, setDetails] = useState("")

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!label || !details) {
      toast.error("الرجاء تعبئة جميع الحقول")
      return
    }
    addAddress({ label, city, details })
    setLabel("")
    setDetails("")
    toast.success("تم حفظ العنوان")
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-4 font-heading text-lg">عناويني المحفوظة</h2>
        {addresses.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-10 text-center">
            <MapPin className="size-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">لا توجد عناوين محفوظة بعد</p>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((addr) => (
              <div key={addr.id} className="flex items-center justify-between rounded-lg border border-border p-4 text-sm">
                <div>
                  <p className="font-medium">{addr.label}</p>
                  <p className="text-muted-foreground">{addr.city} · {addr.details}</p>
                </div>
                <button onClick={() => removeAddress(addr.id)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-4 font-heading text-lg">إضافة عنوان جديد</h2>
        <form onSubmit={handleAdd} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="label">اسم العنوان</Label>
            <Input id="label" placeholder="المنزل، العمل..." value={label} onChange={(e) => setLabel(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="addrCity">المدينة</Label>
            <Select value={city} onValueChange={(v) => v && setCity(v)}>
              <SelectTrigger id="addrCity" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cities.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="details">التفاصيل</Label>
            <Input id="details" placeholder="المنطقة، الشارع، رقم المبنى" value={details} onChange={(e) => setDetails(e.target.value)} />
          </div>
          <Button type="submit" className="sm:col-span-2 sm:w-fit">حفظ العنوان</Button>
        </form>
      </div>
    </div>
  )
}
