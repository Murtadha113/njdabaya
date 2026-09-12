export { cn } from "cn"

export function formatPrice(amount: number, currency = "د.ب") {
  return `${amount.toFixed(3)} ${currency}`
}

export function discountPercent(price: number, compareAtPrice?: number) {
  if (!compareAtPrice || compareAtPrice <= price) return 0
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
}

// استضافة ImgBB بطيئة جداً على أول طلب (قد تتجاوز 20 ثانية). نمرر صورها عبر
// بروكسي داخلي (/api/img) يخزّنها بكاش دائم على شبكة فيرسال، فيتحمل البطء
// مرة وحدة فقط ثم تصير الصورة فورية لكل الزوار.
const PROXIED_IMAGE_HOSTS = ["i.ibb.co"]

/** يرجّع رابط الصورة، أو صورة بديلة محايدة إذا ما فيه صورة بعد (منتج/قسم مُضاف حديثاً من الأدمن) */
export function imgSrc(src?: string | null) {
  if (!src || !src.trim()) return "/images/no-image.svg"
  try {
    const url = new URL(src)
    if (PROXIED_IMAGE_HOSTS.includes(url.hostname)) {
      return `/api/img?u=${encodeURIComponent(src)}`
    }
  } catch {
    // مسار محلي أو رابط غير مكتمل — يرجع كما هو
  }
  return src
}
