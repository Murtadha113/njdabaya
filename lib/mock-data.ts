import type { AdminReview, AdminStaff, Category, ContactMessage, Coupon, OrderStatus, Product, Testimonial } from './types'

/**
 * صور حقيقية مؤقتة (محمّلة محلياً من مصدر مرخّص للاستخدام التجاري بدون نسب) لحين وصول
 * صور المنتجات الفعلية من الزبون. راجعي [[wala-kelma-keep-separate]] لمعرفة سبب فصل هذا المشروع.
 */
const PHOTOS = {
  heroSilhouette: "hero-silhouette",
  black1: "black-1",
  black2: "black-2",
  embroidered1: "embroidered-1",
  embroidered2: "embroidered-2",
  casual1: "casual-1",
  occasion1: "occasion-1",
  seasonal1: "seasonal-1",
  beigeHijab: "beige-hijab",
  twoWomen: "two-women",
  blackGold: "black-gold",
} as const

function photo(id: string, _w?: number, _h?: number) {
  return `/images/${id}.jpg`
}

export const categories: Category[] = [
  {
    id: 'cat-black',
    slug: 'abayat-sawdaa',
    name: 'عبايات سوداء',
    description: 'الكلاسيكية الفاخرة بقصّات عصرية وأقمشة راقية',
    coverImage: photo(PHOTOS.black1, 1200, 900),
    order: 1,
    showOnHome: true,
  },
  {
    id: 'cat-embroidered',
    slug: 'abayat-mutarraza',
    name: 'عبايات مطرزة',
    description: 'تطريز يدوي دقيق يضيف لمسة من الفخامة',
    coverImage: photo(PHOTOS.embroidered1, 1200, 900),
    order: 2,
    showOnHome: true,
  },
  {
    id: 'cat-casual',
    slug: 'abayat-yawmiya',
    name: 'عبايات يومية',
    description: 'أناقة مريحة لإطلالة اليوم',
    coverImage: photo(PHOTOS.casual1, 1200, 900),
    order: 3,
    showOnHome: true,
  },
  {
    id: 'cat-occasion',
    slug: 'abayat-munasabat',
    name: 'عبايات المناسبات',
    description: 'تصاميم مميزة للمناسبات الخاصة',
    coverImage: photo(PHOTOS.occasion1, 1200, 900),
    order: 4,
    showOnHome: true,
  },
  {
    id: 'cat-ramadan',
    slug: 'majmouat-ramadan',
    name: 'مجموعة رمضان والعيد',
    description: 'مجموعة موسمية محدودة',
    coverImage: photo(PHOTOS.seasonal1, 1200, 900),
    order: 5,
    isSeasonal: true,
    showOnHome: true,
  },
  {
    id: 'cat-accessories',
    slug: 'ikssswarat',
    name: 'إكسسوارات',
    description: 'حجابات وإكسسوارات مكمّلة للإطلالة',
    coverImage: photo(PHOTOS.beigeHijab, 1200, 900),
    order: 6,
    showOnHome: false,
  },
]

const productPhotoPool = [
  PHOTOS.black1,
  PHOTOS.black2,
  PHOTOS.embroidered1,
  PHOTOS.embroidered2,
  PHOTOS.casual1,
  PHOTOS.occasion1,
  PHOTOS.seasonal1,
  PHOTOS.beigeHijab,
  PHOTOS.twoWomen,
  PHOTOS.blackGold,
]

const colorPalettes = [
  [{ name: 'أسود', hex: '#0b0b0c' }, { name: 'كحلي', hex: '#1b2333' }, { name: 'بني', hex: '#4a3728' }],
  [{ name: 'أسود', hex: '#0b0b0c' }, { name: 'بيج', hex: '#d8cbb5' }],
  [{ name: 'أسود', hex: '#0b0b0c' }, { name: 'زيتي', hex: '#4b5320' }, { name: 'رمادي', hex: '#6b6b6b' }],
]

const sizes = ['52', '54', '56', '58', '60']

let productPhotoCursor = 0

