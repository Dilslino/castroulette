"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, ExternalLink, Edit, Pause, Play, Trash2 } from "lucide-react"
import type { SponsorSlot } from "@/lib/types"

interface CampaignsTableProps {
  campaigns: SponsorSlot[]
  language?: "id" | "en"
  onEdit?: (campaign: SponsorSlot) => void
  onPause?: (campaign: SponsorSlot) => void
  onResume?: (campaign: SponsorSlot) => void
  onDelete?: (campaign: SponsorSlot) => void
}

export function CampaignsTable({
  campaigns,
  language = "id",
  onEdit,
  onPause,
  onResume,
  onDelete,
}: CampaignsTableProps) {
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

  const getStatusBadge = (status: SponsorSlot["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 rounded-2xl">
            {language === "id" ? "Aktif" : "Active"}
          </Badge>
        )
      case "upcoming":
        return (
          <Badge variant="secondary" className="rounded-2xl">
            {language === "id" ? "Akan datang" : "Upcoming"}
          </Badge>
        )
      case "expired":
        return (
          <Badge variant="outline" className="rounded-2xl">
            {language === "id" ? "Berakhir" : "Expired"}
          </Badge>
        )
    }
  }

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{language === "id" ? "Belum ada kampanye" : "No campaigns yet"}</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{language === "id" ? "Kampanye" : "Campaign"}</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>{language === "id" ? "Tayangan" : "Impressions"}</TableHead>
            <TableHead>CTR</TableHead>
            <TableHead>{language === "id" ? "Berakhir" : "Expires"}</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.map((campaign) => (
            <TableRow key={campaign.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{campaign.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === "id" ? "Bobot" : "Weight"}: {campaign.weight}/10
                  </p>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(campaign.status)}</TableCell>
              <TableCell className="font-mono">{campaign.impressions.toLocaleString()}</TableCell>
              <TableCell className="font-mono">{campaign.ctr.toFixed(1)}%</TableCell>
              <TableCell className="text-sm text-muted-foreground">{formatDate(campaign.expiresAt)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-2xl">
                    <DropdownMenuItem onClick={() => window.open(campaign.uri, "_blank")} className="rounded-xl">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {language === "id" ? "Lihat cast" : "View cast"}
                    </DropdownMenuItem>
                    {onEdit && (
                      <DropdownMenuItem onClick={() => onEdit(campaign)} className="rounded-xl">
                        <Edit className="h-4 w-4 mr-2" />
                        {language === "id" ? "Edit" : "Edit"}
                      </DropdownMenuItem>
                    )}
                    {campaign.status === "active" && onPause && (
                      <DropdownMenuItem onClick={() => onPause(campaign)} className="rounded-xl">
                        <Pause className="h-4 w-4 mr-2" />
                        {language === "id" ? "Jeda" : "Pause"}
                      </DropdownMenuItem>
                    )}
                    {campaign.status !== "active" && onResume && (
                      <DropdownMenuItem onClick={() => onResume(campaign)} className="rounded-xl">
                        <Play className="h-4 w-4 mr-2" />
                        {language === "id" ? "Lanjutkan" : "Resume"}
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <DropdownMenuItem
                        onClick={() => onDelete(campaign)}
                        className="rounded-xl text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {language === "id" ? "Hapus" : "Delete"}
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
