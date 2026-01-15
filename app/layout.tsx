import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { FarcasterProvider } from "@/lib/farcaster"
import "./globals.css"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#e8b4f0",
}

export const metadata: Metadata = {
  title: "CastRoulette — Discover random quality casts",
  description:
    "Explore the best Farcaster content with a fun spin system. Get quality casts randomly with spin and tip features.",
  generator: "v0.app",
  applicationName: "CastRoulette",
  icons: {
    icon: [
      { url: "/logo.png", sizes: "any" },
      { url: "/logo.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/logo.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/logo.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CastRoulette",
  },
  openGraph: {
    title: "CastRoulette — Discover random quality casts",
    description: "Explore the best Farcaster content with a fun spin system.",
    images: ["/logo.png"],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "CastRoulette",
    description: "Discover random quality casts on Farcaster",
    images: ["/logo.png"],
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": "/api/og",
    "fc:frame:button:1": "SPIN",
    "fc:frame:button:2": "BUY SPINS",
    "fc:frame:button:3": "TIP",
    "fc:frame:button:4": "FOLLOW",
    "fc:frame:post_url": "/api/frame",
    "base:app_id": "6967f1ef91006bd68cba53c9",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="touch-manipulation">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased overscroll-none`}>
        <FarcasterProvider>
          <Suspense fallback={null}>{children}</Suspense>
        </FarcasterProvider>
        <Analytics />
      </body>
    </html>
  )
}
