import Link from "next/link"
import { CircleCheck } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default async function CheckoutSuccessPage(props: PageProps<"/checkout/success">) {
  const params = await props.searchParams
  const orderNumber = typeof params.order === "string" ? params.order : null

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
      <CircleCheck className="size-14 text-gold" />
      <h1 className="font-heading text-3xl">شكراً لطلبك!</h1>
      <p className="text-muted-foreground">
        {orderNumber ? (
          <>
            تم استلام طلبك رقم <span className="font-medium text-foreground">{orderNumber}</span> بنجاح، وسنتواصل
            معك قريباً لتأكيد التفاصيل.
          </>
        ) : (
          "تم استلام طلبك بنجاح، وسنتواصل معك قريباً لتأكيد التفاصيل."
        )}
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Link href="/account/orders" className={cn(buttonVariants({ size: "lg" }))}>
          تتبّعي طلبك
        </Link>
        <Link href="/products" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
          متابعة التسوق
        </Link>
      </div>
    </div>
  )
}
