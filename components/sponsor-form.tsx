"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { TrendingUp, DollarSign, Eye, Clock } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { t } from "@/lib/i18n"

interface SponsorFormProps {
  onSubmit: (data: {
    uri: string
    label: string
    weight: number
    duration: number
    priceUSDC: number
  }) => void
  isSubmitting: boolean
}

export function SponsorForm({ onSubmit, isSubmitting }: SponsorFormProps) {
  const { language } = useAppStore()
  const [formData, setFormData] = useState({
    uri: "",
    label: "",
    weight: 5,
    duration: 24,
  })

  // Pricing calculation
  const baseRate = 0.5 // Base rate per hour per weight point
  const platformFee = 0.1 // 10% platform fee
  const referrerFee = 0.05 // 5% referrer fee

  const calculatePrice = () => {
    const basePrice = baseRate * formData.duration * formData.weight
    const platformCost = basePrice * platformFee
    const referrerCost = basePrice * referrerFee
    const totalPrice = basePrice + platformCost + referrerCost
    return {
      basePrice,
      platformCost,
      referrerCost,
      totalPrice,
    }
  }

  const calculateImpressions = () => {
    // Mock calculation: weight * duration * 50 (base impressions per hour per weight)
    return formData.weight * formData.duration * 50
  }

  const pricing = calculatePrice()
  const expectedImpressions = calculateImpressions()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.uri || !formData.label) return

    onSubmit({
      ...formData,
      priceUSDC: pricing.totalPrice,
    })
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return url.includes("warpcast.com") || url.includes("farcaster")
    } catch {
      return false
    }
  }

  const canSubmit = formData.uri && formData.label && isValidUrl(formData.uri) && !isSubmitting

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form */}
      <div className="lg:col-span-2">
        <Card className="rounded-2xl border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              {language === "id" ? "Buat Kampanye Sponsor" : "Create Sponsor Campaign"}
            </CardTitle>
            <CardDescription>
              {language === "id"
                ? "Promosikan cast Anda untuk mendapatkan visibilitas maksimal"
                : "Promote your cast to get maximum visibility"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="uri">{language === "id" ? "URL Cast" : "Cast URL"}</Label>
                <Input
                  id="uri"
                  value={formData.uri}
                  onChange={(e) => setFormData({ ...formData, uri: e.target.value })}
                  placeholder="https://warpcast.com/username/0x..."
                  className="rounded-2xl"
                />
                <p className="text-xs text-muted-foreground">
                  {language === "id"
                    ? "Masukkan URL cast Warpcast yang ingin dipromosikan"
                    : "Enter the Warpcast cast URL you want to promote"}
                </p>
                {formData.uri && !isValidUrl(formData.uri) && (
                  <p className="text-xs text-destructive">{language === "id" ? "URL tidak valid" : "Invalid URL"}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="label">{language === "id" ? "Label Kampanye" : "Campaign Label"}</Label>
                <Input
                  id="label"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder={language === "id" ? "Nama kampanye Anda" : "Your campaign name"}
                  className="rounded-2xl"
                  maxLength={50}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.label.length}/50 {language === "id" ? "karakter" : "characters"}
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{language === "id" ? "Bobot Prioritas" : "Priority Weight"}</Label>
                  <div className="px-3">
                    <Slider
                      value={[formData.weight]}
                      onValueChange={(value) => setFormData({ ...formData, weight: value[0] })}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{language === "id" ? "Rendah" : "Low"} (1)</span>
                    <Badge variant="secondary" className="rounded-2xl">
                      {formData.weight}/10
                    </Badge>
                    <span>{language === "id" ? "Tinggi" : "High"} (10)</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {language === "id"
                      ? "Bobot yang lebih tinggi meningkatkan peluang cast Anda muncul"
                      : "Higher weight increases the chance your cast will appear"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>{language === "id" ? "Durasi" : "Duration"}</Label>
                  <Select
                    value={formData.duration.toString()}
                    onValueChange={(value) => setFormData({ ...formData, duration: Number.parseInt(value) })}
                  >
                    <SelectTrigger className="rounded-2xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      <SelectItem value="24">24 {language === "id" ? "jam" : "hours"}</SelectItem>
                      <SelectItem value="72">3 {language === "id" ? "hari" : "days"}</SelectItem>
                      <SelectItem value="168">7 {language === "id" ? "hari" : "days"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" disabled={!canSubmit} className="w-full rounded-2xl" size="lg">
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    {language === "id" ? "Memproses..." : "Processing..."}
                  </>
                ) : (
                  <>
                    <DollarSign className="h-4 w-4 mr-2" />
                    {t("buySponsorSlot", language)}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Pricing Summary */}
      <div className="space-y-6">
        <Card className="rounded-2xl border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg">{language === "id" ? "Ringkasan Harga" : "Price Summary"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">{expectedImpressions.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">
                  {language === "id" ? "Perkiraan tayangan" : "Expected impressions"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">
                  {formData.duration} {language === "id" ? "jam" : "hours"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === "id" ? "Durasi aktif" : "Active duration"}
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{language === "id" ? "Biaya dasar" : "Base cost"}</span>
                <span>${pricing.basePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>{language === "id" ? "Fee platform (10%)" : "Platform fee (10%)"}</span>
                <span>${pricing.platformCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>{language === "id" ? "Fee referrer (5%)" : "Referrer fee (5%)"}</span>
                <span>${pricing.referrerCost.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>{language === "id" ? "Total" : "Total"}</span>
                <span>${pricing.totalPrice.toFixed(2)} USDC</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border bg-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                {language === "id" ? "Estimasi CTR" : "Estimated CTR"}
              </p>
              <p className="text-2xl font-bold text-primary">2.3%</p>
              <p className="text-xs text-muted-foreground">
                {language === "id" ? "Berdasarkan kampanye serupa" : "Based on similar campaigns"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
