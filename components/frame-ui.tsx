"use client"

import { useState, useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { CastCard } from "./cast-card"
import { SpinControls } from "./spin-controls"
import { PaymentModal } from "./payment-modal"
import { BottomNav } from "./bottom-nav"
import { MobileHeader, SideMenu } from "./mobile-header"
import { HomeView } from "./home-view"
import { LeaderboardView } from "./leaderboard-view"
import { ProfileView } from "./profile-view"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, ArrowLeft } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function FrameUI() {
  const { user, currentCast, setCurrentCast, getRandomCast, spinFree, rerollPaid, tipPaid } = useAppStore()

  const [activeTab, setActiveTab] = useState<"spin" | "leaderboard" | "profile">("spin")
  const [isSpinMode, setIsSpinMode] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSpinning, setIsSpinning] = useState(false)
  const [isRerolling, setIsRerolling] = useState(false)
  const [isTipping, setIsTipping] = useState(false)
  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean
    type: "reroll" | "tip"
    amount: number
    description: string
  }>({
    isOpen: false,
    type: "reroll",
    amount: 0,
    description: "",
  })
  const [error, setError] = useState<string | null>(null)

  // Reset spin mode when switching tabs
  useEffect(() => {
    if (activeTab !== "spin") {
      setIsSpinMode(false)
    }
  }, [activeTab])

  const handleSpin = async () => {
    if (user.freeSpinsRemaining <= 0) return

    setIsSpinning(true)
    setError(null)

    try {
      await spinFree()
      const newCast = await getRandomCast(true)
      setCurrentCast(newCast)

      toast({
        title: "nice!",
        description: "new cast loaded",
      })
    } catch (err) {
      setError("couldn't spin, try again")
    } finally {
      setIsSpinning(false)
    }
  }

  const handleReroll = () => {
    setPaymentModal({
      isOpen: true,
      type: "reroll",
      amount: 0.05,
      description: "get a fresh random cast",
    })
  }

  const handleTip = () => {
    if (!currentCast) return

    setPaymentModal({
      isOpen: true,
      type: "tip",
      amount: 0.1,
      description: `send love to @${currentCast.author.handle}`,
    })
  }

  const handleFollow = () => {
    if (!currentCast) return

    const warpcastUrl = `https://warpcast.com/${currentCast.author.handle}`
    window.open(warpcastUrl, "_blank", "noopener,noreferrer")
  }

  const handlePaymentConfirm = async () => {
    const { type, amount } = paymentModal

    if (type === "reroll") {
      setIsRerolling(true)
      try {
        const newCast = await rerollPaid({ amountUSDC: amount })
        setCurrentCast(newCast)
        setPaymentModal({ ...paymentModal, isOpen: false })

        toast({
          title: "done!",
          description: "here's your new cast",
        })
      } catch (err) {
        toast({
          title: "oops",
          description: "reroll failed",
          variant: "destructive",
        })
      } finally {
        setIsRerolling(false)
      }
    } else if (type === "tip") {
      setIsTipping(true)
      try {
        await tipPaid({
          toWallet: `@${currentCast?.author.handle}`,
          amountUSDC: amount,
        })
        setPaymentModal({ ...paymentModal, isOpen: false })

        toast({
          title: "sent!",
          description: `tip delivered to @${currentCast?.author.handle}`,
        })
      } catch (err) {
        toast({
          title: "oops",
          description: "tip didn't go through",
          variant: "destructive",
        })
      } finally {
        setIsTipping(false)
      }
    }
  }

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "leaderboard":
        return <LeaderboardView />
      case "profile":
        return <ProfileView />
      default:
        if (isSpinMode) {
          return renderSpinContent()
        }
        return <HomeView onStartSpin={handleStartSpin} />
    }
  }

  const handleStartSpin = async () => {
    setIsSpinMode(true)
    setIsLoading(true)
    try {
      const cast = await getRandomCast(true)
      setCurrentCast(cast)
    } catch (err) {
      setError("couldn't load cast")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToHome = () => {
    setIsSpinMode(false)
  }

  const renderSpinContent = () => {
    if (isLoading) {
      return (
        <div className="flex-1 flex flex-col px-4">
          <div className="flex-1 flex flex-col">
            <div className="bg-card border-4 border-black shadow-[4px_4px_0px_0px_rgba(45,45,45,1)] p-4">
              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="h-10 w-10 border-2 border-black" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-24 border border-black" />
                  <Skeleton className="h-3 w-16 border border-black" />
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <Skeleton className="h-4 w-full border border-black" />
                <Skeleton className="h-4 w-3/4 border border-black" />
                <Skeleton className="h-4 w-1/2 border border-black" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="h-8 w-16 border border-black" />
                <Skeleton className="h-8 w-16 border border-black" />
                <Skeleton className="h-8 w-16 border border-black" />
              </div>
            </div>

            <div className="mt-auto pt-6">
              <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-14 border-2 border-black" />
                <Skeleton className="h-14 border-2 border-black" />
                <Skeleton className="h-14 border-2 border-black" />
                <Skeleton className="h-14 border-2 border-black" />
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="flex-1 flex flex-col px-4 overflow-hidden">
        {/* Back Button */}
        <button
          onClick={handleBackToHome}
          className="flex items-center gap-2 mb-3 py-2 font-mono font-bold text-sm text-foreground/70 active:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          back
        </button>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-4 border-2 border-black">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="font-mono font-bold">{error}</AlertDescription>
          </Alert>
        )}

        {/* Cast Card */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {currentCast && <CastCard cast={currentCast} />}
        </div>

        {/* Spin Controls */}
        <div className="pt-4 pb-2">
          <SpinControls
            freeSpinsRemaining={user.freeSpinsRemaining}
            isSpinning={isSpinning}
            isRerolling={isRerolling}
            isTipping={isTipping}
            onSpin={handleSpin}
            onReroll={handleReroll}
            onTip={handleTip}
            onFollow={handleFollow}
            disabled={!currentCast}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col w-full max-w-md mx-auto pb-20">
      {/* Mobile Header */}
      <MobileHeader onMenuOpen={() => setIsMenuOpen(true)} />

      {/* Side Menu */}
      <SideMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />

      {/* Tab Content */}
      <div className="flex-1 flex flex-col pt-4">
        {renderContent()}
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModal.isOpen}
        onClose={() => setPaymentModal({ ...paymentModal, isOpen: false })}
        onConfirm={handlePaymentConfirm}
        isProcessing={isRerolling || isTipping}
        type={paymentModal.type}
        amount={paymentModal.amount}
        description={paymentModal.description}
      />

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  )
}
