"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function NewsletterForm() {
  const [email, setEmail] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.includes("@")) {
      toast.error("رجاءً أدخلي بريداً إلكترونياً صحيحاً")
      return
    }
    toast.success("تم الاشتراك بنجاح", { description: "شكراً لانضمامك إلى نشرتنا البريدية" })
    setEmail("")
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="email"
        required
        placeholder="بريدك الإلكتروني"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-background"
      />
      <Button type="submit">اشتراك</Button>
    </form>
  )
}
