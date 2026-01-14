"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Copy, Check, ExternalLink } from "lucide-react"
import { useState } from "react"
import type { Payment } from "@/lib/types"
import { t } from "@/lib/i18n"

interface PaymentsTableProps {
  payments: Payment[]
  language?: "id" | "en"
}

export function PaymentsTable({ payments, language = "id" }: PaymentsTableProps) {
  const [copiedTx, setCopiedTx] = useState<string | null>(null)

  const handleCopyTx = async (txHash: string) => {
    await navigator.clipboard.writeText(txHash)
    setCopiedTx(txHash)
    setTimeout(() => setCopiedTx(null), 2000)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(language === "id" ? "id-ID" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: Payment["status"]) => {
    switch (status) {
      case "success":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 rounded-2xl">
            {language === "id" ? "Berhasil" : "Success"}
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="destructive" className="rounded-2xl">
            {language === "id" ? "Gagal" : "Failed"}
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary" className="rounded-2xl">
            {language === "id" ? "Pending" : "Pending"}
          </Badge>
        )
    }
  }

  const getTypeLabel = (type: Payment["type"]) => {
    switch (type) {
      case "reroll":
        return "Re-roll"
      case "tip":
        return "Tip"
      case "sponsor":
        return "Sponsor"
    }
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{language === "id" ? "Belum ada transaksi" : "No transactions yet"}</p>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="rounded-2xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{language === "id" ? "Tipe" : "Type"}</TableHead>
              <TableHead>{language === "id" ? "Jumlah" : "Amount"}</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>TX Hash</TableHead>
              <TableHead>{language === "id" ? "Tanggal" : "Date"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{getTypeLabel(payment.type)}</TableCell>
                <TableCell className="font-mono">${payment.amount.toFixed(2)}</TableCell>
                <TableCell>{getStatusBadge(payment.status)}</TableCell>
                <TableCell>
                  {payment.txHash ? (
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {payment.txHash.slice(0, 8)}...{payment.txHash.slice(-4)}
                      </code>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyTx(payment.txHash!)}
                            className="h-6 w-6 p-0"
                          >
                            {copiedTx === payment.txHash ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {copiedTx === payment.txHash ? t("copied", language) : t("copy", language)}
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`https://basescan.org/tx/${payment.txHash}`, "_blank")}
                            className="h-6 w-6 p-0"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{language === "id" ? "Lihat di BaseScan" : "View on BaseScan"}</TooltipContent>
                      </Tooltip>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatDate(payment.date)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  )
}
