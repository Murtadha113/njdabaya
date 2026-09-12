"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuthStore } from "@/lib/store/auth-store"
import { AccountNav } from "@/components/account/account-nav"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  if (!isLoggedIn) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
        <h1 className="font-heading text-2xl">سجّلي الدخول أولاً</h1>
        <p className="text-sm text-muted-foreground">يجب تسجيل الدخول للوصول إلى حسابك</p>
        <Link href="/login" className={cn(buttonVariants({ size: "lg" }))}>
          تسجيل الدخول
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14">
      <h1 className="mb-8 font-heading text-3xl">حسابي</h1>
      <div className="grid gap-8 md:grid-cols-[220px_1fr]">
        <AccountNav />
        <div>{children}</div>
      </div>
    </div>
  )
}
