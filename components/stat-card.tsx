import type React from "react"
import { Card, CardContent } from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
}

export function StatCard({ title, value, subtitle, icon }: StatCardProps) {
  return (
    <Card className="rounded-2xl border-border bg-card">
      <CardContent className="p-6">
        <div className="flex items-center gap-3">
          {icon && <div className="text-primary">{icon}</div>}
          <div className="flex-1">
            <p className="text-2xl font-bold text-card-foreground">{value}</p>
            <p className="text-sm font-medium text-card-foreground">{title}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
