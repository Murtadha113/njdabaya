import type { Metadata } from "next"
import { PromoBanner } from "@/components/home/promo-banner"
import { ProductCard } from "@/components/site/product-card"
import { Reveal } from "@/components/site/reveal"
import { getProducts } from "@/lib/data"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "العروض والتخفيضات | نجد",
  description: "تسوّقي أحدث العروض والتخفيضات على تشكيلة مختارة من العبايات الفاخرة لفترة محدودة.",
}

export default async function OffersPage() {
  const products = await getProducts()
  const discountedProducts = products.filter((p) => p.compareAtPrice)

  return (
    <div>
      <section className="pt-10">
        <PromoBanner />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <Reveal>
          <div className="mb-8 text-center">
            <p className="mb-2 text-xs font-medium tracking-[0.2em] text-gold uppercase">لفترة محدودة</p>
            <h1 className="font-heading text-3xl md:text-4xl">العروض والتخفيضات</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
              مجموعة مختارة من أجمل تصاميمنا بأسعار مميزة، اقتنيها قبل نفاد الكمية
            </p>
          </div>
        </Reveal>

        {discountedProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
            {discountedProducts.map((product, i) => (
              <Reveal key={product.id} delay={(i % 4) * 0.08}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-sm text-muted-foreground">
            لا توجد عروض متاحة حالياً، ترقبي إطلالاتنا القادمة قريباً
          </p>
        )}
      </section>
    </div>
  )
}
