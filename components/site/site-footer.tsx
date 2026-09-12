import Image from "next/image"
import Link from "next/link"
import { AtSign, Camera, MessageCircle } from "lucide-react"
import { mainNav, footerPolicyLinks } from "@/lib/nav"
import { NewsletterForm } from "./newsletter-form"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-3 md:col-span-1">
            <Image
              src="/images/njd-logo-wordmark.webp"
              alt="نجد"
              width={124}
              height={60}
              className="h-10 w-auto"
            />
            <p className="text-sm leading-relaxed text-muted-foreground">
              عبايات فاخرة بتصاميم عصرية وخامات راقية، نصنعها لتكون امتداداً لأناقتك في كل تفصيلة.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="#" aria-label="Instagram" className="flex size-9 items-center justify-center rounded-full border border-border hover:bg-background">
                <Camera className="size-4" />
              </a>
              <a href="#" aria-label="X" className="flex size-9 items-center justify-center rounded-full border border-border hover:bg-background">
                <AtSign className="size-4" />
              </a>
              <a href="#" aria-label="WhatsApp" className="flex size-9 items-center justify-center rounded-full border border-border hover:bg-background">
                <MessageCircle className="size-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">روابط سريعة</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-foreground">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">سياسات المتجر</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {footerPolicyLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-foreground">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">النشرة البريدية</h3>
            <p className="mb-3 text-sm text-muted-foreground">
              اشتركي لتصلك أحدث المجموعات والعروض أولاً بأول
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>جميع الحقوق محفوظة © {new Date().getFullYear()} نجد</p>
          <p>صُنع بعناية لعميلاتنا الكريمات</p>
        </div>
      </div>
    </footer>
  )
}
