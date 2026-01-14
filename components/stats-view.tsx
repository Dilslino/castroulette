"use client"

import { Shuffle, Heart, TrendingUp, Users, Coins, Clock } from "lucide-react"

interface StatsViewProps {
  language?: "id" | "en"
}

export function StatsView({ language = "id" }: StatsViewProps) {
  // Mock stats - replace with real data from your store
  const stats = {
    totalSpins: 47,
    tipsGiven: 3,
    tipsReceived: 0,
    castsDiscovered: 42,
    rerolls: 5,
    joinedDays: 12,
  }

  const statItems = [
    {
      label: language === "id" ? "Total Spin" : "Total Spins",
      value: stats.totalSpins,
      icon: Shuffle,
      color: "bg-primary",
    },
    {
      label: language === "id" ? "Cast Ditemukan" : "Casts Found",
      value: stats.castsDiscovered,
      icon: TrendingUp,
      color: "bg-secondary",
    },
    {
      label: language === "id" ? "Tip Diberikan" : "Tips Given",
      value: stats.tipsGiven,
      icon: Heart,
      color: "bg-accent",
    },
    {
      label: "Re-rolls",
      value: stats.rerolls,
      icon: Coins,
      color: "bg-card",
    },
    {
      label: language === "id" ? "Hari Bergabung" : "Days Joined",
      value: stats.joinedDays,
      icon: Clock,
      color: "bg-muted",
    },
  ]

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4">
      <h2 className="font-mono font-bold text-lg mb-4 text-center">
        {language === "id" ? "STATISTIK KAMU" : "YOUR STATS"}
      </h2>

      <div className="space-y-3">
        {statItems.map((item, index) => {
          const Icon = item.icon
          return (
            <div
              key={index}
              className={`${item.color} border-4 border-black shadow-[4px_4px_0px_0px_rgba(45,45,45,1)] p-4 flex items-center gap-4`}
            >
              <div className="bg-background border-2 border-black p-2">
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="font-mono font-bold text-sm text-foreground/70">{item.label}</p>
                <p className="font-mono font-bold text-2xl">{item.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Referral Section */}
      <div className="mt-6 bg-card border-4 border-black shadow-[4px_4px_0px_0px_rgba(45,45,45,1)] p-4">
        <div className="flex items-center gap-2 mb-3">
          <Users className="h-5 w-5" />
          <h3 className="font-mono font-bold text-base">
            {language === "id" ? "REFERRAL" : "REFERRAL"}
          </h3>
        </div>
        <p className="font-mono text-sm text-foreground/70 mb-3">
          {language === "id"
            ? "Bagikan link kamu dan dapatkan 10% dari setiap transaksi teman!"
            : "Share your link and earn 10% from every friend's transaction!"}
        </p>
        <div className="bg-muted border-2 border-black p-2 font-mono text-xs break-all">
          castroulette.xyz/ref/user123
        </div>
      </div>
    </div>
  )
}
