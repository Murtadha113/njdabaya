import { CouponsView } from "@/components/admin/coupons-view"
import { getCoupons } from "@/lib/data"

export const dynamic = "force-dynamic"

export default async function AdminCouponsPage() {
  const coupons = await getCoupons()
  return <CouponsView coupons={coupons} />
}
