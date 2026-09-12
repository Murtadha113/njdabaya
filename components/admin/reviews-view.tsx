"use client"

import { useState } from "react"
import { Check, Star, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { AdminReview } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function ReviewsView({ reviews: initialReviews }: { reviews: AdminReview[] }) {
  const [reviews, setReviews] = useState<AdminReview[]>(initialReviews)

  async function approve(id: string) {
    const res = await fetch(`/api/admin/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "approved" }),
    })
    if (!res.ok) {
      toast.error("تعذّر نشر التقييم")
      return
    }
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r)))
    toast.success("تم نشر التقييم")
  }

  async function remove(id: string) {
    const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" })
    if (!res.ok) {
      toast.error("تعذّر حذف التقييم")
      return
    }
    setReviews((prev) => prev.filter((r) => r.id !== id))
    toast.success("تم حذف التقييم")
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-heading text-2xl">التقييمات</h1>
        <p className="text-sm text-muted-foreground">{reviews.filter((r) => r.status === "pending").length} تقييم بانتظار المراجعة</p>
      </div>

      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="rounded-xl border border-border bg-background p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-sm font-medium">{r.customerName}</span>
                  <span className="text-xs text-muted-foreground">· {r.productName}</span>
                  {r.status === "pending" ? (
                    <Badge variant="secondary">بانتظار المراجعة</Badge>
                  ) : (
                    <Badge className="bg-emerald-100 text-emerald-700">منشور</Badge>
                  )}
                </div>
                <div className="mb-2 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={cn("size-3.5", i < r.rating ? "fill-gold text-gold" : "text-muted-foreground/30")} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{r.comment}</p>
                <p className="mt-1 text-xs text-muted-foreground">{r.date}</p>
              </div>
              <div className="flex gap-1.5">
                {r.status === "pending" && (
                  <Button size="sm" variant="outline" onClick={() => approve(r.id)} className="gap-1.5">
                    <Check className="size-3.5" />
                    نشر
                  </Button>
                )}
                <Button size="icon-sm" variant="ghost" onClick={() => remove(r.id)} aria-label="حذف">
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
