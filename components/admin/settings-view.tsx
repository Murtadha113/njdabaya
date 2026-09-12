"use client"

import { useState } from "react"
import { toast } from "sonner"
import type { StoreSettings } from "@/lib/data"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const currencies = [
  { code: "BHD", label: "دينار بحريني (د.ب)" },
  { code: "KWD", label: "دينار كويتي (د.ك)" },
  { code: "SAR", label: "ريال سعودي (ر.س)" },
]

export function SettingsView({ settings }: { settings: StoreSettings }) {
  const [storeName, setStoreName] = useState(settings.storeName)
  const [storeDescription, setStoreDescription] = useState(settings.storeDescription)
  const [currency, setCurrency] = useState(settings.currency)
  const [taxRate, setTaxRate] = useState(String(settings.taxRate))
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(String(settings.freeShippingThreshold))
  const [whatsapp, setWhatsapp] = useState(settings.whatsapp)
  const [email, setEmail] = useState(settings.email)
  const [bankName, setBankName] = useState(settings.bankDetails.bankName)
  const [accountName, setAccountName] = useState(settings.bankDetails.accountName)
  const [iban, setIban] = useState(settings.bankDetails.iban)
  const [saving, setSaving] = useState(false)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeName,
          storeDescription,
          whatsapp,
          email,
          currency,
          taxRate,
          freeShippingThreshold,
          bankDetails: { bankName, accountName, iban },
        }),
      })
      if (!res.ok) throw new Error()
      toast.success("تم حفظ الإعدادات")
    } catch {
      toast.error("تعذّر حفظ الإعدادات")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl">الإعدادات العامة</h1>
        <p className="text-sm text-muted-foreground">إعدادات المتجر الأساسية والعملة</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="rounded-xl border border-border bg-background p-5">
          <h2 className="mb-4 font-heading text-lg">معلومات المتجر</h2>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="storeName">اسم المتجر</Label>
              <Input id="storeName" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="storeDesc">وصف المتجر</Label>
              <Textarea id="storeDesc" rows={3} value={storeDescription} onChange={(e) => setStoreDescription(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="whatsapp">رقم واتساب</Label>
                <Input id="whatsapp" dir="ltr" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="storeEmail">البريد الإلكتروني</Label>
                <Input id="storeEmail" dir="ltr" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background p-5">
          <h2 className="mb-4 font-heading text-lg">العملة والضرائب</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="currency">العملة</Label>
              <Select value={currency} onValueChange={(v) => v && setCurrency(v)}>
                <SelectTrigger id="currency" className="w-full">
                  <SelectValue>{(v: string) => currencies.find((c) => c.code === v)?.label}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="taxRate">نسبة الضريبة %</Label>
              <Input id="taxRate" type="number" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} />
            </div>
          </div>
          <div className="mt-4 space-y-1.5">
            <Label htmlFor="freeShip">حد الشحن المجاني</Label>
            <Input id="freeShip" type="number" step="0.001" value={freeShippingThreshold} onChange={(e) => setFreeShippingThreshold(e.target.value)} />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background p-5">
          <h2 className="font-heading text-lg">التحويل البنكي</h2>
          <p className="mt-1 mb-4 text-xs text-muted-foreground">
            هذي البيانات تظهر للعميلة بصفحة إتمام الطلب إذا اختارت الدفع بالتحويل البنكي، وتوصلك صورة إيصال التحويل مع كل طلب لمراجعتها من صفحة الطلب.
          </p>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="bankName">اسم البنك</Label>
                <Input id="bankName" value={bankName} onChange={(e) => setBankName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="accountName">اسم صاحب الحساب</Label>
                <Input id="accountName" value={accountName} onChange={(e) => setAccountName(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="iban">رقم الآيبان (IBAN)</Label>
              <Input id="iban" dir="ltr" className="font-mono" value={iban} onChange={(e) => setIban(e.target.value)} />
            </div>
          </div>
        </div>

        <Button type="submit" size="lg" disabled={saving}>
          {saving ? "جارِ الحفظ..." : "حفظ الإعدادات"}
        </Button>
      </form>
    </div>
  )
}
