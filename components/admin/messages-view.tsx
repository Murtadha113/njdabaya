"use client"

import { useState } from "react"
import { Mail, MailOpen, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { ContactMessage } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function MessagesView({ messages: initialMessages }: { messages: ContactMessage[] }) {
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages)

  async function markRead(id: string) {
    const message = messages.find((m) => m.id === id)
    if (!message || message.isRead) return
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isRead: true } : m)))
    await fetch(`/api/admin/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRead: true }),
    })
  }

  async function remove(id: string) {
    const res = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" })
    if (!res.ok) {
      toast.error("تعذّر حذف الرسالة")
      return
    }
    setMessages((prev) => prev.filter((m) => m.id !== id))
    toast.success("تم حذف الرسالة")
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-heading text-2xl">رسائل التواصل</h1>
        <p className="text-sm text-muted-foreground">{messages.filter((m) => !m.isRead).length} رسالة غير مقروءة</p>
      </div>

      <div className="space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            onClick={() => markRead(m.id)}
            className={cn(
              "cursor-pointer rounded-xl border p-4 transition-colors",
              m.isRead ? "border-border bg-background" : "border-gold/40 bg-gold/5"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3">
                {m.isRead ? (
                  <MailOpen className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                ) : (
                  <Mail className="mt-0.5 size-4 shrink-0 text-gold" />
                )}
                <div>
                  <p className="text-sm font-medium">{m.subject}</p>
                  <p className="text-xs text-muted-foreground">
                    {m.name} · {m.email} {m.phone && `· ${m.phone}`}
                  </p>
                  <p className="mt-2 text-sm text-foreground/80">{m.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{m.date}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={(e) => {
                  e.stopPropagation()
                  remove(m.id)
                }}
                aria-label="حذف"
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
        {messages.length === 0 && <p className="py-10 text-center text-muted-foreground">لا توجد رسائل</p>}
      </div>
    </div>
  )
}
