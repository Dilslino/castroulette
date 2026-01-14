"use client"

import { Button } from "@/components/ui/button"
import { Loader2, Shuffle, RotateCcw, Heart, ExternalLink } from "lucide-react"

interface SpinControlsProps {
  freeSpinsRemaining: number
  isSpinning: boolean
  isRerolling: boolean
  isTipping: boolean
  onSpin: () => void
  onReroll: () => void
  onTip: () => void
  onFollow: () => void
  disabled?: boolean
}

export function SpinControls({
  freeSpinsRemaining,
  isSpinning,
  isRerolling,
  isTipping,
  onSpin,
  onReroll,
  onTip,
  onFollow,
  disabled = false,
}: SpinControlsProps) {
  const canSpin = freeSpinsRemaining > 0 && !disabled

  return (
    <div className="space-y-3">
      {/* Main action buttons - 2x2 grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* SPIN Button */}
        <Button
          onClick={onSpin}
          disabled={!canSpin || isSpinning}
          className="h-14 touch-target border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(45,45,45,1)] active:shadow-[2px_2px_0px_0px_rgba(45,45,45,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all duration-75 bg-primary text-primary-foreground font-mono font-bold tracking-tight text-base hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:border-muted-foreground/50 disabled:shadow-none"
          aria-label="spin"
        >
          {isSpinning ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Shuffle className="h-5 w-5 mr-2" />}
          SPIN
        </Button>

        {/* RE-ROLL Button */}
        <Button
          onClick={onReroll}
          disabled={isRerolling || disabled}
          className="h-14 touch-target border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(45,45,45,1)] active:shadow-[2px_2px_0px_0px_rgba(45,45,45,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all duration-75 bg-secondary text-secondary-foreground font-mono font-bold tracking-tight text-base hover:bg-secondary/90 disabled:bg-muted disabled:text-muted-foreground disabled:border-muted-foreground/50 disabled:shadow-none"
          aria-label="reroll for 0.05 USDC"
        >
          {isRerolling ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <RotateCcw className="h-5 w-5 mr-2" />}
          <span className="flex flex-col items-start leading-tight">
            <span>REROLL</span>
            <span className="text-[10px] opacity-80">0.05 USDC</span>
          </span>
        </Button>

        {/* TIP Button */}
        <Button
          onClick={onTip}
          disabled={isTipping || disabled}
          className="h-14 touch-target border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(45,45,45,1)] active:shadow-[2px_2px_0px_0px_rgba(45,45,45,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all duration-75 bg-accent text-accent-foreground font-mono font-bold tracking-tight text-base hover:bg-accent/90 disabled:bg-muted disabled:text-muted-foreground disabled:border-muted-foreground/50 disabled:shadow-none"
          aria-label="tip 0.10 USDC"
        >
          {isTipping ? (
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
          ) : (
            <Heart className="h-5 w-5 mr-2 fill-current" />
          )}
          <span className="flex flex-col items-start leading-tight">
            <span>TIP</span>
            <span className="text-[10px] opacity-80">0.10 USDC</span>
          </span>
        </Button>

        {/* FOLLOW Button */}
        <Button
          onClick={onFollow}
          disabled={disabled}
          className="h-14 touch-target border-4 border-dashed border-foreground shadow-[4px_4px_0px_0px_rgba(45,45,45,1)] active:shadow-[2px_2px_0px_0px_rgba(45,45,45,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all duration-75 bg-muted text-foreground font-mono font-bold tracking-tight text-base hover:bg-muted/80 disabled:opacity-50 disabled:shadow-none"
          aria-label="follow on warpcast"
        >
          <ExternalLink className="h-5 w-5 mr-2" />
          FOLLOW
        </Button>
      </div>

      {/* Free spins indicator */}
      {freeSpinsRemaining > 0 && (
        <div className="text-center">
          <p className="inline-flex items-center gap-2 font-mono font-bold text-sm text-foreground bg-card px-4 py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(45,45,45,1)]">
            <Shuffle className="h-4 w-4 text-primary" />
            {freeSpinsRemaining} free spins left
          </p>
        </div>
      )}
    </div>
  )
}
