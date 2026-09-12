import { CategoriesView } from "@/components/admin/categories-view"
import { getCategories } from "@/lib/data"

export const dynamic = "force-dynamic"

export default async function AdminCategoriesPage() {
  const categories = await getCategories()
  return <CategoriesView categories={categories} />
}
