import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { getCategories } from "@/lib/data"
import { imgSrc } from "@/lib/utils"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "التصنيفات | نجد",
  description: "تصفّحي عبايات متجرنا حسب التصنيف",
}

export default async function CategoriesPage() {
  const categories = await getCategories()
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
      <div className="mb-10">
        <h1 className="font-heading text-3xl md:text-4xl">التصنيفات</h1>
        <p className="mt-2 text-sm text-muted-foreground">اختاري التصنيف المناسب لإطلالتك</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Link key={cat.id} href={`/categories/${cat.slug}`} className="group block">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
              <Image
                src={imgSrc(cat.coverImage)}
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <h2 className="font-heading text-xl">{cat.name}</h2>
                <p className="mt-1 text-xs text-white/80">{cat.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
