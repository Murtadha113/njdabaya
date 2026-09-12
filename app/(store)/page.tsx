import { Hero } from "@/components/home/hero"
import { CategoryGrid } from "@/components/home/category-grid"
import { TrustStrip } from "@/components/home/trust-strip"
import { ProductSection } from "@/components/home/product-section"
import { PromoBanner } from "@/components/home/promo-banner"
import { StorySection } from "@/components/home/story-section"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { NewsletterBanner } from "@/components/home/newsletter-banner"
import { getCategories, getProducts, getTestimonials } from "@/lib/data"

export const dynamic = "force-dynamic"

export default async function Home() {
  const [categories, products, testimonials] = await Promise.all([
    getCategories(),
    getProducts(),
    getTestimonials(),
  ])
  const homeCategories = categories.filter((c) => c.showOnHome)
  const latest = [...products].slice(-8).reverse()
  const bestSellers = products.filter((p) => p.isBestSeller)
  const featured = products.filter((p) => p.isFeatured)

  return (
    <div>
      <Hero />
      <CategoryGrid categories={homeCategories} />
      <ProductSection eyebrow="وصل حديثاً" title="أحدث المنتجات" products={latest} href="/products?sort=new" />
      <PromoBanner />
      <ProductSection eyebrow="مفضلة عميلاتنا" title="الأكثر مبيعاً" products={bestSellers} href="/products?sort=bestselling" />
      <StorySection />
      <TrustStrip />
      <ProductSection eyebrow="مختارات خاصة" title="منتجات مميزة" products={featured} href="/products?filter=featured" />
      <TestimonialsSection testimonials={testimonials} />
      <NewsletterBanner />
    </div>
  )
}
