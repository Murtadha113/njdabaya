import { WishlistView } from "@/components/wishlist/wishlist-view"
import { getProducts } from "@/lib/data"

export const dynamic = "force-dynamic"

export default async function WishlistPage() {
  const products = await getProducts()
  return <WishlistView products={products} />
}
