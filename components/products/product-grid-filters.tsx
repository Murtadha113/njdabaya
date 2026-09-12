"use client"

import { useMemo, useState } from "react"
import { SlidersHorizontal } from "lucide-react"
import type { Category, Product } from "@/lib/types"
import { ProductCard } from "@/components/site/product-card"
import { Button } from "@/components/ui/button"
import { FilterPanel } from "./filter-panel"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type SortKey = "newest" | "priceAsc" | "priceDesc" | "bestselling"

const sortLabels: Record<SortKey, string> = {
  newest: "الأحدث",
  priceAsc: "السعر: الأقل أولاً",
  priceDesc: "السعر: الأعلى أولاً",
  bestselling: "الأكثر مبيعاً",
}

export function ProductGridFilters({
  products,
  categories,
  showCategoryFilter = true,
}: {
  products: Product[]
  categories?: Category[]
  showCategoryFilter?: boolean
}) {
  const [sort, setSort] = useState<SortKey>("newest")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [filtersOpen, setFiltersOpen] = useState(false)

  const allSizes = useMemo(
    () => Array.from(new Set(products.flatMap((p) => p.sizes))).sort(),
    [products]
  )

  const filtered = useMemo(() => {
    let list = [...products]
    if (selectedCategories.length > 0) {
      list = list.filter((p) => selectedCategories.includes(p.categoryId))
    }
    if (selectedSizes.length > 0) {
      list = list.filter((p) => p.sizes.some((s) => selectedSizes.includes(s)))
    }
    switch (sort) {
      case "priceAsc":
        list.sort((a, b) => a.price - b.price)
        break
      case "priceDesc":
        list.sort((a, b) => b.price - a.price)
        break
      case "bestselling":
        list.sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller))
        break
      default:
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
    return list
  }, [products, selectedCategories, selectedSizes, sort])

  function toggleCategory(id: string) {
    setSelectedCategories((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]))
  }

  function toggleSize(size: string) {
    setSelectedSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]))
  }

  function clearFilters() {
    setSelectedCategories([])
    setSelectedSizes([])
  }

  const hasFilters = selectedCategories.length > 0 || selectedSizes.length > 0
  const filterCount = selectedCategories.length + selectedSizes.length

  const FilterContent = (
    <div className="space-y-7">
      {showCategoryFilter && categories && categories.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold">التصنيف</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={cn(
                  "rounded-full border px-3.5 py-2 text-xs font-medium transition-colors",
                  selectedCategories.includes(cat.id)
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background text-foreground/80 hover:border-foreground/40"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="mb-3 text-sm font-semibold">المقاس</h3>
        <div className="flex flex-wrap gap-2">
          {allSizes.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={cn(
                "flex size-9 items-center justify-center rounded-full border text-xs font-medium transition-colors",
                selectedSizes.includes(size)
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-foreground/80 hover:border-foreground/40"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {hasFilters && (
        <button onClick={clearFilters} className="text-sm font-medium text-muted-foreground underline underline-offset-4">
          مسح كل الفلاتر
        </button>
      )}
    </div>
  )

  return (
    <div className="grid gap-8 md:grid-cols-[220px_1fr]">
      <aside className="hidden md:block">{FilterContent}</aside>

      <div>
        <div className="mb-6 flex items-center justify-between gap-3">
          <button
            onClick={() => setFiltersOpen(true)}
            className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-2 text-sm md:hidden"
          >
            <SlidersHorizontal className="size-3.5" />
            الفلاتر
            {hasFilters && (
              <span className="flex size-4 items-center justify-center rounded-full bg-gold text-[10px] text-gold-foreground">
                {filterCount}
              </span>
            )}
          </button>
          <p className="text-sm text-muted-foreground">{filtered.length} منتج</p>
          <Select value={sort} onValueChange={(v) => v && setSort(v as SortKey)}>
            <SelectTrigger className="mr-auto w-44 md:mr-0">
              <SelectValue>{(value: string) => sortLabels[value as SortKey]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(sortLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
            <p className="text-muted-foreground">لا توجد منتجات مطابقة لهذا الفلتر</p>
            <Button variant="outline" onClick={clearFilters}>
              مسح الفلاتر
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <FilterPanel
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        title="الفلاتر"
        footer={
          <Button size="lg" onClick={() => setFiltersOpen(false)} className="w-full">
            عرض {filtered.length} منتج
          </Button>
        }
      >
        {FilterContent}
      </FilterPanel>
    </div>
  )
}
