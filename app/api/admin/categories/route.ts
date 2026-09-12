import { NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"
import { getCategories } from "@/lib/data"

function slugify(name: string) {
  return `category-${Date.now()}`
}

export async function POST(req: Request) {
  const body = await req.json()
  const { name, description, showOnHome, isSeasonal, coverImage } = body as {
    name?: string
    description?: string
    showOnHome?: boolean
    isSeasonal?: boolean
    coverImage?: string
  }

  if (!name) {
    return NextResponse.json({ error: "اسم القسم مطلوب" }, { status: 400 })
  }

  const categories = await getCategories()
  const id = `cat-${Date.now()}`
  const doc = {
    slug: slugify(name),
    name,
    description: description ?? "",
    coverImage: coverImage ?? "",
    order: categories.length + 1,
    showOnHome: !!showOnHome,
    isSeasonal: !!isSeasonal,
  }

  await adminDb.collection("categories").doc(id).set(doc)
  return NextResponse.json({ id, ...doc })
}
