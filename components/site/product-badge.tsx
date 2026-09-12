import { cn } from "@/lib/utils"
import type { ProductBadge } from "@/lib/types"

const styles: Record<ProductBadge, string> = {
  "جديد": "bg-foreground text-background",
  "الأكثر مبيعاً": "bg-gold text-gold-foreground",
  "خصم": "bg-destructive text-white",
  "محدود الكمية": "bg-secondary text-secondary-foreground border border-border",
  "حصري": "bg-transparent text-foreground border border-foreground",
}

export function ProductBadgePill({ badge, className }: { badge: ProductBadge; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide",
        styles[badge],
        className
      )}
    >
      {badge}
    </span>
  )
}
