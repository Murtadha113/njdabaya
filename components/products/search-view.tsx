"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import type { Product } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { ProductCard } from "@/components/site/product-card"

export function SearchView({ products, initialQuery = "" }: { products: Product[]; initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q)
    )
  }, [products, query])

  return (
    <div>
      <div className="relative mx-auto max-w-xl">
        <Search className="absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحثي عن عباية، تصنيف، أو خامة..."
          className="h-12 ps-10 text-base"
        />
      </div>

      <div className="mt-10">
        {query.trim() === "" ? (
          <p className="text-center text-sm text-muted-foreground">ابدئي الكتابة لعرض النتائج</p>
        ) : results.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">لا توجد نتائج مطابقة لـ &quot;{query}&quot;</p>
        ) : (
          <>
            <p className="mb-6 text-sm text-muted-foreground">{results.length} نتيجة لـ &quot;{query}&quot;</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
