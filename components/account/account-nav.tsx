"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { LayoutGrid, LogOut, MapPin, Package, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/lib/store/auth-store"
import { toast } from "sonner"

const links = [
  { href: "/account", label: "نظرة عامة", icon: LayoutGrid },
  { href: "/account/orders", label: "طلباتي", icon: Package },
  { href: "/account/addresses", label: "العناوين", icon: MapPin },
  { href: "/account/settings", label: "الإعدادات", icon: User },
]

export function AccountNav() {
  const pathname = usePathname()
  const router = useRouter()
  const logout = useAuthStore((s) => s.logout)

  function handleLogout() {
    logout()
    toast.success("تم تسجيل الخروج")
    router.push("/")
  }

  return (
    <nav className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
      {links.map((link) => {
        const Icon = link.icon
        const active = pathname === link.href
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2.5 text-sm transition-colors",
              active ? "bg-foreground text-background" : "hover:bg-muted"
            )}
          >
            <Icon className="size-4" />
            {link.label}
          </Link>
        )
      })}
      <button
        onClick={handleLogout}
        className="flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10"
      >
        <LogOut className="size-4" />
        تسجيل الخروج
      </button>
    </nav>
  )
}
