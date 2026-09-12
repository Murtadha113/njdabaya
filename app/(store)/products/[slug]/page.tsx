import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProductDetail } from "@/components/products/product-detail"
import { ProductSection } from "@/components/home/product-section"
import { getProductBySlug, getProductsByIds } from "@/lib/data"

export const dynamic = "force-dynamic"

export async function generateMetadata(props: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await props.params
  const product = await getProductBySlug(slug)
  if (!product) return {}
  return {
    title: `${product.name} | نجد`,
    description: product.shortDescription,
  }
}

export default async function ProductPage(props: PageProps<"/products/[slug]">) {
  const { slug } = await props.params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const related = await getProductsByIds(product.relatedProductIds)

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
        <ProductDetail product={product} />
      </div>
      <ProductSection title="قد يعجبك أيضاً" products={related} />
    </div>
  )
}
