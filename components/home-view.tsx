"use client"

import { Shuffle, Zap, Gift, TrendingUp, Clock, DollarSign, Users, Heart, BarChart3 } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useFarcaster } from "@/lib/farcaster"

interface HomeViewProps {
  onStartSpin: () => void
}

export function HomeView({ onStartSpin }: HomeViewProps) {
  const { user: appUser } = useAppStore()
  const { user: farcasterUser, hapticFeedback } = useFarcaster()

  const displayName = farcasterUser?.displayName || farcasterUser?.username || "friend"

  const todayStats = {
    spinsToday: 5,
    castsDiscovered: 5,
    tipsGiven: 1,
  }

  const dailyReward = {
    claimed: false,
    bonusSpins: 3,
  }

  const platformStats = {
    totalSpins: 12847,
    totalTips: 456.78,
    activeUsers: 1234,
    creatorsSupported: 89,
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4">
      {/* Welcome Header */}
      <div className="bg-gradient-to-br from-primary to-secondary border-4 border-black shadow-[6px_6px_0px_0px_rgba(45,45,45,1)] p-5 mb-4">
        <p className="font-mono text-sm text-primary-foreground/80 mb-1">
          yo {displayName}, welcome to
        </p>
        <h1 className="font-mono font-black text-3xl text-primary-foreground mb-2">
          CASTROULETTE
        </h1>
        <p className="font-mono text-sm text-primary-foreground/80">
          spin the wheel, find dope creators, send some love
        </p>
      </div>

      {/* Free Spins Card */}
      <div className="bg-card border-4 border-black shadow-[4px_4px_0px_0px_rgba(45,45,45,1)] p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary border-2 border-black flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-mono text-xs text-foreground/60">
                free spins left
              </p>
              <p className="font-mono font-bold text-2xl">{appUser.freeSpinsRemaining}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-mono text-[10px] text-foreground/50">
              resets in
            </p>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-foreground/50" />
              <span className="font-mono font-bold text-sm">23:45:12</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-3 bg-muted border-2 border-black mb-2">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(appUser.freeSpinsRemaining / 10) * 100}%` }}
          />
        </div>
        <p className="font-mono text-[10px] text-foreground/50 text-center">
          {appUser.freeSpinsRemaining}/10 spins ready
        </p>
      </div>

      {/* Today's Activity */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-muted border-3 border-black p-3 text-center">
          <Shuffle className="h-5 w-5 mx-auto mb-1 text-primary" />
          <p className="font-mono font-bold text-xl">{todayStats.spinsToday}</p>
          <p className="font-mono text-[9px] text-foreground/60">
            spins today
          </p>
        </div>
        <div className="bg-muted border-3 border-black p-3 text-center">
          <TrendingUp className="h-5 w-5 mx-auto mb-1 text-secondary" />
          <p className="font-mono font-bold text-xl">{todayStats.castsDiscovered}</p>
          <p className="font-mono text-[9px] text-foreground/60">
            casts found
          </p>
        </div>
        <div className="bg-muted border-3 border-black p-3 text-center">
          <Gift className="h-5 w-5 mx-auto mb-1 text-accent" />
          <p className="font-mono font-bold text-xl">{todayStats.tipsGiven}</p>
          <p className="font-mono text-[9px] text-foreground/60">
            tips sent
          </p>
        </div>
      </div>

      {/* Daily Reward Banner */}
      {!dailyReward.claimed && (
        <div className="bg-accent/20 border-4 border-accent border-dashed p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-accent border-2 border-black flex items-center justify-center animate-pulse">
              <Gift className="h-6 w-6 text-accent-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-mono font-bold text-sm">
                DAILY DROP
              </p>
              <p className="font-mono text-xs text-foreground/70">
                grab {dailyReward.bonusSpins} bonus spins free
              </p>
            </div>
            <button className="px-3 py-2 bg-accent text-accent-foreground border-2 border-black font-mono font-bold text-xs shadow-[2px_2px_0px_0px_rgba(45,45,45,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
              CLAIM
            </button>
          </div>
        </div>
      )}

      {/* Start Spin Button */}
      <button
        onClick={() => {
          hapticFeedback("medium")
          onStartSpin()
        }}
        className="w-full bg-primary text-primary-foreground border-4 border-black shadow-[6px_6px_0px_0px_rgba(45,45,45,1)] p-5 active:shadow-[2px_2px_0px_0px_rgba(45,45,45,1)] active:translate-x-[4px] active:translate-y-[4px] transition-all duration-75"
      >
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 bg-primary-foreground/20 border-2 border-primary-foreground/30 flex items-center justify-center rounded-full">
            <Shuffle className="h-6 w-6" />
          </div>
          <div className="text-left">
            <p className="font-mono font-black text-xl">
              LET'S SPIN
            </p>
            <p className="font-mono text-xs text-primary-foreground/80">
              find your next fav creator
            </p>
          </div>
        </div>
      </button>

      {/* How It Works */}
      <div className="mt-4 bg-card border-4 border-black shadow-[4px_4px_0px_0px_rgba(45,45,45,1)] p-4">
        <h3 className="font-mono font-bold text-sm mb-3 text-center">
          HOW IT WORKS
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-primary text-primary-foreground border-2 border-black flex items-center justify-center font-mono font-bold text-xs">
              1
            </div>
            <p className="font-mono text-xs flex-1">
              hit spin, get a random cast
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-secondary text-secondary-foreground border-2 border-black flex items-center justify-center font-mono font-bold text-xs">
              2
            </div>
            <p className="font-mono text-xs flex-1">
              check out the creator's vibe
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-accent text-accent-foreground border-2 border-black flex items-center justify-center font-mono font-bold text-xs">
              3
            </div>
            <p className="font-mono text-xs flex-1">
              like what you see? drop them a tip
            </p>
          </div>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="mt-4 bg-muted border-4 border-black shadow-[4px_4px_0px_0px_rgba(45,45,45,1)] p-4">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="h-4 w-4 text-primary" />
          <h3 className="font-mono font-bold text-sm">
            platform stats
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-card border-2 border-black p-2">
            <div className="flex items-center gap-1 mb-1">
              <TrendingUp className="h-3 w-3 text-primary" />
              <span className="font-mono text-[9px] text-foreground/70">total spins</span>
            </div>
            <p className="font-mono font-bold text-base">{platformStats.totalSpins.toLocaleString()}</p>
          </div>
          <div className="bg-card border-2 border-black p-2">
            <div className="flex items-center gap-1 mb-1">
              <DollarSign className="h-3 w-3 text-secondary" />
              <span className="font-mono text-[9px] text-foreground/70">total tips</span>
            </div>
            <p className="font-mono font-bold text-base">${platformStats.totalTips.toFixed(2)}</p>
          </div>
          <div className="bg-card border-2 border-black p-2">
            <div className="flex items-center gap-1 mb-1">
              <Users className="h-3 w-3 text-accent" />
              <span className="font-mono text-[9px] text-foreground/70">active users</span>
            </div>
            <p className="font-mono font-bold text-base">{platformStats.activeUsers.toLocaleString()}</p>
          </div>
          <div className="bg-card border-2 border-black p-2">
            <div className="flex items-center gap-1 mb-1">
              <Heart className="h-3 w-3 text-destructive" />
              <span className="font-mono text-[9px] text-foreground/70">creators backed</span>
            </div>
            <p className="font-mono font-bold text-base">{platformStats.creatorsSupported}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
