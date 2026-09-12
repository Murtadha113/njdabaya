import { CheckoutForm } from "@/components/checkout/checkout-form"
import { getShippingMethods, getStoreSettings } from "@/lib/data"

export const dynamic = "force-dynamic"

export default async function CheckoutPage() {
  const [shippingMethods, settings] = await Promise.all([getShippingMethods(), getStoreSettings()])

  return (
    <CheckoutForm
      shippingMethods={shippingMethods}
      cities={settings.cities}
      bankDetails={settings.bankDetails}
    />
  )
}
