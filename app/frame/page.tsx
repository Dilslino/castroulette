import { FrameUI } from "@/components/frame-ui"
import { Suspense } from "react"
import type { Metadata, Viewport } from "next"

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export default function FramePage({ searchParams }: PageProps) {
  const lang = searchParams.lang === "en" ? "en" : "id"

  return (
    <main className="min-h-dvh bg-background flex flex-col safe-area-inset">
      <Suspense fallback={<FrameLoadingSkeleton />}>
        <FrameUI language={lang} />
      </Suspense>
    </main>
  )
}

function FrameLoadingSkeleton() {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="h-8 bg-muted animate-pulse border-2 border-black" />
        <div className="h-48 bg-muted animate-pulse border-4 border-black" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-14 bg-muted animate-pulse border-2 border-black" />
          <div className="h-14 bg-muted animate-pulse border-2 border-black" />
          <div className="h-14 bg-muted animate-pulse border-2 border-black" />
          <div className="h-14 bg-muted animate-pulse border-2 border-black" />
        </div>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: "CastRoulette Frame",
  description: "Temukan cast acak berkualitas di Farcaster",
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": "/api/og",
    "fc:frame:button:1": "SPIN",
    "fc:frame:button:2": "RE-ROLL",
    "fc:frame:button:3": "TIP",
    "fc:frame:button:4": "FOLLOW",
    "fc:frame:post_url": "/api/frame",
  },
}
