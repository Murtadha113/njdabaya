"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuthStore } from "@/lib/store/auth-store"

export default function LoginPage() {
  const router = useRouter()
  const login = useAuthStore((s) => s.login)

  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  const [regName, setRegName] = useState("")
  const [regEmail, setRegEmail] = useState("")
  const [regPhone, setRegPhone] = useState("")
  const [regPassword, setRegPassword] = useState("")

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!loginEmail || !loginPassword) {
      toast.error("الرجاء تعبئة البريد الإلكتروني وكلمة المرور")
      return
    }
    login(loginEmail)
    toast.success("تم تسجيل الدخول بنجاح")
    router.push("/account")
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!regName || !regEmail || !regPhone || !regPassword) {
      toast.error("الرجاء تعبئة جميع الحقول")
      return
    }
    login(regEmail, regName)
    toast.success("تم إنشاء الحساب بنجاح، أهلاً بك")
    router.push("/account")
  }

  return (
    <div className="mx-auto max-w-md px-4 py-14 md:py-20">
      <h1 className="mb-8 text-center font-heading text-3xl">حسابي</h1>

      <Tabs defaultValue="login">
        <TabsList className="w-full">
          <TabsTrigger value="login" className="flex-1">تسجيل الدخول</TabsTrigger>
          <TabsTrigger value="register" className="flex-1">حساب جديد</TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="pt-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="loginEmail">البريد الإلكتروني</Label>
              <Input id="loginEmail" type="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="loginPassword">كلمة المرور</Label>
              <Input id="loginPassword" type="password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
            </div>
            <Button type="submit" size="lg" className="w-full">تسجيل الدخول</Button>
          </form>
        </TabsContent>

        <TabsContent value="register" className="pt-6">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="regName">الاسم الكامل</Label>
              <Input id="regName" required value={regName} onChange={(e) => setRegName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="regEmail">البريد الإلكتروني</Label>
              <Input id="regEmail" type="email" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="regPhone">رقم الهاتف</Label>
              <Input id="regPhone" type="tel" required value={regPhone} onChange={(e) => setRegPhone(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="regPassword">كلمة المرور</Label>
              <Input id="regPassword" type="password" required value={regPassword} onChange={(e) => setRegPassword(e.target.value)} />
            </div>
            <Button type="submit" size="lg" className="w-full">إنشاء الحساب</Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  )
}
