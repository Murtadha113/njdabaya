import { SiteHeader } from "@/components/site/site-header"
import { MarqueeTicker } from "@/components/site/marquee-ticker"
import { SiteFooter } from "@/components/site/site-footer"
import { BottomNav } from "@/components/site/bottom-nav"

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MarqueeTicker />
      <SiteHeader />
      <main className="flex-1 pb-24 md:pb-0">{children}</main>
      <SiteFooter />
      <BottomNav />
    </>
  )
}
