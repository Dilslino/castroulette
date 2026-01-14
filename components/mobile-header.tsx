"use client"

import { useState } from "react"
import { Menu, X, Wallet, LogOut, Settings, User, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFarcaster } from "@/lib/farcaster"

interface MobileHeaderProps {
  onMenuOpen?: () => void
}

export function MobileHeader({ onMenuOpen }: MobileHeaderProps) {
  const [copied, setCopied] = useState(false)
  const { user, isLoading } = useFarcaster()

  const displayName = user?.username ? `@${user.username}` : "connecting..."
  const isConnected = !!user

  const handleCopyUsername = () => {
    if (user?.username) {
      navigator.clipboard.writeText(user.username)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-card border-b-4 border-black">
      {/* Menu Button */}
      <button
        onClick={onMenuOpen}
        className="p-2 touch-target active:bg-muted border-2 border-black"
        aria-label="open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* User Badge */}
      {isLoading ? (
        <div className="flex items-center gap-2 bg-muted px-3 py-1.5 border-2 border-black">
          <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
          <span className="font-mono font-bold text-sm text-muted-foreground">
            loading...
          </span>
        </div>
      ) : isConnected ? (
        <button
          onClick={handleCopyUsername}
          className="flex items-center gap-2 bg-secondary px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(45,45,45,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition-all duration-75"
        >
          {user?.pfpUrl ? (
            <img
              src={user.pfpUrl}
              alt=""
              className="w-5 h-5 rounded-full border border-black"
            />
          ) : (
            <div className="w-2 h-2 rounded-full bg-green-500" />
          )}
          <span className="font-mono font-bold text-sm text-secondary-foreground">
            {displayName}
          </span>
          {copied ? (
            <Check className="h-3 w-3 text-green-600" />
          ) : (
            <Copy className="h-3 w-3 opacity-50" />
          )}
        </button>
      ) : (
        <Button
          className="h-9 px-4 border-2 border-black shadow-[2px_2px_0px_0px_rgba(45,45,45,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition-all duration-75 bg-primary text-primary-foreground font-mono font-bold text-sm"
        >
          <Wallet className="h-4 w-4 mr-2" />
          Connect
        </Button>
      )}
    </header>
  )
}

interface SideMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const { user, viewProfile } = useFarcaster()

  const displayName = user?.displayName || user?.username || "User"
  const username = user?.username ? `@${user.username}` : ""

  const menuItems = [
    {
      label: "my profile",
      icon: User,
      onClick: () => {
        if (user?.fid) {
          viewProfile(user.fid)
        }
        onClose()
      },
    },
    {
      label: "settings",
      icon: Settings,
      href: "#settings",
    },
  ]

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div className="fixed top-0 left-0 bottom-0 w-72 bg-card border-r-4 border-black z-50 flex flex-col animate-in slide-in-from-left duration-200">
        {/* Menu Header */}
        <div className="flex items-center justify-between p-4 border-b-4 border-black bg-primary">
          <span className="font-mono font-bold text-lg text-primary-foreground">
            MENU
          </span>
          <button
            onClick={onClose}
            className="p-2 active:bg-primary/80 border-2 border-black bg-card"
            aria-label="close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b-2 border-black bg-muted">
          <div className="flex items-center gap-3">
            {user?.pfpUrl ? (
              <img
                src={user.pfpUrl}
                alt=""
                className="w-10 h-10 rounded-full border-2 border-black"
              />
            ) : (
              <div className="w-10 h-10 rounded-full border-2 border-black bg-secondary flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
            )}
            <div>
              <p className="font-mono font-bold text-sm">{displayName}</p>
              <p className="font-mono text-xs text-foreground/60">{username}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon
              if (item.onClick) {
                return (
                  <li key={index}>
                    <button
                      onClick={item.onClick}
                      className="w-full flex items-center gap-3 p-3 border-2 border-black bg-background hover:bg-secondary active:bg-secondary transition-colors font-mono font-bold"
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </button>
                  </li>
                )
              }
              return (
                <li key={index}>
                  <a
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center gap-3 p-3 border-2 border-black bg-background hover:bg-secondary active:bg-secondary transition-colors font-mono font-bold"
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* App Info */}
        <div className="p-4 border-t-2 border-black">
          <p className="font-mono text-xs text-foreground/50 text-center">
            CastRoulette v0.1.0
          </p>
        </div>
      </div>
    </>
  )
}
