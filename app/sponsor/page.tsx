"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SponsorForm } from "@/components/sponsor-form"
import { CampaignsTable } from "@/components/campaigns-table"
import { PaymentModal } from "@/components/payment-modal"
import { WalletBadge } from "@/components/wallet-badge"
import { LanguageSwitcher } from "@/components/language-switcher"
import { StatCard } from "@/components/stat-card"
import { useAppStore } from "@/lib/store"
import { t } from "@/lib/i18n"
import { toast } from "@/hooks/use-toast"
import { ArrowLeft, TrendingUp, Eye, DollarSign, Target, Sparkles } from "lucide-react"
import Link from "next/link"
import type { SponsorSlot } from "@/lib/types"

// Empty sponsor slots - will be populated from API later
const emptySponsorSlots: SponsorSlot[] = []

export default function SponsorPage() {
  const { language } = useAppStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean
    data: any
  }>({
    isOpen: false,
    data: null,
  })

  // Mock campaign stats
  const campaignStats = {
    totalCampaigns: 12,
    totalImpressions: 45678,
    totalSpent: 234.56,
    avgCTR: 2.1,
  }

  const handleSponsorSubmit = async (data: {
    uri: string
    label: string
    weight: number
    duration: number
    priceUSDC: number
  }) => {
    setPaymentModal({
      isOpen: true,
      data,
    })
  }

  const handlePaymentConfirm = async () => {
    if (!paymentModal.data) return

    setIsSubmitting(true)
    try {
      // Mock sponsor creation - will be replaced with real API
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setPaymentModal({ isOpen: false, data: null })

      toast({
        title: t("success", language),
        description: language === "id" ? "Kampanye sponsor berhasil dibuat!" : "Sponsor campaign created successfully!",
      })
    } catch (error) {
      toast({
        title: t("error", language),
        description: language === "id" ? "Gagal membuat kampanye" : "Failed to create campaign",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
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
              <Sparkles className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">{language === "id" ? "Sponsor" : "Sponsor"}</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <WalletBadge />
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {language === "id" ? "Promosikan Cast Anda" : "Promote Your Casts"}
          </h1>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            {language === "id"
              ? "Tingkatkan visibilitas cast Anda dengan sistem sponsor yang efektif dan terukur"
              : "Increase your cast visibility with our effective and measurable sponsor system"}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title={language === "id" ? "Total Kampanye" : "Total Campaigns"}
            value={campaignStats.totalCampaigns}
            subtitle={language === "id" ? "Kampanye dibuat" : "Campaigns created"}
            icon={<Target className="h-6 w-6" />}
          />
          <StatCard
            title={language === "id" ? "Total Tayangan" : "Total Impressions"}
            value={campaignStats.totalImpressions.toLocaleString()}
            subtitle={language === "id" ? "Cast ditampilkan" : "Casts displayed"}
            icon={<Eye className="h-6 w-6" />}
          />
          <StatCard
            title={language === "id" ? "Total Dihabiskan" : "Total Spent"}
            value={`$${campaignStats.totalSpent.toFixed(2)}`}
            subtitle="USDC"
            icon={<DollarSign className="h-6 w-6" />}
          />
          <StatCard
            title={language === "id" ? "Rata-rata CTR" : "Average CTR"}
            value={`${campaignStats.avgCTR}%`}
            subtitle={language === "id" ? "Click-through rate" : "Click-through rate"}
            icon={<TrendingUp className="h-6 w-6" />}
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="create" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 rounded-2xl">
            <TabsTrigger value="create" className="rounded-2xl">
              {language === "id" ? "Buat Kampanye" : "Create Campaign"}
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="rounded-2xl">
              {language === "id" ? "Kampanye Saya" : "My Campaigns"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6">
            <SponsorForm onSubmit={handleSponsorSubmit} isSubmitting={isSubmitting} />
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-6">
            <Card className="rounded-2xl border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  {language === "id" ? "Kampanye Sponsor" : "Sponsor Campaigns"}
                </CardTitle>
                <CardDescription>
                  {language === "id"
                    ? "Kelola dan pantau performa kampanye sponsor Anda"
                    : "Manage and monitor your sponsor campaign performance"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CampaignsTable
                  campaigns={emptySponsorSlots}
                  language={language}
                  onEdit={(campaign) => {
                    toast({
                      title: language === "id" ? "Edit Kampanye" : "Edit Campaign",
                      description: language === "id" ? "Fitur edit akan segera tersedia" : "Edit feature coming soon",
                    })
                  }}
                  onPause={(campaign) => {
                    toast({
                      title: language === "id" ? "Kampanye Dijeda" : "Campaign Paused",
                      description:
                        language === "id"
                          ? `Kampanye "${campaign.label}" telah dijeda`
                          : `Campaign "${campaign.label}" has been paused`,
                    })
                  }}
                  onResume={(campaign) => {
                    toast({
                      title: language === "id" ? "Kampanye Dilanjutkan" : "Campaign Resumed",
                      description:
                        language === "id"
                          ? `Kampanye "${campaign.label}" telah dilanjutkan`
                          : `Campaign "${campaign.label}" has been resumed`,
                    })
                  }}
                  onDelete={(campaign) => {
                    toast({
                      title: language === "id" ? "Kampanye Dihapus" : "Campaign Deleted",
                      description:
                        language === "id"
                          ? `Kampanye "${campaign.label}" telah dihapus`
                          : `Campaign "${campaign.label}" has been deleted`,
                    })
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Payment Modal */}
        <PaymentModal
          isOpen={paymentModal.isOpen}
          onClose={() => setPaymentModal({ isOpen: false, data: null })}
          onConfirm={handlePaymentConfirm}
          isProcessing={isSubmitting}
          type="sponsor"
          amount={paymentModal.data?.priceUSDC || 0}
          description={
            paymentModal.data
              ? language === "id"
                ? `Kampanye sponsor "${paymentModal.data.label}" selama ${paymentModal.data.duration} jam`
                : `Sponsor campaign "${paymentModal.data.label}" for ${paymentModal.data.duration} hours`
              : ""
          }
          language={language}
        />
      </main>
    </div>
  )
}
