"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Activity, Clock, AlertTriangle, CheckCircle } from "lucide-react"

interface HealthMetric {
  label: string
  value: string | number
  status: "good" | "warning" | "error"
  description?: string
}

interface HealthMonitorProps {
  language?: "id" | "en"
}

export function HealthMonitor({ language = "id" }: HealthMonitorProps) {
  // Mock health data
  const healthMetrics: HealthMetric[] = [
    {
      label: language === "id" ? "Latensi API" : "API Latency",
      value: "45ms",
      status: "good",
      description: language === "id" ? "Rata-rata respons API" : "Average API response time",
    },
    {
      label: language === "id" ? "Tingkat Error" : "Error Rate",
      value: "0.2%",
      status: "good",
      description: language === "id" ? "Error dalam 24 jam terakhir" : "Errors in last 24 hours",
    },
    {
      label: language === "id" ? "Uptime" : "Uptime",
      value: "99.9%",
      status: "good",
      description: language === "id" ? "Ketersediaan sistem" : "System availability",
    },
    {
      label: language === "id" ? "Cron Jobs" : "Cron Jobs",
      value: language === "id" ? "Aktif" : "Active",
      status: "good",
      description: language === "id" ? "Tugas terjadwal berjalan normal" : "Scheduled tasks running normally",
    },
  ]

  const cronJobs = [
    {
      name: language === "id" ? "Reset Spin Harian" : "Daily Spin Reset",
      lastRun: "2024-01-15T00:00:00Z",
      nextRun: "2024-01-16T00:00:00Z",
      status: "success" as const,
    },
    {
      name: language === "id" ? "Pembersihan Cache" : "Cache Cleanup",
      lastRun: "2024-01-15T12:00:00Z",
      nextRun: "2024-01-15T18:00:00Z",
      status: "success" as const,
    },
    {
      name: language === "id" ? "Sinkronisasi Sponsor" : "Sponsor Sync",
      lastRun: "2024-01-15T14:30:00Z",
      nextRun: "2024-01-15T15:30:00Z",
      status: "warning" as const,
    },
  ]

  const getStatusIcon = (status: "good" | "warning" | "error") => {
    switch (status) {
      case "good":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusBadge = (status: "success" | "warning" | "error") => {
    switch (status) {
      case "success":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 rounded-2xl">
            {language === "id" ? "Berhasil" : "Success"}
          </Badge>
        )
      case "warning":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 rounded-2xl">
            {language === "id" ? "Peringatan" : "Warning"}
          </Badge>
        )
      case "error":
        return (
          <Badge variant="destructive" className="rounded-2xl">
            {language === "id" ? "Error" : "Error"}
          </Badge>
        )
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString(language === "id" ? "id-ID" : "en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <Card className="rounded-2xl border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            {language === "id" ? "Kesehatan Sistem" : "System Health"}
          </CardTitle>
          <CardDescription>
            {language === "id" ? "Status real-time sistem CastRoulette" : "Real-time CastRoulette system status"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {healthMetrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl">
                <div className="flex items-center gap-3">
                  {getStatusIcon(metric.status)}
                  <div>
                    <p className="font-medium">{metric.label}</p>
                    {metric.description && <p className="text-xs text-muted-foreground">{metric.description}</p>}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{metric.value}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cron Jobs Status */}
      <Card className="rounded-2xl border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            {language === "id" ? "Tugas Terjadwal" : "Scheduled Tasks"}
          </CardTitle>
          <CardDescription>
            {language === "id" ? "Status cron jobs dan tugas otomatis" : "Cron jobs and automated tasks status"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cronJobs.map((job, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl">
                <div>
                  <p className="font-medium">{job.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === "id" ? "Terakhir" : "Last"}: {formatTime(job.lastRun)} |{" "}
                    {language === "id" ? "Selanjutnya" : "Next"}: {formatTime(job.nextRun)}
                  </p>
                </div>
                {getStatusBadge(job.status)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card className="rounded-2xl border-border bg-card">
        <CardHeader>
          <CardTitle>{language === "id" ? "Metrik Performa" : "Performance Metrics"}</CardTitle>
          <CardDescription>
            {language === "id" ? "Penggunaan sumber daya sistem" : "System resource usage"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>CPU {language === "id" ? "Penggunaan" : "Usage"}</span>
              <span>23%</span>
            </div>
            <Progress value={23} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{language === "id" ? "Penggunaan Memori" : "Memory Usage"}</span>
              <span>67%</span>
            </div>
            <Progress value={67} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{language === "id" ? "Penggunaan Disk" : "Disk Usage"}</span>
              <span>45%</span>
            </div>
            <Progress value={45} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
