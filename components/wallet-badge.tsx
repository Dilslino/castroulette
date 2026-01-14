"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Wallet, Copy, Check } from "lucide-react"
import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { t } from "@/lib/i18n"

export function WalletBadge() {
  const { user, setUser, language } = useAppStore()
  const [copied, setCopied] = useState(false)

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleConnect = () => {
    // Mock wallet connection
    const mockWallet = "0x1234567890abcdef1234567890abcdef12345678"
    const mockFid = 12345
    setUser({ wallet: mockWallet, fid: mockFid, isConnected: true })
  }

  const handleDisconnect = () => {
    setUser({ wallet: undefined, fid: undefined, isConnected: false })
  }

  if (!user.isConnected) {
    return (
      <Button onClick={handleConnect} className="rounded-2xl">
        <Wallet className="h-4 w-4 mr-2" />
        {t("connect", language)}
      </Button>
    )
  }

  return (
    <TooltipProvider>
      <div className="flex items-center gap-3">
        {user.fid && (
          <Badge variant="secondary" className="rounded-2xl">
            FID: {user.fid}
          </Badge>
        )}
        {user.wallet && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="rounded-2xl font-mono">
              {shortenAddress(user.wallet)}
            </Badge>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(user.wallet!)}
                  className="h-8 w-8 p-0 rounded-xl"
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{copied ? t("copied", language) : t("copy", language)}</TooltipContent>
            </Tooltip>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={handleDisconnect} className="rounded-2xl">
          {t("disconnect", language)}
        </Button>
      </div>
    </TooltipProvider>
  )
}
