export async function uploadToImgbb(fileBuffer: Buffer, name?: string): Promise<string> {
  const apiKey = process.env.IMGBB_API_KEY
  if (!apiKey) throw new Error("IMGBB_API_KEY is not set")

  const form = new FormData()
  form.append("key", apiKey)
  form.append("image", fileBuffer.toString("base64"))
  if (name) form.append("name", name)

  const res = await fetch("https://api.imgbb.com/1/upload", {
    method: "POST",
    body: form,
  })
  const data = await res.json()
  if (!data.success) {
    throw new Error(data.error?.message ?? "فشل رفع الصورة إلى ImgBB")
  }
  return data.data.url as string
}
