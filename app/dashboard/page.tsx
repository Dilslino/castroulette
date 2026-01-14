"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { WalletBadge } from "@/components/wallet-badge"
import { PaymentsTable } from "@/components/payments-table"
import { ResultsTable } from "@/components/results-table"
import { ReferralBox } from "@/components/referral-box"
import { LanguageSwitcher } from "@/components/language-switcher"
import { StatCard } from "@/components/stat-card"
import { useAppStore } from "@/lib/store"
import { t } from "@/lib/i18n"
import { mockCasts } from "@/lib/mock-data"
import { BarChart3, DollarSign, Heart, Shuffle, ArrowLeft, Wallet, Save, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user, payments, language, getMetrics } = useAppStore()
  const [metrics, setMetrics] = useState<{
    totalSpins: number
    paidRerolls: number
    tipsGiven: number
    tipsReceived: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [creatorWallet, setCreatorWallet] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  // Mock recent results (last 10 spins)
  const recentResults = mockCasts.slice(0, 5)

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const data = await getMetrics()
        setMetrics(data)
      } catch (error) {
        console.error("Failed to load metrics:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadMetrics()
  }, [getMetrics])

  const handleSaveWallet = async () => {
    setIsSaving(true)
    // Mock save operation
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="rounded-2xl">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {language === "id" ? "Kembali" : "Back"}
                </Button>
              </Link>
              <h1 className="text-xl font-bold">Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-32 rounded-2xl" />
              <LanguageSwitcher />
            </div>
          </div>
        </header>

        <main className="container max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="rounded-2xl">
                <CardContent className="p-6">
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Skeleton className="h-96 w-full rounded-2xl" />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="rounded-2xl">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {language === "id" ? "Kembali" : "Back"}
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <WalletBadge />
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title={t("totalSpins", language)}
            value={metrics?.totalSpins || 0}
            subtitle={language === "id" ? "Cast ditemukan" : "Casts discovered"}
            icon={<Shuffle className="h-6 w-6" />}
          />
          <StatCard
            title={t("paidRerolls", language)}
            value={metrics?.paidRerolls || 0}
            subtitle={`$${((metrics?.paidRerolls || 0) * 0.05).toFixed(2)} ${language === "id" ? "dihabiskan" : "spent"}`}
            icon={<BarChart3 className="h-6 w-6" />}
          />
          <StatCard
            title={t("tipsGiven", language)}
            value={metrics?.tipsGiven || 0}
            subtitle={`$${((metrics?.tipsGiven || 0) * 0.1).toFixed(2)} ${language === "id" ? "diberikan" : "given"}`}
            icon={<Heart className="h-6 w-6" />}
          />
          <StatCard
            title={t("tipsReceived", language)}
            value={metrics?.tipsReceived || 0}
            subtitle={`$${((metrics?.tipsReceived || 0) * 0.1).toFixed(2)} ${language === "id" ? "diterima" : "received"}`}
            icon={<DollarSign className="h-6 w-6" />}
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 rounded-2xl">
            <TabsTrigger value="overview" className="rounded-2xl">
              {t("overview", language)}
            </TabsTrigger>
            <TabsTrigger value="payments" className="rounded-2xl">
              {t("payments", language)}
            </TabsTrigger>
            <TabsTrigger value="wallet" className="rounded-2xl">
              {t("creatorWallet", language)}
            </TabsTrigger>
            <TabsTrigger value="referrals" className="rounded-2xl">
              {t("referrals", language)}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="rounded-2xl border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  {language === "id" ? "Hasil Spin Terakhir" : "Recent Spin Results"}
                </CardTitle>
                <CardDescription>
                  {language === "id" ? "10 cast terakhir yang Anda temukan" : "Last 10 casts you discovered"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResultsTable results={recentResults} language={language} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <Card className="rounded-2xl border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  {language === "id" ? "Riwayat Transaksi" : "Transaction History"}
                </CardTitle>
                <CardDescription>
                  {language === "id"
                    ? "Semua transaksi re-roll, tip, dan sponsor Anda"
                    : "All your re-roll, tip, and sponsor transactions"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PaymentsTable payments={payments} language={language} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wallet" className="space-y-6">
            <Card className="rounded-2xl border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-primary" />
                  {language === "id" ? "Dompet Penerima Tip" : "Tip Receiving Wallet"}
                </CardTitle>
                <CardDescription>
                  {language === "id"
                    ? "Atur alamat dompet untuk menerima tip dari cast Anda"
                    : "Set wallet address to receive tips from your casts"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="wallet">{language === "id" ? "Alamat Dompet" : "Wallet Address"}</Label>
                  <Input
                    id="wallet"
                    value={creatorWallet}
                    onChange={(e) => setCreatorWallet(e.target.value)}
                    placeholder="0x..."
                    className="rounded-2xl font-mono"
                  />
                  <p className="text-xs text-muted-foreground">
                    {language === "id"
                      ? "Masukkan alamat Base wallet untuk menerima tip USDC"
                      : "Enter your Base wallet address to receive USDC tips"}
                  </p>
                </div>
                <Button onClick={handleSaveWallet} disabled={isSaving} className="rounded-2xl">
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      {t("loading", language)}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {t("save", language)}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="referrals" className="space-y-6">
            <ReferralBox />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
