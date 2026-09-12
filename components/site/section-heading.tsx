import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

export function SectionHeading({
  eyebrow,
  title,
  href,
  hrefLabel = "عرض الكل",
  align = "start",
  className,
}: {
  eyebrow?: string
  title: string
  href?: string
  hrefLabel?: string
  align?: "start" | "center"
  className?: string
}) {
  return (
    <div
      className={cn(
        "mb-8 flex items-end justify-between gap-4",
        align === "center" && "flex-col items-center text-center",
        className
      )}
    >
      <div>
        {eyebrow && (
          <p className="mb-2 text-xs font-medium tracking-[0.2em] text-gold uppercase">{eyebrow}</p>
        )}
        <h2 className="font-heading text-2xl md:text-3xl">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="group flex shrink-0 items-center gap-1.5 text-sm text-foreground/80 hover:text-foreground">
          {hrefLabel}
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
        </Link>
      )}
    </div>
  )
}
