import Link from "next/link"
import { MessageCircle, ShoppingBag } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Reveal } from "./reveal"

export function SupportCta() {
  return (
    <Reveal className="mt-14 rounded-2xl border border-border bg-secondary/30 p-6 text-center md:p-8">
      <h2 className="font-heading text-xl">هل تحتاجين مساعدة إضافية؟</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        فريق خدمة العملاء جاهز لمساعدتك، أو تصفّحي مجموعتنا مباشرة
      </p>
      <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/contact" className={cn(buttonVariants({ size: "lg" }), "gap-2")}>
          <MessageCircle className="size-4" />
          تواصلي معنا
        </Link>
        <Link href="/products" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "gap-2")}>
          <ShoppingBag className="size-4" />
          تصفّحي المنتجات
        </Link>
      </div>
    </Reveal>
  )
}
