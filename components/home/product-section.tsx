import type { Product } from "@/lib/types"
import { ProductCard } from "@/components/site/product-card"
import { SectionHeading } from "@/components/site/section-heading"
import { Reveal } from "@/components/site/reveal"

export function ProductSection({
  eyebrow,
  title,
  products,
  href,
}: {
  eyebrow?: string
  title: string
  products: Product[]
  href?: string
}) {
  if (products.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <Reveal>
        <SectionHeading eyebrow={eyebrow} title={title} href={href} />
      </Reveal>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
        {products.map((product, i) => (
          <Reveal key={product.id} delay={(i % 4) * 0.06}>
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
