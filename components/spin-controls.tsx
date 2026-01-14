"use client"

import { Button } from "@/components/ui/button"
import { Loader2, Shuffle, Heart, ExternalLink, Zap } from "lucide-react"

interface SpinControlsProps {
  freeSpinsRemaining: number
  isSpinning: boolean
  isTipping: boolean
  onSpin: () => void
  onBuySpins: () => void
  onTip: () => void
  onFollow: () => void
  disabled?: boolean
}

export function SpinControls({
  freeSpinsRemaining,
  isSpinning,
  isTipping,
  onSpin,
  onBuySpins,
  onTip,
  onFollow,
  disabled = false,
}: SpinControlsProps) {
  const hasSpins = freeSpinsRemaining > 0
  const canSpin = hasSpins && !disabled

  return (
    <div className="space-y-3">
      {/* Main action buttons */}
      <div className="grid grid-cols-2 gap-3">
        {/* SPIN Button - shows different state based on available spins */}
        {hasSpins ? (
          <Button
            onClick={onSpin}
            disabled={!canSpin || isSpinning}
            className="h-14 touch-target border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(45,45,45,1)] active:shadow-[2px_2px_0px_0px_rgba(45,45,45,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all duration-75 bg-primary text-primary-foreground font-mono font-bold tracking-tight text-base hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:border-muted-foreground/50 disabled:shadow-none"
            aria-label="spin"
          >
            {isSpinning ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Shuffle className="h-5 w-5 mr-2" />}
            <span className="flex flex-col items-start leading-tight">
              <span>SPIN</span>
              <span className="text-[10px] opacity-80">{freeSpinsRemaining} left</span>
            </span>
          </Button>
        ) : (
          <Button
            onClick={onBuySpins}
            disabled={disabled}
            className="h-14 touch-target border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(45,45,45,1)] active:shadow-[2px_2px_0px_0px_rgba(45,45,45,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all duration-75 bg-secondary text-secondary-foreground font-mono font-bold tracking-tight text-base hover:bg-secondary/90 disabled:bg-muted disabled:text-muted-foreground disabled:border-muted-foreground/50 disabled:shadow-none"
            aria-label="buy spins"
          >
            <Zap className="h-5 w-5 mr-2" />
            <span className="flex flex-col items-start leading-tight">
              <span>BUY SPINS</span>
              <span className="text-[10px] opacity-80">get more</span>
            </span>
          </Button>
        )}

        {/* TIP Button */}
        <Button
          onClick={onTip}
          disabled={isTipping || disabled}
          className="h-14 touch-target border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(45,45,45,1)] active:shadow-[2px_2px_0px_0px_rgba(45,45,45,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all duration-75 bg-accent text-accent-foreground font-mono font-bold tracking-tight text-base hover:bg-accent/90 disabled:bg-muted disabled:text-muted-foreground disabled:border-muted-foreground/50 disabled:shadow-none"
          aria-label="tip creator"
        >
          {isTipping ? (
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
          ) : (
            <Heart className="h-5 w-5 mr-2 fill-current" />
          )}
          <span className="flex flex-col items-start leading-tight">
            <span>TIP</span>
            <span className="text-[10px] opacity-80">support creator</span>
          </span>
        </Button>
      </div>

      {/* FOLLOW Button - full width */}
      <Button
        onClick={onFollow}
        disabled={disabled}
        className="w-full h-12 touch-target border-4 border-dashed border-foreground shadow-[4px_4px_0px_0px_rgba(45,45,45,1)] active:shadow-[2px_2px_0px_0px_rgba(45,45,45,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all duration-75 bg-muted text-foreground font-mono font-bold tracking-tight text-base hover:bg-muted/80 disabled:opacity-50 disabled:shadow-none"
        aria-label="follow on warpcast"
      >
        <ExternalLink className="h-5 w-5 mr-2" />
        FOLLOW ON WARPCAST
      </Button>
    </div>
  )
}
