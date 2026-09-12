"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Bell, ExternalLink, Menu, Search } from "lucide-react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3E7DC] via-[#EFE7EA] to-[#DCE6EE] p-2.5 lg:p-6">
      <div className="mx-auto flex min-h-[calc(100vh-1.25rem)] max-w-[1600px] overflow-hidden rounded-3xl bg-white shadow-xl shadow-black/5 lg:min-h-[calc(100vh-3rem)]">
        <aside className="hidden w-64 shrink-0 flex-col p-4 lg:flex">
          <Link href="/admin" className="flex items-center gap-2.5 px-2 py-3">
            <Image
              src="/images/njd-badge-square.png"
              alt="نجد"
              width={36}
              height={36}
              className="size-9 shrink-0 rounded-full"
            />
            <span className="font-heading text-lg">لوحة نجد</span>
          </Link>
          <div className="mt-4 flex-1 overflow-y-auto">
            <AdminSidebar />
          </div>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-[#F4ECE4]"
          >
            <ExternalLink className="size-4" />
            عرض المتجر
          </Link>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col bg-[#F8F4F0] lg:rounded-s-[2rem]">
          <header className="flex h-20 items-center justify-between gap-4 px-4 lg:px-8">
            <button onClick={() => setMenuOpen(true)} className="lg:hidden" aria-label="فتح القائمة">
              <Menu className="size-6" />
            </button>
            <span className="hidden lg:block" />
            <div className="flex items-center gap-4">
              <button
                aria-label="بحث"
                className="hidden size-10 items-center justify-center rounded-full bg-white text-muted-foreground shadow-sm hover:text-foreground sm:flex"
              >
                <Search className="size-4.5" />
              </button>
              <button
                aria-label="الإشعارات"
                className="relative flex size-10 items-center justify-center rounded-full bg-white text-muted-foreground shadow-sm hover:text-foreground"
              >
                <Bell className="size-4.5" />
                <span className="absolute end-2.5 top-2.5 flex size-2 rounded-full bg-[#D98AA0]" />
              </button>
              <div className="flex items-center gap-2.5">
                <Avatar className="size-9">
                  <AvatarFallback className="bg-gradient-to-br from-[#9FC0DA] to-[#7CA3C4] text-xs text-white">نأ</AvatarFallback>
                </Avatar>
                <div className="hidden text-start sm:block">
                  <p className="text-sm font-medium leading-none">نورة الأدمن</p>
                  <p className="text-xs text-muted-foreground">مدير عام</p>
                </div>
              </div>
            </div>
          </header>

          <main className="min-w-0 flex-1 overflow-x-hidden px-4 pb-6 lg:px-8 lg:pb-8">{children}</main>
        </div>
      </div>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="right">
          <SheetHeader className="border-b border-border">
            <SheetTitle>لوحة تحكم نجد</SheetTitle>
          </SheetHeader>
          <div className="p-3" onClick={() => setMenuOpen(false)}>
            <AdminSidebar />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
