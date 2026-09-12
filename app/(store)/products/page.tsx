import type { Metadata } from "next"
import { ProductGridFilters } from "@/components/products/product-grid-filters"
import { getCategories, getProducts } from "@/lib/data"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "جميع العبايات | نجد",
  description: "تصفّحي مجموعتنا الكاملة من العبايات الفاخرة",
}

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()])
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
      <div className="mb-8">
        <h1 className="font-heading text-3xl md:text-4xl">جميع العبايات</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          مجموعة متكاملة من العبايات الفاخرة بتصاميم وخامات مختارة بعناية
        </p>
      </div>
      <ProductGridFilters products={products} categories={categories} />
    </div>
  )
}
