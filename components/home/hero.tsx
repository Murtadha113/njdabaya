"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { ChevronDown, Sparkles } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 120])

  return (
    <section ref={ref} className="relative flex h-[88vh] min-h-[560px] items-center justify-center overflow-hidden bg-primary">
      <motion.div style={{ y }} className="absolute inset-0">
        <Image
          src="/images/black-2.jpg"
          alt=""
          fill
          priority
          className="object-cover opacity-70"
          sizes="100vw"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-primary/10" />

      <motion.div
        initial={{ opacity: 0, y: reduceMotion ? 0 : 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto max-w-2xl px-6 text-center text-primary-foreground"
      >
        <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3.5 py-1.5 text-[11px] font-medium tracking-wide text-gold">
          <Sparkles className="size-3.5" />
          مجموعة الموسم الجديدة
        </span>
        <h1 className="font-heading text-4xl leading-tight md:text-6xl">
          حيث تلتقي الحشمة بالفخامة
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-sm text-primary-foreground/80 md:text-base">
          عبايات مصممة بعناية من أجود الأقمشة، لإطلالة تعكس أناقتك في كل تفصيلة
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/products"
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-gold px-8 text-gold-foreground shadow-lg shadow-gold/20 transition-transform hover:-translate-y-0.5 hover:bg-gold/90"
            )}
          >
            اكتشفي المجموعة
          </Link>
          <Link
            href="/categories"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "border-primary-foreground/40 bg-transparent text-primary-foreground transition-transform hover:-translate-y-0.5 hover:bg-primary-foreground/10"
            )}
          >
            تصفّحي التصنيفات
          </Link>
        </div>
      </motion.div>

      <motion.div
        animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-primary-foreground/60"
      >
        <ChevronDown className="size-5" />
      </motion.div>
    </section>
  )
}
