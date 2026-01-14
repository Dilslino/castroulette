"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Check, Users } from "lucide-react"
import { useState } from "react"
import { useAppStore } from "@/lib/store"

export function ReferralBox() {
  const { user, language } = useAppStore()
  const [copied, setCopied] = useState(false)

  const referralLink = user.fid ? `https://castroulette.app?ref=${user.fid}` : ""

  const handleCopy = async () => {
    if (referralLink) {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Mock referral stats
  const referralStats = {
    clicks: 47,
    signups: 12,
    paidActions: 8,
    earned: 2.34,
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            {language === "id" ? "Link Referral" : "Referral Link"}
          </CardTitle>
          <CardDescription>
            {language === "id"
              ? "Bagikan link ini untuk mendapatkan komisi dari transaksi pengguna baru"
              : "Share this link to earn commission from new user transactions"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={referralLink}
              readOnly
              className="rounded-2xl font-mono text-sm"
              placeholder={language === "id" ? "Hubungkan wallet untuk mendapatkan link" : "Connect wallet to get link"}
            />
            <Button onClick={handleCopy} disabled={!referralLink} variant="secondary" className="rounded-2xl">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {language === "id"
              ? "Dapatkan 10% komisi dari setiap transaksi re-roll dan tip"
              : "Earn 10% commission from every re-roll and tip transaction"}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-border bg-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{referralStats.clicks}</div>
            <div className="text-sm text-muted-foreground">{language === "id" ? "Klik" : "Clicks"}</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border bg-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{referralStats.signups}</div>
            <div className="text-sm text-muted-foreground">{language === "id" ? "Daftar" : "Signups"}</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border bg-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{referralStats.paidActions}</div>
            <div className="text-sm text-muted-foreground">{language === "id" ? "Transaksi" : "Transactions"}</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border bg-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">${referralStats.earned.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">{language === "id" ? "Komisi" : "Earned"}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
