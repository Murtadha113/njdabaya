export type ProductBadge = 'جديد' | 'الأكثر مبيعاً' | 'خصم' | 'محدود الكمية' | 'حصري'

export interface ProductColor {
  name: string
  hex: string
}

export interface ProductReview {
  id: string
  customerName: string
  rating: number
  comment: string
  date: string
}

export interface Product {
  id: string
  slug: string
  name: string
  shortDescription: string
  description: string
  images: string[]
  videoUrl?: string
  price: number
  compareAtPrice?: number
  previousPrice?: number
  categoryId: string
  colors: ProductColor[]
  sizes: string[]
  length?: string
  fabric: string
  careInstructions: string
  stock: number
  status: 'available' | 'soldOut' | 'preOrder'
  badges: ProductBadge[]
  relatedProductIds: string[]
  reviews: ProductReview[]
  rating: number
  reviewsCount: number
  createdAt: string
  isFeatured?: boolean
  isBestSeller?: boolean
}

export interface Category {
  id: string
  slug: string
  name: string
  description: string
  coverImage: string
  order: number
  parentId?: string
  isSeasonal?: boolean
  showOnHome?: boolean
}

export interface Testimonial {
  id: string
  customerName: string
  rating: number
  comment: string
  avatar?: string
}

export interface CartItem {
  productId: string
  slug: string
  name: string
  image: string
  price: number
  color: string
  size: string
  quantity: number
  note?: string
}

export type OrderStatus =
  | 'new'
  | 'reviewing'
  | 'confirmed'
  | 'preparing'
  | 'readyToShip'
  | 'shipped'
  | 'outForDelivery'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'returnRequested'
  | 'exchangeRequested'

export interface AdminReview {
  id: string
  productId: string
  productName: string
  customerName: string
  rating: number
  comment: string
  date: string
  status: 'pending' | 'approved'
}

export interface Coupon {
  id: string
  code: string
  type: 'percentage' | 'fixed'
  value: number
  minOrder?: number
  usageLimit?: number
  usedCount: number
  expiresAt?: string
  isActive: boolean
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  date: string
  isRead: boolean
}

export type AdminRole = 'superAdmin' | 'productsManager' | 'ordersStaff' | 'supportStaff' | 'contentStaff'

export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  superAdmin: 'مدير عام',
  productsManager: 'مدير منتجات',
  ordersStaff: 'موظف طلبات',
  supportStaff: 'موظف خدمة عملاء',
  contentStaff: 'موظف محتوى',
}

export interface AdminStaff {
  id: string
  name: string
  email: string
  role: AdminRole
  isActive: boolean
  lastActive: string
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: 'طلب جديد',
  reviewing: 'قيد المراجعة',
  confirmed: 'تم التأكيد',
  preparing: 'قيد التجهيز',
  readyToShip: 'جاهز للشحن',
  shipped: 'تم الشحن',
  outForDelivery: 'خرج للتوصيل',
  delivered: 'تم التسليم',
  completed: 'مكتمل',
  cancelled: 'ملغي',
  returnRequested: 'طلب استرجاع',
  exchangeRequested: 'طلب استبدال',
}
