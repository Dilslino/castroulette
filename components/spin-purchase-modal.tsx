"use client"

import { X, Zap, Package, Sparkles } from "lucide-react"
import { useState } from "react"

interface SpinPackage {
  id: string
  spins: number
  price: number
  pricePerSpin: number
  popular?: boolean
  bestValue?: boolean
}

const SPIN_PACKAGES: SpinPackage[] = [
  { id: "single", spins: 1, price: 0.05, pricePerSpin: 0.05 },
  { id: "starter", spins: 5, price: 0.20, pricePerSpin: 0.04 },
  { id: "popular", spins: 15, price: 0.45, pricePerSpin: 0.03, popular: true },
  { id: "mega", spins: 50, price: 1.00, pricePerSpin: 0.02, bestValue: true },
]

interface SpinPurchaseModalProps {
  isOpen: boolean
  onClose: () => void
  onPurchase: (spins: number, price: number) => Promise<void>
}

export function SpinPurchaseModal({ isOpen, onClose, onPurchase }: SpinPurchaseModalProps) {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [isPurchasing, setIsPurchasing] = useState(false)

  if (!isOpen) return null

  const handlePurchase = async (pkg: SpinPackage) => {
    setSelectedPackage(pkg.id)
    setIsPurchasing(true)
    try {
      await onPurchase(pkg.spins, pkg.price)
      onClose()
    } catch (error) {
      console.error("Purchase failed:", error)
    } finally {
      setIsPurchasing(false)
      setSelectedPackage(null)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-sm mx-auto bg-card border-4 border-black shadow-[8px_8px_0px_0px_rgba(45,45,45,1)] z-50 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-4 border-black bg-primary">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary-foreground" />
            <h2 className="font-mono font-bold text-lg text-primary-foreground">
              GET SPINS
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-card border-2 border-black active:bg-muted"
            aria-label="close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <p className="font-mono text-sm text-foreground/70 text-center">
            choose a spin package
          </p>

          {/* Package Options */}
          {SPIN_PACKAGES.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => handlePurchase(pkg)}
              disabled={isPurchasing}
              className={`
                w-full p-4 border-4 border-black text-left transition-all duration-75
                ${pkg.popular ? "bg-accent" : pkg.bestValue ? "bg-secondary" : "bg-muted"}
                ${isPurchasing && selectedPackage === pkg.id
                  ? "opacity-50"
                  : "shadow-[4px_4px_0px_0px_rgba(45,45,45,1)] active:shadow-[2px_2px_0px_0px_rgba(45,45,45,1)] active:translate-x-[2px] active:translate-y-[2px]"
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {pkg.spins === 1 ? (
                    <Zap className="h-6 w-6" />
                  ) : pkg.bestValue ? (
                    <Sparkles className="h-6 w-6" />
                  ) : (
                    <Package className="h-6 w-6" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-lg">
                        {pkg.spins} {pkg.spins === 1 ? "SPIN" : "SPINS"}
                      </span>
                      {pkg.popular && (
                        <span className="px-2 py-0.5 bg-black text-white font-mono text-[10px] font-bold">
                          POPULAR
                        </span>
                      )}
                      {pkg.bestValue && (
                        <span className="px-2 py-0.5 bg-black text-white font-mono text-[10px] font-bold">
                          BEST VALUE
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-xs text-foreground/60">
                      ${pkg.pricePerSpin.toFixed(2)}/spin
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-xl">
                    ${pkg.price.toFixed(2)}
                  </span>
                  <p className="font-mono text-[10px] text-foreground/60">
                    USDC
                  </p>
                </div>
              </div>
            </button>
          ))}

          {/* Info */}
          <p className="font-mono text-[10px] text-foreground/50 text-center pt-2">
            spins never expire. pay with USDC on Base.
          </p>
        </div>
      </div>
    </>
  )
}
