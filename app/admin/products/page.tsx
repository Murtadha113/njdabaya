import { ProductsView } from "@/components/admin/products-view"
import { getCategories, getProducts } from "@/lib/data"

export const dynamic = "force-dynamic"

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()])
  return <ProductsView products={products} categories={categories} />
}