function makeProduct(partial: {
  id: string
  slug: string
  name: string
  price: number
  compareAtPrice?: number
  categoryId: string
  badges?: Product['badges']
  isFeatured?: boolean
  isBestSeller?: boolean
  seedBase: string
}): Product {
  const { id, slug, name, price, compareAtPrice, categoryId, badges = [] } = partial
  const primary = productPhotoPool[productPhotoCursor % productPhotoPool.length]
  const secondary = productPhotoPool[(productPhotoCursor + 3) % productPhotoPool.length]
  productPhotoCursor++
  return {
    id,
    slug,
    name,
    shortDescription: 'عباية فاخرة بقصة أنيقة وقماش ناعم يمنحك إطلالة راقية في كل مناسبة.',
    description:
      'عباية مصممة بعناية فائقة من أجود الأقمشة، تجمع بين الحشمة والأناقة العصرية. تفصيل دقيق وخياطة متقنة تدوم طويلاً، ومناسبة للإطلالة اليومية والمناسبات الخاصة على حد سواء.',
    images: [photo(primary), photo(secondary)],
    price,
    compareAtPrice,
    categoryId,
    colors: colorPalettes[Math.floor(Math.random() * colorPalettes.length)],
    sizes,
    length: '145 سم',
    fabric: 'كريب فاخر',
    careInstructions: 'غسيل جاف يُفضّل، أو غسيل يدوي بماء بارد',
    stock: 12,
    status: 'available',
    badges,
    relatedProductIds: [],
    reviews: [],
    rating: 4.6,
    reviewsCount: 18,
    createdAt: new Date().toISOString(),
    isFeatured: partial.isFeatured,
    isBestSeller: partial.isBestSeller,
  }
}

export const products: Product[] = [
  makeProduct({ id: 'p1', slug: 'abaya-layali', name: 'عباية ليالي', price: 45.5, compareAtPrice: 58, categoryId: 'cat-black', badges: ['خصم', 'الأكثر مبيعاً'], isBestSeller: true, seedBase: 'p1' }),
  makeProduct({ id: 'p2', slug: 'abaya-nujoom', name: 'عباية نجوم', price: 52, categoryId: 'cat-embroidered', badges: ['جديد'], isFeatured: true, seedBase: 'p2' }),
  makeProduct({ id: 'p3', slug: 'abaya-sahra', name: 'عباية سهرة', price: 68, compareAtPrice: 82, categoryId: 'cat-occasion', badges: ['حصري', 'خصم'], isFeatured: true, seedBase: 'p3' }),
  makeProduct({ id: 'p4', slug: 'abaya-simplicity', name: 'عباية البساطة', price: 32, categoryId: 'cat-casual', badges: [], seedBase: 'p4' }),
  makeProduct({ id: 'p5', slug: 'abaya-wisam', name: 'عباية وسام', price: 41, categoryId: 'cat-black', badges: ['محدود الكمية'], isBestSeller: true, seedBase: 'p5' }),
  makeProduct({ id: 'p6', slug: 'abaya-jawaher', name: 'عباية جواهر', price: 75, categoryId: 'cat-embroidered', badges: ['حصري'], isFeatured: true, seedBase: 'p6' }),
  makeProduct({ id: 'p7', slug: 'abaya-rimal', name: 'عباية رمال', price: 38, categoryId: 'cat-casual', badges: ['جديد'], seedBase: 'p7' }),
  makeProduct({ id: 'p8', slug: 'abaya-shurouq', name: 'عباية شروق', price: 49.9, compareAtPrice: 60, categoryId: 'cat-ramadan', badges: ['خصم', 'جديد'], isFeatured: true, seedBase: 'p8' }),
  makeProduct({ id: 'p9', slug: 'abaya-amira', name: 'عباية أميرة', price: 55, categoryId: 'cat-occasion', badges: [], seedBase: 'p9' }),
  makeProduct({ id: 'p10', slug: 'abaya-warda', name: 'عباية وردة', price: 44, categoryId: 'cat-black', badges: ['الأكثر مبيعاً'], isBestSeller: true, seedBase: 'p10' }),
  makeProduct({ id: 'p11', slug: 'abaya-lujain', name: 'عباية لجين', price: 62, categoryId: 'cat-embroidered', badges: ['محدود الكمية'], seedBase: 'p11' }),
  makeProduct({ id: 'p12', slug: 'abaya-sabaya', name: 'عباية صبايا', price: 35, categoryId: 'cat-casual', badges: [], seedBase: 'p12' }),
]

products.forEach((p) => {
  p.relatedProductIds = products.filter((o) => o.categoryId === p.categoryId && o.id !== p.id).slice(0, 4).map((o) => o.id)
})

export const testimonials: Testimonial[] = [
  { id: 't1', customerName: 'مريم العلي', rating: 5, comment: 'جودة القماش فاخرة والقصة تناسب الجسم بشكل رائع، التوصيل كان سريع جداً' },
  { id: 't2', customerName: 'نورة سالم', rating: 5, comment: 'من أرقى المتاجر اللي تعاملت معها، التغليف فخم والعباية زي الصور بالضبط' },
  { id: 't3', customerName: 'فاطمة حسن', rating: 4, comment: 'تصميم أنيق وخامة ممتازة، بالتأكيد راح أطلب مرة ثانية' },
  { id: 't4', customerName: 'هند عبدالله', rating: 5, comment: 'خدمة العملاء متعاونة جداً وساعدوني أختار المقاس المناسب' },
]

