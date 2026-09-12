"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useAuthStore } from "@/lib/store/auth-store"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
  const { name, email, phone, updateProfile } = useAuthStore()
  const [form, setForm] = useState({ name, email, phone })

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    updateProfile(form)
    toast.success("تم حفظ التغييرات")
  }

  return (
    <div className="max-w-md space-y-6">
      <h2 className="font-heading text-lg">إعدادات الحساب</h2>
      <form onSubmit={handleSave} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="settingsName">الاسم الكامل</Label>
          <Input id="settingsName" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="settingsEmail">البريد الإلكتروني</Label>
          <Input id="settingsEmail" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="settingsPhone">رقم الهاتف</Label>
          <Input id="settingsPhone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <Button type="submit">حفظ التغييرات</Button>
      </form>
    </div>
  )
}
