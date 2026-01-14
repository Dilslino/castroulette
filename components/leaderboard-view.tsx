"use client"

import { useState } from "react"
import { Trophy, Shuffle, Heart, Star, Medal } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type LeaderboardTab = "spinners" | "tippers" | "creators"

export function LeaderboardView() {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>("spinners")

  const tabs = [
    { id: "spinners" as const, label: "Top Spinners", icon: Shuffle },
    { id: "tippers" as const, label: "Top Tippers", icon: Heart },
    { id: "creators" as const, label: "Top Creators", icon: Star },
  ]

  const leaderboardData = {
    spinners: [
      { rank: 1, handle: "dwr.eth", avatar: "", value: 1247, label: "spins" },
      { rank: 2, handle: "v", avatar: "", value: 983, label: "spins" },
      { rank: 3, handle: "jessepollak", avatar: "", value: 876, label: "spins" },
      { rank: 4, handle: "ccarella.eth", avatar: "", value: 654, label: "spins" },
      { rank: 5, handle: "ted", avatar: "", value: 543, label: "spins" },
      { rank: 6, handle: "linda", avatar: "", value: 432, label: "spins" },
      { rank: 7, handle: "ace", avatar: "", value: 321, label: "spins" },
      { rank: 8, handle: "cryptopunk", avatar: "", value: 298, label: "spins" },
      { rank: 9, handle: "builder", avatar: "", value: 276, label: "spins" },
      { rank: 10, handle: "defi.eth", avatar: "", value: 254, label: "spins" },
    ],
    tippers: [
      { rank: 1, handle: "whale.eth", avatar: "", value: 156.50, label: "USDC" },
      { rank: 2, handle: "generous", avatar: "", value: 89.20, label: "USDC" },
      { rank: 3, handle: "supporter", avatar: "", value: 67.80, label: "USDC" },
      { rank: 4, handle: "patron.eth", avatar: "", value: 54.30, label: "USDC" },
      { rank: 5, handle: "helper", avatar: "", value: 43.10, label: "USDC" },
      { rank: 6, handle: "kindness", avatar: "", value: 38.90, label: "USDC" },
      { rank: 7, handle: "giver.eth", avatar: "", value: 32.40, label: "USDC" },
      { rank: 8, handle: "backer", avatar: "", value: 28.70, label: "USDC" },
      { rank: 9, handle: "angel", avatar: "", value: 24.50, label: "USDC" },
      { rank: 10, handle: "funder", avatar: "", value: 21.20, label: "USDC" },
    ],
    creators: [
      { rank: 1, handle: "vitalik.eth", avatar: "", value: 234.80, label: "USDC" },
      { rank: 2, handle: "balajis", avatar: "", value: 187.50, label: "USDC" },
      { rank: 3, handle: "punk6529", avatar: "", value: 143.20, label: "USDC" },
      { rank: 4, handle: "cobie", avatar: "", value: 98.70, label: "USDC" },
      { rank: 5, handle: "sassal.eth", avatar: "", value: 76.40, label: "USDC" },
      { rank: 6, handle: "bankless", avatar: "", value: 65.30, label: "USDC" },
      { rank: 7, handle: "polynya", avatar: "", value: 54.80, label: "USDC" },
      { rank: 8, handle: "0xdesigner", avatar: "", value: 43.20, label: "USDC" },
      { rank: 9, handle: "coopahtroopa", avatar: "", value: 38.90, label: "USDC" },
      { rank: 10, handle: "jacopo.eth", avatar: "", value: 32.10, label: "USDC" },
    ],
  }

  const currentData = leaderboardData[activeTab]

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-[#FFD700] text-black"
      case 2:
        return "bg-[#C0C0C0] text-black"
      case 3:
        return "bg-[#CD7F32] text-white"
      default:
        return "bg-muted text-foreground"
    }
  }

  const getRankIcon = (rank: number) => {
    if (rank <= 3) {
      return <Trophy className={`h-4 w-4 ${rank === 1 ? "text-black" : rank === 2 ? "text-black" : "text-white"}`} />
    }
    return <span className="font-mono font-bold text-sm">{rank}</span>
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 pb-3">
        <div className="flex items-center justify-center gap-2 bg-primary px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(45,45,45,1)]">
          <Medal className="h-5 w-5 text-primary-foreground" />
          <h2 className="font-mono font-bold text-lg text-primary-foreground">
            LEADERBOARD
          </h2>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-3 gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex flex-col items-center gap-1 py-2 px-2 border-2 border-black
                  transition-all duration-75 font-mono font-bold text-[10px]
                  ${isActive
                    ? "bg-secondary text-secondary-foreground shadow-[2px_2px_0px_0px_rgba(45,45,45,1)]"
                    : "bg-card text-foreground/70 active:bg-muted"
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-4">
        <div className="space-y-2">
          {currentData.map((item, index) => (
            <div
              key={index}
              className={`
                flex items-center gap-3 p-3 border-2 border-black
                ${item.rank <= 3 ? "shadow-[3px_3px_0px_0px_rgba(45,45,45,1)]" : ""}
                ${item.rank === 1 ? "bg-[#FFF8DC]" : item.rank === 2 ? "bg-[#F5F5F5]" : item.rank === 3 ? "bg-[#FFF0E5]" : "bg-card"}
              `}
            >
              {/* Rank Badge */}
              <div className={`
                w-8 h-8 flex items-center justify-center border-2 border-black
                ${getRankStyle(item.rank)}
              `}>
                {getRankIcon(item.rank)}
              </div>

              {/* Avatar */}
              <Avatar className="h-10 w-10 border-2 border-black">
                <AvatarImage src={item.avatar} alt={item.handle} />
                <AvatarFallback className="bg-accent text-accent-foreground font-bold text-sm">
                  {item.handle.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* Handle */}
              <div className="flex-1 min-w-0">
                <p className="font-mono font-bold text-sm truncate">@{item.handle}</p>
              </div>

              {/* Value */}
              <div className="text-right">
                <p className="font-mono font-bold text-base">
                  {typeof item.value === "number" && item.label === "USDC"
                    ? `$${item.value.toFixed(2)}`
                    : item.value.toLocaleString()
                  }
                </p>
                <p className="font-mono text-[10px] text-foreground/60">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
