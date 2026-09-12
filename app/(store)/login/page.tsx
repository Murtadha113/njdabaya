"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, Lock, Mail, Phone, User as UserIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/lib/store/auth-store"
import { cn } from "cn"

type Mode = "login" | "register"

function FieldWithIcon({
  icon: Icon,
  trailing,
  ...props
}: React.ComponentProps<typeof Input> & { icon: typeof UserIcon; trailing?: React.ReactNode }) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        {...props}
        className={cn("h-12 rounded-full border-border/80 bg-muted/40 ps-11 pe-11 text-sm", props.className)}
      />
      {trailing && <div className="absolute end-3 top-1/2 -translate-y-1/2">{trailing}</div>}
    </div>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const login = useAuthStore((s) => s.login)
  const [mode, setMode] = useState<Mode>("login")
  const [showPassword, setShowPassword] = useState(false)

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

  function handleSocial(name: string) {
    toast.info(`تسجيل الدخول عبر ${name} قريباً`)
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-secondary/60 via-background to-background px-4 py-16 md:py-24">
      <div className="pointer-events-none absolute -top-24 start-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 end-0 h-56 w-56 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto w-full max-w-sm">
        <div className="relative rounded-4xl border border-border/70 bg-card/90 px-7 pt-14 pb-8 shadow-lg backdrop-blur-sm">
          <div className="absolute -top-9 start-1/2 -translate-x-1/2">
            <div className="flex size-[4.5rem] items-center justify-center rounded-3xl bg-primary shadow-md ring-4 ring-background">
              <Image src="/images/njd-badge-square.png" alt="نجد" width={40} height={40} className="rounded-lg" />
            </div>
          </div>

          <div className="mb-7 text-center">
            <h1 className="font-heading text-2xl">
              {mode === "login" ? "أهلاً بعودتك" : "انضمّي إلى نجد"}
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {mode === "login" ? "سجّلي الدخول للمتابعة" : "أنشئي حسابك لإطلالة استثنائية"}
            </p>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {mode === "login" ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleLogin}
                className="space-y-3.5"
              >
                <FieldWithIcon
                  icon={Mail}
                  type="email"
                  placeholder="البريد الإلكتروني"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
                <FieldWithIcon
                  icon={Lock}
                  type={showPassword ? "text" : "password"}
                  placeholder="كلمة المرور"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  trailing={
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="text-muted-foreground hover:text-foreground"
                      aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  }
                />

                <div className="flex justify-end pt-0.5">
                  <button type="button" className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                    نسيت كلمة المرور؟
                  </button>
                </div>

                <Button type="submit" size="lg" className="h-12 w-full rounded-full text-sm">
                  تسجيل الدخول
                </Button>
              </motion.form>
            ) : (
              <motion.form
                key="register"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleRegister}
                className="space-y-3.5"
              >
                <FieldWithIcon icon={UserIcon} placeholder="الاسم الكامل" value={regName} onChange={(e) => setRegName(e.target.value)} />
                <FieldWithIcon icon={Mail} type="email" placeholder="البريد الإلكتروني" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} />
                <FieldWithIcon icon={Phone} type="tel" placeholder="رقم الهاتف" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} />
                <FieldWithIcon
                  icon={Lock}
                  type={showPassword ? "text" : "password"}
                  placeholder="كلمة المرور"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  trailing={
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="text-muted-foreground hover:text-foreground"
                      aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  }
                />

                <Button type="submit" size="lg" className="h-12 w-full rounded-full text-sm">
                  إنشاء الحساب
                </Button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">أو تابعي عبر</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="flex items-center justify-center gap-3">
            {[
              { name: "Google", label: "G" },
              { name: "Apple", label: "" },
              { name: "Facebook", label: "f" },
            ].map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => handleSocial(p.name)}
                aria-label={p.name}
                className="flex size-11 items-center justify-center rounded-full border border-border bg-background text-sm font-semibold text-foreground shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
              >
                {p.label}
              </button>
            ))}
          </div>

          <p className="mt-7 text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                ليس لديك حساب؟{" "}
                <button type="button" onClick={() => setMode("register")} className="font-medium text-foreground underline-offset-4 hover:underline">
                  إنشاء حساب
                </button>
              </>
            ) : (
              <>
                لديك حساب بالفعل؟{" "}
                <button type="button" onClick={() => setMode("login")} className="font-medium text-foreground underline-offset-4 hover:underline">
                  تسجيل الدخول
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
