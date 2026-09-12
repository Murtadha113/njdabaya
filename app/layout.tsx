import type { Metadata, Viewport } from "next"
import { El_Messiri, Tajawal } from "next/font/google"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const elMessiri = El_Messiri({
  subsets: ["arabic", "latin"],
  variable: "--font-heading",
  display: "swap",
})

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-body",
  display: "swap",
})

export const metadata: Metadata = {
  title: "نجد | عبايات فاخرة",
  description: "متجر إلكتروني فاخر لعرض وبيع العبايات بتصاميم عصرية وخامات راقية",
  manifest: "/manifest.json",
}

export const viewport: Viewport = {
  themeColor: "#161512",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" className={`${elMessiri.variable} ${tajawal.variable}`} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
        <TooltipProvider>
          {children}
          <Toaster position="top-center" richColors />
        </TooltipProvider>
      </body>
    </html>
  )
}
