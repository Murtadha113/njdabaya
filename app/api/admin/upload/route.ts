import { NextResponse } from "next/server"
import { uploadToImgbb } from "@/lib/imgbb"

export async function POST(req: Request) {
  const form = await req.formData()
  const file = form.get("file")

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "لم يتم إرفاق صورة" }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  try {
    const url = await uploadToImgbb(buffer, file.name)
    return NextResponse.json({ url })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
