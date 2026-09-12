export { cn } from "cn"

export function formatPrice(amount: number, currency = "د.ب") {
  return `${amount.toFixed(3)} ${currency}`
}

export function discountPercent(price: number, compareAtPrice?: number) {
  if (!compareAtPrice || compareAtPrice <= price) return 0
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
}

/** يرجّع رابط الصورة، أو صورة بديلة محايدة إذا ما فيه صورة بعد (منتج/قسم مُضاف حديثاً من الأدمن) */
export function imgSrc(src?: string | null) {
  return src && src.trim() ? src : "/images/no-image.svg"
}