export interface ShippingMethod {
  id: string
  name: string
  description: string
  price: number
  freeAbove?: number
  isActive?: boolean
  order?: number
}

export const shippingMethods: ShippingMethod[] = [
  { id: "standard", name: "الشحن العادي", description: "من 3 إلى 5 أيام عمل", price: 2.5, freeAbove: 30 },
  { id: "express", name: "الشحن السريع", description: "من يوم إلى يومين", price: 4.5 },
  { id: "pickup", name: "الاستلام من الفرع", description: "جاهز خلال 24 ساعة", price: 0 },
]

export const cities = ["المنامة", "المحرق", "الرفاع", "مدينة عيسى", "مدينة حمد", "سترة"]

export interface BankDetails {
  bankName: string
  accountName: string
  iban: string
}

export const bankDetails: BankDetails = {
  bankName: "بنك البحرين الوطني (NBB)",
  accountName: "نجد للعبايات",
  iban: "BH67 NBOB 0000 0012 3456 78",
}

export type PaymentMethod = "cod" | "bankTransfer"

export interface MockOrder {
  id: string
  date: string
  status: OrderStatus
  total: number
  customerName: string
  customerPhone: string
  city: string
  trackingSteps: OrderStatus[]
  items: { productId: string; name: string; image: string; quantity: number; price: number; color: string; size: string }[]
  paymentMethod: PaymentMethod
  paymentProof?: string
  paymentConfirmed?: boolean
}

export const mockOrders: MockOrder[] = [
  {
    id: "AB-482913",
    date: "2026-08-28",
    status: "shipped",
    total: 97.5,
    customerName: "مريم العلي",
    customerPhone: "+973 3300 1122",
    city: "المنامة",
    trackingSteps: ["new", "confirmed", "preparing", "shipped"],
    items: [
      { productId: "p1", name: products[0].name, image: products[0].images[0], quantity: 1, price: products[0].price, color: "أسود", size: "56" },
      { productId: "p4", name: products[3].name, image: products[3].images[0], quantity: 1, price: products[3].price, color: "بيج", size: "54" },
    ],
    paymentMethod: "bankTransfer",
    paymentProof: "/images/black-1.jpg",
    paymentConfirmed: true,
  },
  {
    id: "AB-471820",
    date: "2026-08-10",
    status: "completed",
    total: 44,
    customerName: "نورة سالم",
    customerPhone: "+973 3311 4455",
    city: "الرفاع",
    trackingSteps: ["new", "confirmed", "preparing", "shipped", "delivered", "completed"],
    items: [{ productId: "p10", name: products[9].name, image: products[9].images[0], quantity: 1, price: products[9].price, color: "أسود", size: "58" }],
    paymentMethod: "cod",
  },
  {
    id: "AB-465310",
    date: "2026-08-05",
    status: "new",
    total: 68,
    customerName: "فاطمة حسن",
    customerPhone: "+973 3322 7788",
    city: "مدينة حمد",
    trackingSteps: ["new"],
    items: [{ productId: "p3", name: products[2].name, image: products[2].images[0], quantity: 1, price: products[2].price, color: "أسود", size: "54" }],
    paymentMethod: "cod",
  },
  {
    id: "AB-459102",
    date: "2026-07-30",
    status: "preparing",
    total: 113.9,
    customerName: "هند عبدالله",
    customerPhone: "+973 3344 9900",
    city: "مدينة عيسى",
    trackingSteps: ["new", "confirmed", "preparing"],
    items: [
      { productId: "p8", name: products[7].name, image: products[7].images[0], quantity: 1, price: products[7].price, color: "أسود", size: "56" },
      { productId: "p6", name: products[5].name, image: products[5].images[0], quantity: 1, price: products[5].price, color: "بيج", size: "58" },
    ],
    paymentMethod: "bankTransfer",
    paymentProof: "/images/embroidered-2.jpg",
    paymentConfirmed: false,
  },
  {
    id: "AB-452207",
    date: "2026-07-22",
    status: "cancelled",
    total: 41,
    customerName: "عائشة يوسف",
    customerPhone: "+973 3355 6611",
    city: "سترة",
    trackingSteps: ["new"],
    items: [{ productId: "p5", name: products[4].name, image: products[4].images[0], quantity: 1, price: products[4].price, color: "أسود", size: "52" }],
    paymentMethod: "cod",
  },
  {
    id: "AB-448821",
    date: "2026-07-14",
    status: "returnRequested",
    total: 62,
    customerName: "مريم العلي",
    customerPhone: "+973 3300 1122",
    city: "المنامة",
    trackingSteps: ["new", "confirmed", "preparing", "shipped", "delivered"],
    items: [{ productId: "p11", name: products[10].name, image: products[10].images[0], quantity: 1, price: products[10].price, color: "أسود", size: "56" }],
    paymentMethod: "cod",
  },
]

