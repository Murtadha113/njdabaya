import { SettingsView } from "@/components/admin/settings-view"
import { getStoreSettings } from "@/lib/data"

export const dynamic = "force-dynamic"

export default async function AdminSettingsPage() {
  const settings = await getStoreSettings()
  return <SettingsView settings={settings} />
}
