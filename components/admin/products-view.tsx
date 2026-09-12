"use client"

import { useState } from "react"
import Image from "next/image"
import { Pencil, Plus, Search, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { Product, Category } from "@/lib/types"
import { formatPrice, imgSrc } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ProductFormDialog } from "@/components/admin/product-form-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function ProductsView({
  products: initialProducts,
  categories,
}: {
  products: Product[]
  categories: Category[]
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [query, setQuery] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)

  const filtered = products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))

  function openAdd() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(p: Product) {
    setEditing(p)
    setFormOpen(true)
  }

  async function handleSave(data: {
    name: string
    price: string
    compareAtPrice: string
    categoryId: string
    stock: string
    fabric: string
    shortDescription: string
    badges: Product["badges"]
  }) {
    if (editing) {
      const res = await fetch(`/api/admin/products/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        toast.error("تعذّر تحديث المنتج")
        return
      }
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editing.id
            ? {
                ...p,
                name: data.name,
                price: Number(data.price),
                compareAtPrice: data.compareAtPrice ? Number(data.compareAtPrice) : undefined,
                categoryId: data.categoryId,
                stock: Number(data.stock),
                fabric: data.fabric,
                shortDescription: data.shortDescription,
                badges: data.badges,
              }
            : p
        )
      )
      toast.success("تم تحديث المنتج")
    } else {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        toast.error("تعذّر إضافة المنتج")
        return
      }
      const created = await res.json()
      setProducts((prev) => [created as Product, ...prev])
      toast.success("تمت إضافة المنتج")
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    const res = await fetch(`/api/admin/products/${deleteTarget.id}`, { method: "DELETE" })
    if (!res.ok) {
      toast.error("تعذّر حذف المنتج")
      return
    }
    setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id))
    toast.success("تم حذف المنتج")
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-2xl">المنتجات</h1>
          <p className="text-sm text-muted-foreground">{products.length} منتج بالمتجر</p>
        </div>
        <Button onClick={openAdd} className="gap-1.5">
          <Plus className="size-4" />
          إضافة منتج
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحثي عن منتج..." className="ps-9" />
      </div>

      <div className="rounded-xl border border-border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>المنتج</TableHead>
              <TableHead>التصنيف</TableHead>
              <TableHead>السعر</TableHead>
              <TableHead>المخزون</TableHead>
              <TableHead>الشارات</TableHead>
              <TableHead>إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image src={imgSrc(p.images[0])} alt={p.name} fill className="object-cover" sizes="48px" />
                    </div>
                    <span className="font-medium">{p.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {categories.find((c) => c.id === p.categoryId)?.name}
                </TableCell>
                <TableCell>{formatPrice(p.price)}</TableCell>
                <TableCell>
                  <span className={p.stock <= 12 ? "text-destructive" : ""}>{p.stock}</span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {p.badges.slice(0, 2).map((b) => (
                      <Badge key={b} variant="secondary" className="text-[10px]">
                        {b}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon-sm" onClick={() => openEdit(p)} aria-label="تعديل">
                      <Pencil className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(p)} aria-label="حذف">
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editing}
        categories={categories}
        onSave={handleSave}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف المنتج</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنتِ متأكدة من حذف &quot;{deleteTarget?.name}&quot;؟ هذا الإجراء لا يمكن التراجع عنه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-white hover:bg-destructive/90">
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