export const coupons: Coupon[] = [
  { id: "c1", code: "WELCOME10", type: "percentage", value: 10, minOrder: 0, usageLimit: 500, usedCount: 128, isActive: true },
  { id: "c2", code: "EID25", type: "percentage", value: 25, minOrder: 50, usageLimit: 200, usedCount: 200, expiresAt: "2026-04-15", isActive: false },
  { id: "c3", code: "FREESHIP", type: "fixed", value: 2.5, minOrder: 20, usedCount: 76, isActive: true },
  { id: "c4", code: "VIP15", type: "percentage", value: 15, usageLimit: 50, usedCount: 12, isActive: true },
]

export const contactMessages: ContactMessage[] = [
  { id: "m1", name: "سارة أحمد", email: "sara.a@example.com", phone: "+973 3366 2211", subject: "استفسار عن مقاس", message: "هل يتوفر مقاس 62 لعباية ليالي؟", date: "2026-09-05", isRead: false },
  { id: "m2", name: "ريم خالد", email: "reem.k@example.com", subject: "تعديل على الطلب", message: "أبي أغيّر عنوان التوصيل لطلب AB-482913", date: "2026-09-03", isRead: false },
  { id: "m3", name: "دانة سعيد", email: "dana.s@example.com", phone: "+973 3377 3344", subject: "شكر", message: "وصلني الطلب وأنا فخورة فيه، شكراً لكم", date: "2026-08-30", isRead: true },
]

export const adminReviews: AdminReview[] = [
  { id: "r1", productId: "p1", productName: products[0].name, customerName: "مريم العلي", rating: 5, comment: "جودة القماش فاخرة والقصة تناسب الجسم بشكل رائع", date: "2026-09-01", status: "approved" },
  { id: "r2", productId: "p10", productName: products[9].name, customerName: "نورة سالم", rating: 5, comment: "من أرقى المتاجر اللي تعاملت معها", date: "2026-08-29", status: "approved" },
  { id: "r3", productId: "p3", productName: products[2].name, customerName: "فاطمة حسن", rating: 4, comment: "تصميم أنيق، بس التوصيل تأخر يومين عن الموعد", date: "2026-09-06", status: "pending" },
  { id: "r4", productId: "p8", productName: products[7].name, customerName: "هند عبدالله", rating: 3, comment: "الخامة حلوة بس اللون مختلف شوي عن الصورة", date: "2026-09-08", status: "pending" },
]

export const adminStaff: AdminStaff[] = [
  { id: "u1", name: "نورة الأدمن", email: "admin@store.bh", role: "superAdmin", isActive: true, lastActive: "2026-09-10" },
  { id: "u2", name: "خالد المنتجات", email: "products@store.bh", role: "productsManager", isActive: true, lastActive: "2026-09-09" },
  { id: "u3", name: "شهد الطلبات", email: "orders@store.bh", role: "ordersStaff", isActive: true, lastActive: "2026-09-10" },
  { id: "u4", name: "علي الدعم", email: "support@store.bh", role: "supportStaff", isActive: false, lastActive: "2026-08-20" },
]

export interface AdminCustomer {
  name: string
  phone: string
  city: string
  ordersCount: number
  totalSpent: number
  lastOrderDate: string
}

export const adminCustomers: AdminCustomer[] = Object.values(
  mockOrders.reduce<Record<string, AdminCustomer>>((acc, order) => {
    const key = order.customerPhone
    if (!acc[key]) {
      acc[key] = { name: order.customerName, phone: order.customerPhone, city: order.city, ordersCount: 0, totalSpent: 0, lastOrderDate: order.date }
    }
    acc[key].ordersCount += 1
    acc[key].totalSpent += order.total
    if (order.date > acc[key].lastOrderDate) acc[key].lastOrderDate = order.date
    return acc
  }, {})
)

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug)
}

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug)
}

export function getProductsByCategory(categoryId: string) {
  return products.filter((p) => p.categoryId === categoryId)
}
