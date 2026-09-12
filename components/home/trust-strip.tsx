import { Gem, RotateCcw, ShieldCheck, Truck } from "lucide-react"
import { Reveal } from "@/components/site/reveal"

const items = [
  { icon: Truck, title: "شحن سريع", desc: "لجميع مناطق المملكة" },
  { icon: Gem, title: "خامات فاخرة", desc: "مختارة بعناية فائقة" },
  { icon: RotateCcw, title: "إرجاع سهل", desc: "خلال 14 يوماً" },
  { icon: ShieldCheck, title: "دفع آمن", desc: "حماية كاملة لبياناتك" },
]

export function TrustStrip() {
  return (
    <section className="border-y border-border bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <Reveal>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-4">
            {items.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-background text-gold">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
