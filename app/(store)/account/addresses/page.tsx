import { AddressesView } from "@/components/account/addresses-view"
import { getStoreSettings } from "@/lib/data"

export const dynamic = "force-dynamic"

export default async function AddressesPage() {
  const settings = await getStoreSettings()
  return <AddressesView cities={settings.cities} />
}
