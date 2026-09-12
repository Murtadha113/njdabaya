"use client"

import { useState } from "react"
import Image from "next/image"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { Category } from "@/lib/types"
import { imgSrc } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CategoryFormDialog } from "@/components/admin/category-form-dialog"
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

export function CategoriesView({ categories: initialCategories }: { categories: Category[] }) {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)

  function openAdd() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(c: Category) {
    setEditing(c)
    setFormOpen(true)
  }

  async function handleSave(data: { name: string; description: string; showOnHome: boolean; isSeasonal: boolean }) {
    if (editing) {
      const res = await fetch(`/api/admin/categories/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        toast.error("تعذّر تحديث القسم")
        return
      }
      setCategories((prev) => prev.map((c) => (c.id === editing.id ? { ...c, ...data } : c)))
      toast.success("تم تحديث القسم")
    } else {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        toast.error("تعذّر إضافة القسم")
        return
      }
      const created = await res.json()
      setCategories((prev) => [...prev, created as Category])
      toast.success("تمت إضافة القسم")
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    const res = await fetch(`/api/admin/categories/${deleteTarget.id}`, { method: "DELETE" })
    if (!res.ok) {
      toast.error("تعذّر حذف القسم")
      return
    }
    setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id))
    toast.success("تم حذف القسم")
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-2xl">الأقسام والتصنيفات</h1>
          <p className="text-sm text-muted-foreground">{categories.length} قسم</p>
        </div>
        <Button onClick={openAdd} className="gap-1.5">
          <Plus className="size-4" />
          إضافة قسم
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>القسم</TableHead>
              <TableHead>الترتيب</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image src={imgSrc(c.coverImage)} alt={c.name} fill className="object-cover" sizes="48px" />
                    </div>
                    <div>
                      <p className="font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.description}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{c.order}</TableCell>
                <TableCell>
                  <div className="flex gap-1.5">
                    {c.showOnHome && <Badge variant="secondary">بالرئيسية</Badge>}
                    {c.isSeasonal && <Badge className="bg-gold/15 text-gold">موسمي</Badge>}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon-sm" onClick={() => openEdit(c)} aria-label="تعديل">
                      <Pencil className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(c)} aria-label="حذف">
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CategoryFormDialog open={formOpen} onOpenChange={setFormOpen} category={editing} onSave={handleSave} />

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف القسم</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنتِ متأكدة من حذف &quot;{deleteTarget?.name}&quot;؟
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
