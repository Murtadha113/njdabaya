import { adminDb } from "./firebase-admin"
import type {
  Product,
  Category,
  Testimonial,
  Coupon,
  ContactMessage,
  AdminReview,
  AdminStaff,
} from "./types"
import type { ShippingMethod, BankDetails, MockOrder, AdminCustomer, PaymentMethod } from "./mock-data"

export type { ShippingMethod, BankDetails, MockOrder, AdminCustomer, PaymentMethod }

export interface StoreSettings {
  storeName: string
  storeDescription: string
  whatsapp: string
  email: string
  currency: string
  taxRate: number
  freeShippingThreshold: number
  cities: string[]
  bankDetails: BankDetails
}

export async function getProducts(): Promise<Product[]> {
  const snap = await adminDb.collection("products").get()
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Product)
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const snap = await adminDb.collection("products").where("slug", "==", slug).limit(1).get()
  if (snap.empty) return undefined
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as Product
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const doc = await adminDb.collection("products").doc(id).get()
  if (!doc.exists) return undefined
  return { id: doc.id, ...doc.data() } as Product
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return []
  const products = await getProducts()
  const byId = new Map(products.map((p) => [p.id, p]))
  return ids.map((id) => byId.get(id)).filter((p): p is Product => !!p)
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const snap = await adminDb.collection("products").where("categoryId", "==", categoryId).get()
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Product)
}

export async function getCategories(): Promise<Category[]> {
  const snap = await adminDb.collection("categories").orderBy("order").get()
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Category)
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const snap = await adminDb.collection("categories").where("slug", "==", slug).limit(1).get()
  if (snap.empty) return undefined
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as Category
}

export async function getCategoryById(id: string): Promise<Category | undefined> {
  const doc = await adminDb.collection("categories").doc(id).get()
  if (!doc.exists) return undefined
  return { id: doc.id, ...doc.data() } as Category
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const snap = await adminDb.collection("testimonials").get()
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Testimonial)
}

const SHIPPING_ORDER = ["standard", "express", "pickup"]

export async function getShippingMethods(): Promise<ShippingMethod[]> {
  const snap = await adminDb.collection("shippingMethods").get()
  const methods = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ShippingMethod)
  return methods.sort((a, b) => SHIPPING_ORDER.indexOf(a.id) - SHIPPING_ORDER.indexOf(b.id))
}

export async function getOrders(): Promise<MockOrder[]> {
  const snap = await adminDb.collection("orders").orderBy("date", "desc").get()
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as MockOrder)
}

export async function getOrderById(id: string): Promise<MockOrder | undefined> {
  const doc = await adminDb.collection("orders").doc(id).get()
  if (!doc.exists) return undefined
  return { id: doc.id, ...doc.data() } as MockOrder
}

export async function getCoupons(): Promise<Coupon[]> {
  const snap = await adminDb.collection("coupons").get()
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Coupon)
}

export async function getCouponByCode(code: string): Promise<Coupon | undefined> {
  const snap = await adminDb
    .collection("coupons")
    .where("code", "==", code.toUpperCase())
    .limit(1)
    .get()
  if (snap.empty) return undefined
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as Coupon
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const snap = await adminDb.collection("contactMessages").orderBy("date", "desc").get()
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ContactMessage)
}

export async function getReviews(): Promise<AdminReview[]> {
  const snap = await adminDb.collection("reviews").orderBy("date", "desc").get()
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as AdminReview)
}

export async function getApprovedReviewsForProduct(productId: string): Promise<AdminReview[]> {
  const snap = await adminDb
    .collection("reviews")
    .where("productId", "==", productId)
    .where("status", "==", "approved")
    .get()
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as AdminReview)
}

export async function getStaff(): Promise<AdminStaff[]> {
  const snap = await adminDb.collection("staff").get()
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as AdminStaff)
}

export async function getStoreSettings(): Promise<StoreSettings> {
  const doc = await adminDb.collection("settings").doc("store").get()
  return doc.data() as StoreSettings
}

export async function getCustomers(): Promise<AdminCustomer[]> {
  const orders = await getOrders()
  const byPhone = orders.reduce<Record<string, AdminCustomer>>((acc, order) => {
    const key = order.customerPhone
    if (!acc[key]) {
      acc[key] = {
        name: order.customerName,
        phone: order.customerPhone,
        city: order.city,
        ordersCount: 0,
        totalSpent: 0,
        lastOrderDate: order.date,
      }
    }
    acc[key].ordersCount += 1
    acc[key].totalSpent += order.total
    if (order.date > acc[key].lastOrderDate) acc[key].lastOrderDate = order.date
    return acc
  }, {})
  return Object.values(byPhone)
}
