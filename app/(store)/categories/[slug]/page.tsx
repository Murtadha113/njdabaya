import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ProductGridFilters } from "@/components/products/product-grid-filters"
import { getCategories, getCategoryBySlug, getProductsByCategory } from "@/lib/data"
import { imgSrc } from "@/lib/utils"

export const dynamic = "force-dynamic"

export async function generateMetadata(props: PageProps<"/categories/[slug]">): Promise<Metadata> {
  const { slug } = await props.params
  const category = await getCategoryBySlug(slug)
  if (!category) return {}
  return {
    title: `${category.name} | نجد`,
    description: category.description,
  }
}

export default async function CategoryPage(props: PageProps<"/categories/[slug]">) {
  const { slug } = await props.params
  const category = await getCategoryBySlug(slug)
  if (!category) notFound()

  const [categoryProducts, categories] = await Promise.all([
    getProductsByCategory(category.id),
    getCategories(),
  ])

  return (
    <div>
      <div className="relative flex h-56 items-end overflow-hidden bg-primary md:h-72">
        <Image
          src={imgSrc(category.coverImage)}
          alt={category.name}
          fill
          className="object-cover opacity-50"
          sizes="100vw"
          priority
        />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-8 text-primary-foreground md:px-8">
          <h1 className="font-heading text-3xl md:text-4xl">{category.name}</h1>
          <p className="mt-2 max-w-lg text-sm text-primary-foreground/80">{category.description}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
        {categoryProducts.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">لا توجد منتجات في هذا التصنيف حالياً</p>
        ) : (
          <ProductGridFilters products={categoryProducts} categories={categories} showCategoryFilter={false} />
        )}
      </div>
    </div>
  )
}
