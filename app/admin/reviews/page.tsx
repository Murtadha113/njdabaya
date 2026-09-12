import { ReviewsView } from "@/components/admin/reviews-view"
import { getReviews } from "@/lib/data"

export const dynamic = "force-dynamic"

export default async function AdminReviewsPage() {
  const reviews = await getReviews()
  return <ReviewsView reviews={reviews} />
}
