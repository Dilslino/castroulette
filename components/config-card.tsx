"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Save } from "lucide-react"

interface ConfigCardProps {
  title: string
  description: string
  icon: React.ReactNode
  children: React.ReactNode
  onSave?: () => void
  isSaving?: boolean
}

export function ConfigCard({ title, description, icon, children, onSave, isSaving }: ConfigCardProps) {
  return (
    <Card className="rounded-2xl border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
        {onSave && (
          <Button onClick={onSave} disabled={isSaving} className="rounded-2xl">
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

interface SponsorProbabilityConfigProps {
  value: number
  onChange: (value: number) => void
  language?: "id" | "en"
}

export function SponsorProbabilityConfig({ value, onChange, language = "id" }: SponsorProbabilityConfigProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>{language === "id" ? "Probabilitas Sponsor" : "Sponsor Probability"}</Label>
        <div className="px-3">
          <Slider value={[value]} onValueChange={(val) => onChange(val[0])} max={0.5} min={0} step={0.01} />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0%</span>
          <Badge variant="secondary" className="rounded-2xl">
            {(value * 100).toFixed(1)}%
          </Badge>
          <span>50%</span>
        </div>
        <p className="text-xs text-muted-foreground">
          {language === "id"
            ? "Peluang cast sponsor muncul dalam setiap spin"
            : "Chance of sponsored cast appearing in each spin"}
        </p>
      </div>
    </div>
  )
}

interface FeeConfigProps {
  platformFee: number
  referrerFee: number
  onPlatformFeeChange: (value: number) => void
  onReferrerFeeChange: (value: number) => void
  language?: "id" | "en"
}

export function FeeConfig({
  platformFee,
  referrerFee,
  onPlatformFeeChange,
  onReferrerFeeChange,
  language = "id",
}: FeeConfigProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>{language === "id" ? "Fee Platform" : "Platform Fee"}</Label>
        <div className="px-3">
          <Slider
            value={[platformFee]}
            onValueChange={(val) => onPlatformFeeChange(val[0])}
            max={0.2}
            min={0.05}
            step={0.005}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>5%</span>
          <Badge variant="secondary" className="rounded-2xl">
            {(platformFee * 100).toFixed(1)}%
          </Badge>
          <span>20%</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label>{language === "id" ? "Fee Referrer" : "Referrer Fee"}</Label>
        <div className="px-3">
          <Slider
            value={[referrerFee]}
            onValueChange={(val) => onReferrerFeeChange(val[0])}
            max={0.15}
            min={0.01}
            step={0.005}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1%</span>
          <Badge variant="secondary" className="rounded-2xl">
            {(referrerFee * 100).toFixed(1)}%
          </Badge>
          <span>15%</span>
        </div>
      </div>
    </div>
  )
}

interface SpinLimitConfigProps {
  dailyLimit: number
  onChange: (value: number) => void
  language?: "id" | "en"
}

export function SpinLimitConfig({ dailyLimit, onChange, language = "id" }: SpinLimitConfigProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="daily-limit">{language === "id" ? "Batas Spin Harian" : "Daily Spin Limit"}</Label>
      <Input
        id="daily-limit"
        type="number"
        value={dailyLimit}
        onChange={(e) => onChange(Number.parseInt(e.target.value) || 0)}
        min={1}
        max={20}
        className="rounded-2xl"
      />
      <p className="text-xs text-muted-foreground">
        {language === "id" ? "Jumlah spin gratis per pengguna per hari" : "Number of free spins per user per day"}
      </p>
    </div>
  )
}

interface DenylistConfigProps {
  denylist: string
  onChange: (value: string) => void
  language?: "id" | "en"
}

export function DenylistConfig({ denylist, onChange, language = "id" }: DenylistConfigProps) {
  const denylistArray = denylist.split("\n").filter((item) => item.trim())

  return (
    <div className="space-y-2">
      <Label htmlFor="denylist">{language === "id" ? "Daftar Blokir" : "Denylist"}</Label>
      <Textarea
        id="denylist"
        value={denylist}
        onChange={(e) => onChange(e.target.value)}
        placeholder={
          language === "id"
            ? "Masukkan FID atau handle yang diblokir (satu per baris)"
            : "Enter blocked FIDs or handles (one per line)"
        }
        className="rounded-2xl min-h-32"
      />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {language === "id" ? "Entri diblokir" : "Blocked entries"}: {denylistArray.length}
        </span>
        <span>{language === "id" ? "Satu per baris" : "One per line"}</span>
      </div>
    </div>
  )
}
