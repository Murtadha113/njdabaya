"use client"

import { useState } from "react"
import { AtSign, Camera, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react"
import { toast } from "sonner"
import { SectionHeading } from "@/components/site/section-heading"
import { Reveal } from "@/components/site/reveal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const contactInfo = [
  { icon: Phone, label: "الهاتف", value: "+973 1234 5678" },
  { icon: MessageCircle, label: "واتساب", value: "+973 3300 0000" },
  { icon: Mail, label: "البريد الإلكتروني", value: "info@store-name.com" },
  { icon: MapPin, label: "العنوان", value: "المنامة، مملكة البحرين" },
]

const socialLinks = [
  { icon: Camera, label: "Instagram", href: "#" },
  { icon: AtSign, label: "X", href: "#" },
  { icon: MessageCircle, label: "WhatsApp", href: "#" },
]

const initialForm = { name: "", email: "", phone: "", subject: "", message: "" }

export default function ContactPage() {
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)

  function handleChange(field: keyof typeof initialForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      toast.success("تم إرسال رسالتك بنجاح", {
        description: "سيتواصل معكِ فريقنا في أقرب وقت ممكن",
      })
      setForm(initialForm)
    } catch {
      toast.error("تعذّر إرسال الرسالة، حاولي مرة أخرى")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <Reveal>
        <SectionHeading eyebrow="نسعد بتواصلكِ" title="تواصل معنا" align="center" />
      </Reveal>

      <div className="grid gap-10 md:grid-cols-5 md:gap-16">
        <Reveal className="md:col-span-3">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">الاسم الكامل</Label>
                <Input
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="اسمكِ الكامل"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="example@email.com"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+973 xxxx xxxx"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">الموضوع</Label>
                <Input
                  id="subject"
                  required
                  value={form.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  placeholder="موضوع رسالتكِ"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">الرسالة</Label>
              <Textarea
                id="message"
                required
                rows={6}
                value={form.message}
                onChange={(e) => handleChange("message", e.target.value)}
                placeholder="اكتبي رسالتكِ هنا..."
              />
            </div>

            <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
              <Send className="size-4" />
              {submitting ? "جارٍ الإرسال..." : "إرسال الرسالة"}
            </Button>
          </form>
        </Reveal>

        <Reveal className="md:col-span-2" delay={0.1}>
          <div className="space-y-8 rounded-2xl border border-border bg-secondary/40 p-6 md:p-8">
            <div>
              <h3 className="font-heading text-lg">معلومات التواصل</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                فريقنا جاهز للإجابة على استفساراتكِ خلال أيام الأسبوع من 9 صباحاً حتى 9 مساءً
              </p>
            </div>

            <ul className="space-y-5">
              {contactInfo.map((item) => (
                <li key={item.label} className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-background text-gold ring-1 ring-border">
                    <item.icon className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-medium">{item.value}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div>
              <h4 className="mb-3 text-sm font-semibold">تابعينا</h4>
              <div className="flex gap-3">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="flex size-9 items-center justify-center rounded-full border border-border bg-background hover:bg-muted"
                  >
                    <s.icon className="size-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
