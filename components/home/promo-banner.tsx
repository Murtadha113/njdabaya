import Image from "next/image"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Reveal } from "@/components/site/reveal"

export function PromoBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-8">
      <Reveal>
        <div className="relative flex min-h-[360px] items-center overflow-hidden rounded-2xl bg-primary">
          <Image
            src="/images/black-gold.jpg"
            alt=""
            fill
            className="object-cover opacity-50"
            sizes="100vw"
          />
          <div className="relative z-10 max-w-md px-8 py-12 text-primary-foreground md:px-14">
            <p className="mb-3 text-xs font-medium tracking-[0.3em] text-gold uppercase">لفترة محدودة</p>
            <h3 className="font-heading text-3xl leading-tight md:text-4xl">
              خصم يصل إلى 30% على مجموعة مختارة
            </h3>
            <p className="mt-3 text-sm text-primary-foreground/80">
              لا تفوّتي فرصة اقتناء تصاميمك المفضلة بأسعار مميزة
            </p>
            <Link
              href="/offers"
              className={cn(buttonVariants({ size: "lg" }), "mt-6 bg-gold text-gold-foreground hover:bg-gold/90 px-8")}
            >
              تسوّقي العروض
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
