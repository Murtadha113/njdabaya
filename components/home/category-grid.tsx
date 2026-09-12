import Image from "next/image"
import Link from "next/link"
import type { Category } from "@/lib/types"
import { SectionHeading } from "@/components/site/section-heading"
import { Reveal } from "@/components/site/reveal"
import { cn, imgSrc } from "@/lib/utils"

export function CategoryGrid({ categories }: { categories: Category[] }) {
  // التخطيط المميز (بطاقة كبيرة + بطاقات صغيرة حولها) يحتاج على الأقل ٣ تصنيفات
  // عشان الصف الثاني يلقى محتوى يعطيه ارتفاع. بأقل من هذا نرجع لشبكة موحدة بسيطة
  // ما تعتمد على عدد العناصر إطلاقاً.
  const featured = categories.length >= 3

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <Reveal>
        <SectionHeading eyebrow="تسوّقي حسب" title="التصنيفات" href="/categories" />
      </Reveal>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {categories.map((cat, i) => {
          const isFeatured = featured && i === 0
          return (
            <Reveal key={cat.id} delay={i * 0.06} className={cn(isFeatured && "col-span-2 row-span-2")}>
              <Link href={`/categories/${cat.slug}`} className="group block h-full">
                <div
                  className={cn(
                    "relative h-full overflow-hidden rounded-xl bg-muted",
                    isFeatured ? "aspect-square md:aspect-auto" : "aspect-[4/5]"
                  )}
                >
                  <Image
                    src={imgSrc(cat.coverImage)}
                    alt={cat.name}
                    fill
                    sizes={isFeatured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className={cn("absolute inset-x-0 bottom-4 text-center text-white", isFeatured && "bottom-6")}>
                    <span className={cn("font-heading", isFeatured ? "text-2xl md:text-3xl" : "text-sm font-medium")}>
                      {cat.name}
                    </span>
                    {isFeatured && (
                      <span className="mt-1 block text-xs text-white/75">{cat.description}</span>
                    )}
                  </div>
                </div>
              </Link>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
