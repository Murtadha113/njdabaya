import { Star } from "lucide-react"
import type { Testimonial } from "@/lib/types"
import { SectionHeading } from "@/components/site/section-heading"
import { Reveal } from "@/components/site/reveal"
import { cn } from "@/lib/utils"

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section className="bg-secondary/40 py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <Reveal>
          <SectionHeading eyebrow="ثقتكن وسامنا" title="آراء عميلاتنا" align="center" />
        </Reveal>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.08}>
              <div className="h-full rounded-xl border border-border bg-background p-5">
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={cn(
                        "size-3.5",
                        idx < t.rating ? "fill-gold text-gold" : "text-muted-foreground/30"
                      )}
                    />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-foreground/90">{t.comment}</p>
                <p className="mt-4 text-xs font-medium text-muted-foreground">{t.customerName}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
