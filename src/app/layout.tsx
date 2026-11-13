import type { Metadata } from "next"
import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { QueryProvider } from "@/components/query-provider"
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { GlobalSelectionGuard } from "@/components/GlobalSelectionGuard";
import { I18nProvider } from "@/components/i18n-provider";

export const metadata: Metadata = {
  title: {
    template: "Dnd Form | %s",
    default: "Dnd Form",
  },
  description: "Trình tạo và quản lý biểu mẫu kéo thả trực quan",
}

const inter = Inter({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
    >
      <body>
        <I18nProvider>
          <ThemeProvider>
            <QueryProvider>
              <GlobalSelectionGuard />
              {children}
              <Toaster richColors position="top-right" />
            </QueryProvider>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  )
}
