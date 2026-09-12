import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const colorMap = {
  lavender: "bg-[#E9E1F5] text-[#8B7CC8]",
  pink: "bg-[#F7DEE3] text-[#D98AA0]",
  peach: "bg-[#FBE3D0] text-[#E0985A]",
  sage: "bg-[#DCEDE3] text-[#5FA37D]",
  blue: "bg-[#DCE9F3] text-[#6E93B8]",
} as const

export function StatCard({
  title,
  value,
  icon: Icon,
  color = "blue",
  trend,
  className,
}: {
  title: string
  value: string
  icon: LucideIcon
  color?: keyof typeof colorMap
  trend?: { value: string; positive: boolean }
  className?: string
}) {
  return (
    <div className={cn("rounded-2xl bg-white p-5 shadow-sm shadow-black/[0.03]", className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className={cn("flex size-9 items-center justify-center rounded-full", colorMap[color])}>
          <Icon className="size-4.5" />
        </div>
      </div>
      <p className="mt-3 font-heading text-2xl">{value}</p>
      {trend && (
        <p className={cn("mt-1 text-xs", trend.positive ? "text-emerald-600" : "text-destructive")}>
          {trend.positive ? "▲" : "▼"} {trend.value}
        </p>
      )}
    </div>
  )
}
