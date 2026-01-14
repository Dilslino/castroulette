"use client"

import { User, Clock, Shuffle, Heart, RotateCcw, Copy, Check, ExternalLink, HelpCircle } from "lucide-react"
import { useState } from "react"
import { useFarcaster } from "@/lib/farcaster"

export function ProfileView() {
  const [copied, setCopied] = useState(false)
  const { user, viewProfile, openUrl } = useFarcaster()

  const userData = {
    joinedDate: "Dec 2024",
    totalSpins: 47,
    tipsGiven: 3,
    tipsReceived: 12,
    rerolls: 5,
    referralCode: "CAST-XY7K9",
    referralEarnings: 0.45,
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleViewProfile = () => {
    if (user?.fid) {
      viewProfile(user.fid)
    }
  }

  const handleOpenHelp = () => {
    openUrl("https://warpcast.com/castroulette")
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4">
      {/* Profile Header */}
      <div className="bg-primary border-4 border-black shadow-[4px_4px_0px_0px_rgba(45,45,45,1)] p-4 mb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleViewProfile}
            className="w-16 h-16 bg-card border-4 border-black flex items-center justify-center overflow-hidden"
          >
            {user?.pfpUrl ? (
              <img
                src={user.pfpUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="h-8 w-8" />
            )}
          </button>
          <div className="flex-1">
            <p className="font-mono text-xs text-primary-foreground/70">
              {user?.username ? `@${user.username}` : "farcaster user"}
            </p>
            <button
              onClick={() => handleCopy(user?.username || "")}
              className="flex items-center gap-2 font-mono font-bold text-lg text-primary-foreground"
            >
              {user?.displayName || user?.username || "User"}
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4 opacity-70" />
              )}
            </button>
            <p className="font-mono text-xs text-primary-foreground/70 mt-1">
              <Clock className="h-3 w-3 inline mr-1" />
              joined {userData.joinedDate}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-card border-4 border-black shadow-[4px_4px_0px_0px_rgba(45,45,45,1)] p-3">
          <div className="flex items-center gap-2 mb-1">
            <Shuffle className="h-4 w-4 text-primary" />
            <span className="font-mono text-xs text-foreground/70">
              total spins
            </span>
          </div>
          <p className="font-mono font-bold text-2xl">{userData.totalSpins}</p>
        </div>

        <div className="bg-card border-4 border-black shadow-[4px_4px_0px_0px_rgba(45,45,45,1)] p-3">
          <div className="flex items-center gap-2 mb-1">
            <RotateCcw className="h-4 w-4 text-secondary" />
            <span className="font-mono text-xs text-foreground/70">rerolls</span>
          </div>
          <p className="font-mono font-bold text-2xl">{userData.rerolls}</p>
        </div>

        <div className="bg-card border-4 border-black shadow-[4px_4px_0px_0px_rgba(45,45,45,1)] p-3">
          <div className="flex items-center gap-2 mb-1">
            <Heart className="h-4 w-4 text-accent fill-current" />
            <span className="font-mono text-xs text-foreground/70">
              tips sent
            </span>
          </div>
          <p className="font-mono font-bold text-2xl">{userData.tipsGiven}</p>
        </div>

        <div className="bg-card border-4 border-black shadow-[4px_4px_0px_0px_rgba(45,45,45,1)] p-3">
          <div className="flex items-center gap-2 mb-1">
            <Heart className="h-4 w-4 text-destructive fill-current" />
            <span className="font-mono text-xs text-foreground/70">
              tips got
            </span>
          </div>
          <p className="font-mono font-bold text-2xl">{userData.tipsReceived}</p>
        </div>
      </div>

      {/* Referral Section */}
      <div className="bg-secondary border-4 border-black shadow-[4px_4px_0px_0px_rgba(45,45,45,1)] p-4 mb-4">
        <h3 className="font-mono font-bold text-base mb-2">
          REFERRAL CODE
        </h3>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 bg-card border-2 border-black px-3 py-2 font-mono font-bold">
            {userData.referralCode}
          </div>
          <button
            onClick={() => handleCopy(userData.referralCode)}
            className="p-2 bg-card border-2 border-black active:bg-muted"
          >
            {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm text-secondary-foreground/70">
            earnings
          </span>
          <span className="font-mono font-bold text-lg">${userData.referralEarnings.toFixed(2)} USDC</span>
        </div>
      </div>

      {/* Help Link */}
      <button
        onClick={handleOpenHelp}
        className="w-full flex items-center justify-between bg-muted border-4 border-black shadow-[4px_4px_0px_0px_rgba(45,45,45,1)] p-4 active:shadow-[2px_2px_0px_0px_rgba(45,45,45,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all duration-75"
      >
        <div className="flex items-center gap-3">
          <HelpCircle className="h-5 w-5" />
          <span className="font-mono font-bold">
            help & faq
          </span>
        </div>
        <ExternalLink className="h-4 w-4" />
      </button>
    </div>
  )
}
