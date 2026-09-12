import Image from "next/image"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Reveal } from "@/components/site/reveal"

export function StorySection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <Reveal className="order-2 md:order-1">
          <span className="font-heading text-6xl leading-none text-gold/40 select-none">&rdquo;</span>
          <p className="-mt-4 mb-3 text-xs font-medium tracking-[0.2em] text-gold uppercase">قصتنا</p>
          <h2 className="font-heading text-3xl leading-snug md:text-4xl">
            صُنعت لتكون امتداداً لأناقتك
          </h2>
          <p className="mt-5 text-sm leading-loose text-muted-foreground md:text-base">
            بدأت رحلتنا من شغف حقيقي بالعباية كقطعة تجمع بين الحشمة والفخامة. نختار أقمشتنا بعناية فائقة
            ونعمل مع أمهر الأيادي في التفصيل والتطريز، لنقدّم لكِ قطعاً تدوم وتليق بكل لحظة من حياتك.
          </p>
          <Link href="/about" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "mt-6")}>
            تعرّفي علينا أكثر
          </Link>
        </Reveal>
        <Reveal className="order-1 md:order-2" delay={0.1}>
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
            <Image
              src="/images/two-women.jpg"
              alt="قصة المتجر"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
