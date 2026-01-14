"use client"

import type { Cast } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Repeat2 } from "lucide-react"
import { useFarcaster } from "@/lib/farcaster"

interface CastCardProps {
  cast: Cast
}

export function CastCard({ cast }: CastCardProps) {
  const { viewCast, viewProfile, hapticFeedback } = useFarcaster()

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "now"
    if (diffInHours < 24) return `${diffInHours}h`

    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d`
  }

  const openCast = () => {
    hapticFeedback("light")
    // Use cast ID as hash - in real implementation this would be the actual cast hash
    viewCast(cast.id)
  }

  const openProfile = () => {
    hapticFeedback("light")
    viewProfile(cast.author.fid)
  }

  return (
    <div className="bg-card border-4 border-black shadow-[4px_4px_0px_0px_rgba(45,45,45,1)] p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <button onClick={openProfile} className="flex-shrink-0">
          <Avatar className="h-10 w-10 border-2 border-black">
            <AvatarImage src={cast.author.avatar || "/placeholder.svg"} alt={cast.author.handle} />
            <AvatarFallback className="bg-secondary text-secondary-foreground font-bold text-sm">
              {cast.author.handle.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={openProfile} className="font-mono font-bold text-card-foreground text-sm truncate hover:underline">
              @{cast.author.handle}
            </button>
            <span className="text-card-foreground font-bold text-xs">·</span>
            <span className="text-card-foreground font-mono text-xs font-bold">{formatTime(cast.createdAt)}</span>
          </div>
        </div>
        {cast.sponsored && (
          <Badge variant="secondary" className="text-[10px] border-2 border-black shadow-[2px_2px_0px_0px_rgba(45,45,45,1)] font-bold flex-shrink-0">
            AD
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="mb-3">
        <p
          onClick={openCast}
          className="cursor-pointer text-card-foreground leading-snug text-pretty font-mono font-bold text-base active:underline"
          aria-label="open cast on warpcast"
        >
          {cast.text}
        </p>
        {cast.image && (
          <div
            className="mt-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(45,45,45,1)] cursor-pointer active:shadow-[2px_2px_0px_0px_rgba(45,45,45,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all duration-75 overflow-hidden"
            onClick={openCast}
            role="button"
            aria-label="open cast image"
          >
            <img src={cast.image || "/placeholder.svg"} alt="Cast image" className="w-full h-40 object-cover" />
          </div>
        )}
      </div>

      {/* Metrics */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={openCast}
          className="flex items-center gap-1.5 bg-accent px-3 py-1.5 border-2 border-black active:bg-accent/80 touch-target"
          aria-label="view likes"
        >
          <Heart className="h-4 w-4 fill-current" />
          <span className="font-bold text-sm">{cast.metrics.likes.toLocaleString()}</span>
        </button>
        <button
          type="button"
          onClick={openCast}
          className="flex items-center gap-1.5 bg-secondary px-3 py-1.5 border-2 border-black active:bg-secondary/80 touch-target"
          aria-label="view recasts"
        >
          <Repeat2 className="h-4 w-4" />
          <span className="font-bold text-sm text-secondary-foreground">{cast.metrics.recasts.toLocaleString()}</span>
        </button>
        <button
          type="button"
          onClick={openCast}
          className="flex items-center gap-1.5 bg-primary px-3 py-1.5 border-2 border-black active:bg-primary/80 touch-target"
          aria-label="view replies"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="font-bold text-sm text-primary-foreground">{cast.metrics.replies.toLocaleString()}</span>
        </button>
      </div>

      {/* Sponsor Label */}
      {cast.sponsored && cast.sponsorLabel && (
        <div className="mt-3 pt-3 border-t-2 border-black">
          <p className="font-mono font-bold text-xs text-card-foreground bg-muted px-2 py-1 border-2 border-black inline-block">
            {cast.sponsorLabel}
          </p>
        </div>
      )}
    </div>
  )
}
