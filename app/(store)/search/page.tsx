import type { Metadata } from "next"
import { SearchView } from "@/components/products/search-view"
import { getProducts } from "@/lib/data"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "بحث | نجد",
}

export default async function SearchPage(props: PageProps<"/search">) {
  const params = await props.searchParams
  const q = typeof params.q === "string" ? params.q : ""
  const products = await getProducts()

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
      <h1 className="mb-8 text-center font-heading text-3xl md:text-4xl">ابحثي في متجرنا</h1>
      <SearchView products={products} initialQuery={q} />
    </div>
  )
}
