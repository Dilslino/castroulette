"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import type { Cast } from "@/lib/types"

interface ResultsTableProps {
  results: Cast[]
  language?: "id" | "en"
}

export function ResultsTable({ results, language = "id" }: ResultsTableProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(language === "id" ? "id-ID" : "en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{language === "id" ? "Belum ada hasil spin" : "No spin results yet"}</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{language === "id" ? "Penulis" : "Author"}</TableHead>
            <TableHead>{language === "id" ? "Cast" : "Cast"}</TableHead>
            <TableHead>{language === "id" ? "Waktu" : "Time"}</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((cast) => (
            <TableRow key={cast.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={cast.author.avatar || "/placeholder.svg"} alt={cast.author.handle} />
                    <AvatarFallback>{cast.author.handle.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">@{cast.author.handle}</span>
                </div>
              </TableCell>
              <TableCell>
                <p className="line-clamp-2 text-sm">{cast.text}</p>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{formatTime(cast.createdAt)}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(`https://warpcast.com/${cast.author.handle}`, "_blank")}
                  className="h-8 w-8 p-0"
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
