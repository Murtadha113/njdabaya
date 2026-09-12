import { AccountOverview } from "@/components/account/account-overview"
import { getOrders } from "@/lib/data"

export const dynamic = "force-dynamic"

export default async function AccountOverviewPage() {
  const orders = await getOrders()
  return <AccountOverview orders={orders} />
}
