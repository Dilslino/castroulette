"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ConfigCard,
  SponsorProbabilityConfig,
  FeeConfig,
  SpinLimitConfig,
  DenylistConfig,
} from "@/components/config-card"
import { HealthMonitor } from "@/components/health-monitor"
import { LanguageSwitcher } from "@/components/language-switcher"
import { StatCard } from "@/components/stat-card"
import { useAppStore } from "@/lib/store"
import { toast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  Settings,
  DollarSign,
  Shield,
  Activity,
  AlertTriangle,
  Wallet,
  Download,
  TrendingUp,
  Users,
  Eye,
} from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
  const { language } = useAppStore()
  const [isLoading, setIsLoading] = useState(false)

  // Mock admin config state
  const [config, setConfig] = useState({
    sponsorProbability: 0.15,
    platformFee: 0.1,
    referrerFee: 0.05,
    dailySpinLimit: 5,
    denylist: "12345\n67890\nbaduser\nspammer",
  })

  // Mock treasury data
  const treasuryData = {
    balance: 12847.56,
    totalRevenue: 45623.89,
    totalWithdrawn: 32776.33,
    pendingWithdrawals: 0,
  }

  // Mock admin stats
  const adminStats = {
    totalUsers: 3429,
    activeUsers: 1247,
    totalSpins: 12847,
    totalRevenue: 45623.89,
  }

  const handleSaveConfig = async (configType: string) => {
    setIsLoading(true)
    try {
      // Mock save operation
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: language === "id" ? "Konfigurasi Disimpan" : "Configuration Saved",
        description:
          language === "id"
            ? `Pengaturan ${configType} berhasil diperbarui`
            : `${configType} settings updated successfully`,
      })
    } catch (error) {
      toast({
        title: language === "id" ? "Error" : "Error",
        description: language === "id" ? "Gagal menyimpan konfigurasi" : "Failed to save configuration",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleWithdraw = () => {
    toast({
      title: language === "id" ? "Penarikan Treasury" : "Treasury Withdrawal",
      description: language === "id" ? "Fitur penarikan akan segera tersedia" : "Withdrawal feature coming soon",
    })
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
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">{language === "id" ? "Admin Panel" : "Admin Panel"}</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-8">
        {/* Admin Warning */}
        <Alert className="mb-8 rounded-2xl border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {language === "id"
              ? "Panel admin ini hanya untuk demo. Dalam implementasi nyata, akses akan dibatasi dengan autentikasi admin."
              : "This admin panel is for demo purposes only. In real implementation, access would be restricted with admin authentication."}
          </AlertDescription>
        </Alert>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title={language === "id" ? "Total Pengguna" : "Total Users"}
            value={adminStats.totalUsers.toLocaleString()}
            subtitle={language === "id" ? "Terdaftar" : "Registered"}
            icon={<Users className="h-6 w-6" />}
          />
          <StatCard
            title={language === "id" ? "Pengguna Aktif" : "Active Users"}
            value={adminStats.activeUsers.toLocaleString()}
            subtitle={language === "id" ? "30 hari terakhir" : "Last 30 days"}
            icon={<Activity className="h-6 w-6" />}
          />
          <StatCard
            title={language === "id" ? "Total Spin" : "Total Spins"}
            value={adminStats.totalSpins.toLocaleString()}
            subtitle={language === "id" ? "Semua waktu" : "All time"}
            icon={<Eye className="h-6 w-6" />}
          />
          <StatCard
            title={language === "id" ? "Total Revenue" : "Total Revenue"}
            value={`$${adminStats.totalRevenue.toLocaleString()}`}
            subtitle="USDC"
            icon={<TrendingUp className="h-6 w-6" />}
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="config" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 rounded-2xl">
            <TabsTrigger value="config" className="rounded-2xl">
              {language === "id" ? "Konfigurasi" : "Configuration"}
            </TabsTrigger>
            <TabsTrigger value="treasury" className="rounded-2xl">
              Treasury
            </TabsTrigger>
            <TabsTrigger value="health" className="rounded-2xl">
              {language === "id" ? "Kesehatan" : "Health"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="config" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ConfigCard
                title={language === "id" ? "Probabilitas Sponsor" : "Sponsor Probability"}
                description={
                  language === "id"
                    ? "Atur seberapa sering cast sponsor muncul"
                    : "Configure how often sponsored casts appear"
                }
                icon={<TrendingUp className="h-5 w-5 text-primary" />}
                onSave={() => handleSaveConfig("sponsor probability")}
                isSaving={isLoading}
              >
                <SponsorProbabilityConfig
                  value={config.sponsorProbability}
                  onChange={(value) => setConfig({ ...config, sponsorProbability: value })}
                  language={language}
                />
              </ConfigCard>

              <ConfigCard
                title={language === "id" ? "Struktur Fee" : "Fee Structure"}
                description={
                  language === "id" ? "Atur fee platform dan referrer" : "Configure platform and referrer fees"
                }
                icon={<DollarSign className="h-5 w-5 text-primary" />}
                onSave={() => handleSaveConfig("fee structure")}
                isSaving={isLoading}
              >
                <FeeConfig
                  platformFee={config.platformFee}
                  referrerFee={config.referrerFee}
                  onPlatformFeeChange={(value) => setConfig({ ...config, platformFee: value })}
                  onReferrerFeeChange={(value) => setConfig({ ...config, referrerFee: value })}
                  language={language}
                />
              </ConfigCard>

              <ConfigCard
                title={language === "id" ? "Batas Spin" : "Spin Limits"}
                description={language === "id" ? "Atur batas spin gratis harian" : "Configure daily free spin limits"}
                icon={<Settings className="h-5 w-5 text-primary" />}
                onSave={() => handleSaveConfig("spin limits")}
                isSaving={isLoading}
              >
                <SpinLimitConfig
                  dailyLimit={config.dailySpinLimit}
                  onChange={(value) => setConfig({ ...config, dailySpinLimit: value })}
                  language={language}
                />
              </ConfigCard>

              <ConfigCard
                title={language === "id" ? "Daftar Blokir" : "Denylist"}
                description={
                  language === "id" ? "Kelola pengguna dan konten yang diblokir" : "Manage blocked users and content"
                }
                icon={<Shield className="h-5 w-5 text-primary" />}
                onSave={() => handleSaveConfig("denylist")}
                isSaving={isLoading}
              >
                <DenylistConfig
                  denylist={config.denylist}
                  onChange={(value) => setConfig({ ...config, denylist: value })}
                  language={language}
                />
              </ConfigCard>
            </div>
          </TabsContent>

          <TabsContent value="treasury" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="rounded-2xl border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-primary" />
                    {language === "id" ? "Saldo Treasury" : "Treasury Balance"}
                  </CardTitle>
                  <CardDescription>
                    {language === "id" ? "Dana yang tersedia untuk penarikan" : "Available funds for withdrawal"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">${treasuryData.balance.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">USDC</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm">{language === "id" ? "Total Revenue" : "Total Revenue"}</span>
                      <span className="font-mono">${treasuryData.totalRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">{language === "id" ? "Total Ditarik" : "Total Withdrawn"}</span>
                      <span className="font-mono">${treasuryData.totalWithdrawn.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">{language === "id" ? "Pending" : "Pending"}</span>
                      <span className="font-mono">${treasuryData.pendingWithdrawals.toLocaleString()}</span>
                    </div>
                  </div>

                  <Button onClick={handleWithdraw} className="w-full rounded-2xl" size="lg" disabled>
                    <Download className="h-4 w-4 mr-2" />
                    {language === "id" ? "Tarik Dana (Demo)" : "Withdraw Funds (Demo)"}
                  </Button>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-border bg-card">
                <CardHeader>
                  <CardTitle>{language === "id" ? "Riwayat Treasury" : "Treasury History"}</CardTitle>
                  <CardDescription>
                    {language === "id" ? "Transaksi treasury terbaru" : "Recent treasury transactions"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        type: "revenue",
                        amount: 125.5,
                        description: language === "id" ? "Fee sponsor" : "Sponsor fees",
                        date: "2024-01-15",
                      },
                      {
                        type: "revenue",
                        amount: 67.8,
                        description: language === "id" ? "Fee re-roll" : "Re-roll fees",
                        date: "2024-01-15",
                      },
                      {
                        type: "withdrawal",
                        amount: -1000,
                        description: language === "id" ? "Penarikan manual" : "Manual withdrawal",
                        date: "2024-01-14",
                      },
                    ].map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-2xl">
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">{transaction.date}</p>
                        </div>
                        <span className={`font-mono ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                          {transaction.amount > 0 ? "+" : ""}${transaction.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <HealthMonitor language={language} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
