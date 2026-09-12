"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  FolderTree,
  LayoutDashboard,
  Mail,
  Package,
  Settings,
  Shirt,
  Star,
  Ticket,
  Truck,
  UserCog,
  Users,
} from "lucide-react"
import { adminNav } from "@/lib/admin-nav"
import { cn } from "@/lib/utils"

const icons = {
  dashboard: LayoutDashboard,
  product: Shirt,
  category: FolderTree,
  order: Package,
  customer: Users,
  coupon: Ticket,
  review: Star,
  message: Mail,
  delivery: Truck,
  staff: UserCog,
  settings: Settings,
}

export function AdminSidebar({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <nav className={cn("flex flex-col gap-1", className)}>
      {adminNav.map((item) => {
        const Icon = icons[item.icon]
        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-gradient-to-l from-[#9FC0DA] to-[#7CA3C4] text-white shadow-sm shadow-[#7CA3C4]/30"
                : "text-foreground/70 hover:bg-[#F4ECE4]"
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
