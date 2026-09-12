import { DeliveryView } from "@/components/admin/delivery-view"
import { getShippingMethods, getStoreSettings } from "@/lib/data"

export const dynamic = "force-dynamic"

export default async function AdminDeliveryPage() {
  const [shippingMethods, settings] = await Promise.all([getShippingMethods(), getStoreSettings()])
  return <DeliveryView shippingMethods={shippingMethods} cities={settings.cities} />
}
