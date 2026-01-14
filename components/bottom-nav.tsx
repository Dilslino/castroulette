"use client"

import { Shuffle, Trophy, User } from "lucide-react"

interface BottomNavProps {
  activeTab: "spin" | "leaderboard" | "profile"
  onTabChange: (tab: "spin" | "leaderboard" | "profile") => void
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    {
      id: "spin" as const,
      label: "Home",
      icon: Shuffle,
    },
    {
      id: "leaderboard" as const,
      label: "Ranks",
      icon: Trophy,
    },
    {
      id: "profile" as const,
      label: "Profile",
      icon: User,
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t-4 border-black z-50 pb-safe">
      <div className="max-w-md mx-auto">
        <div className="grid grid-cols-3">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  flex flex-col items-center justify-center py-3 px-2
                  transition-all duration-75 touch-target
                  ${isActive
                    ? "bg-primary text-primary-foreground border-t-4 border-primary -mt-1"
                    : "text-foreground/70 active:bg-muted"
                  }
                `}
                aria-label={tab.label}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon
                  className={`h-5 w-5 mb-1 ${isActive ? "stroke-[2.5px]" : ""}`}
                />
                <span
                  className={`
                    text-[11px] font-mono font-bold tracking-tight
                    ${isActive ? "text-primary-foreground" : ""}
                  `}
                >
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
