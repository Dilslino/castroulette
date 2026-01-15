import { NextResponse } from "next/server"

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY || ""
const NEYNAR_API_URL = "https://api.neynar.com/v2"

// Minimum likes for a cast to be considered quality
const MIN_LIKES = 10

interface NeynarCast {
  hash: string
  author: {
    fid: number
    username: string
    display_name: string
    pfp_url: string
  }
  text: string
  timestamp: string
  reactions: {
    likes_count: number
    recasts_count: number
  }
  replies: {
    count: number
  }
  embeds?: Array<{
    url?: string
    metadata?: {
      content_type?: string
      image?: {
        url?: string
      }
    }
  }>
}

interface NeynarFeedResponse {
  casts: NeynarCast[]
  next?: {
    cursor?: string
  }
}

// Get random quality casts from Neynar
async function fetchQualityCasts(
  excludeHashes: string[],
  limit: number = 50
): Promise<NeynarCast[]> {
  if (!NEYNAR_API_KEY) {
    throw new Error("NEYNAR_API_KEY not configured")
  }

  const allCasts: NeynarCast[] = []
  let cursor: string | undefined = undefined
  let attempts = 0
  const maxAttempts = 5

  // Fetch multiple pages to get more variety
  while (allCasts.length < limit && attempts < maxAttempts) {
    attempts++

    // Use trending feed for quality discovery
    const url = new URL(`${NEYNAR_API_URL}/farcaster/feed/trending`)
    url.searchParams.set("limit", "100")
    url.searchParams.set("time_window", "24h")
    if (cursor) {
      url.searchParams.set("cursor", cursor)
    }

    const response = await fetch(url.toString(), {
      headers: {
        accept: "application/json",
        api_key: NEYNAR_API_KEY,
      },
      next: { revalidate: 60 }, // Cache for 1 minute
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("Neynar API error:", error)
      throw new Error(`Neynar API error: ${response.status}`)
    }

    const data: NeynarFeedResponse = await response.json()

    // Filter for quality casts
    const qualityCasts = data.casts.filter((cast) => {
      // Must have minimum likes
      if (cast.reactions.likes_count < MIN_LIKES) return false

      // Must not be in excluded list
      if (excludeHashes.includes(cast.hash)) return false

      // Must have actual text content
      if (!cast.text || cast.text.trim().length < 10) return false

      return true
    })

    allCasts.push(...qualityCasts)

    // Get next cursor
    cursor = data.next?.cursor
    if (!cursor) break
  }

  // Shuffle for randomness
  return shuffleArray(allCasts).slice(0, limit)
}

// Also fetch from recent global feed for variety
async function fetchRecentCasts(
  excludeHashes: string[],
  limit: number = 50
): Promise<NeynarCast[]> {
  if (!NEYNAR_API_KEY) {
    throw new Error("NEYNAR_API_KEY not configured")
  }

  const url = new URL(`${NEYNAR_API_URL}/farcaster/feed`)
  url.searchParams.set("feed_type", "filter")
  url.searchParams.set("filter_type", "global_trending")
  url.searchParams.set("limit", "100")

  const response = await fetch(url.toString(), {
    headers: {
      accept: "application/json",
      api_key: NEYNAR_API_KEY,
    },
    next: { revalidate: 60 },
  })

  if (!response.ok) {
    return []
  }

  const data: NeynarFeedResponse = await response.json()

  const qualityCasts = data.casts.filter((cast) => {
    if (cast.reactions.likes_count < MIN_LIKES) return false
    if (excludeHashes.includes(cast.hash)) return false
    if (!cast.text || cast.text.trim().length < 10) return false
    return true
  })

  return shuffleArray(qualityCasts).slice(0, limit)
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function extractImageFromCast(cast: NeynarCast): string | undefined {
  if (!cast.embeds) return undefined

  for (const embed of cast.embeds) {
    if (embed.metadata?.image?.url) {
      return embed.metadata.image.url
    }
    if (embed.url && /\.(jpg|jpeg|png|gif|webp)$/i.test(embed.url)) {
      return embed.url
    }
  }

  return undefined
}

function generateTags(cast: NeynarCast): string[] {
  const tags: string[] = []
  const text = cast.text.toLowerCase()

  // Detect common topics
  if (text.includes("$") || text.includes("crypto") || text.includes("eth") || text.includes("bitcoin")) {
    tags.push("Crypto")
  }
  if (text.includes("art") || text.includes("nft") || text.includes("🎨")) {
    tags.push("Art")
  }
  if (text.includes("dev") || text.includes("code") || text.includes("build")) {
    tags.push("Dev")
  }
  if (text.includes("farcaster") || text.includes("warpcast")) {
    tags.push("Farcaster")
  }
  if (text.includes("meme") || text.includes("lol") || text.includes("😂")) {
    tags.push("Meme")
  }
  if (text.includes("music") || text.includes("🎵") || text.includes("song")) {
    tags.push("Music")
  }
  if (text.includes("gm") || text.includes("good morning")) {
    tags.push("GM")
  }
  if (cast.reactions.likes_count >= 100) {
    tags.push("🔥 Hot")
  }

  // Limit to 3 tags
  return tags.slice(0, 3)
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const excludeHashesParam = searchParams.get("exclude") || ""
    const excludeHashes = excludeHashesParam ? excludeHashesParam.split(",") : []

    // Fetch from both trending and recent feeds
    const [trendingCasts, recentCasts] = await Promise.all([
      fetchQualityCasts(excludeHashes, 30),
      fetchRecentCasts(excludeHashes, 20),
    ])

    // Combine and shuffle
    const allCasts = shuffleArray([...trendingCasts, ...recentCasts])

    // Remove duplicates by hash
    const seen = new Set<string>()
    const uniqueCasts = allCasts.filter((cast) => {
      if (seen.has(cast.hash)) return false
      seen.add(cast.hash)
      return true
    })

    // Take just one random cast
    const selectedCast = uniqueCasts[0]

    if (!selectedCast) {
      return NextResponse.json(
        { error: "No quality casts available" },
        { status: 404 }
      )
    }

    // Transform to our format
    const cast = {
      id: selectedCast.hash,
      author: {
        fid: selectedCast.author.fid,
        handle: selectedCast.author.username,
        displayName: selectedCast.author.display_name,
        avatar: selectedCast.author.pfp_url,
      },
      text: selectedCast.text,
      image: extractImageFromCast(selectedCast),
      uri: `https://warpcast.com/${selectedCast.author.username}/${selectedCast.hash.slice(0, 10)}`,
      metrics: {
        likes: selectedCast.reactions.likes_count,
        recasts: selectedCast.reactions.recasts_count,
        replies: selectedCast.replies.count,
      },
      tags: generateTags(selectedCast),
      createdAt: selectedCast.timestamp,
    }

    return NextResponse.json({ cast })
  } catch (error) {
    console.error("Error fetching casts:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch casts" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  // Same as GET but allows body for more complex exclude lists
  try {
    const body = await request.json()
    const excludeHashes: string[] = body.excludeHashes || []

    const [trendingCasts, recentCasts] = await Promise.all([
      fetchQualityCasts(excludeHashes, 30),
      fetchRecentCasts(excludeHashes, 20),
    ])

    const allCasts = shuffleArray([...trendingCasts, ...recentCasts])

    const seen = new Set<string>()
    const uniqueCasts = allCasts.filter((cast) => {
      if (seen.has(cast.hash)) return false
      seen.add(cast.hash)
      return true
    })

    const selectedCast = uniqueCasts[0]

    if (!selectedCast) {
      return NextResponse.json(
        { error: "No quality casts available" },
        { status: 404 }
      )
    }

    const cast = {
      id: selectedCast.hash,
      author: {
        fid: selectedCast.author.fid,
        handle: selectedCast.author.username,
        displayName: selectedCast.author.display_name,
        avatar: selectedCast.author.pfp_url,
      },
      text: selectedCast.text,
      image: extractImageFromCast(selectedCast),
      uri: `https://warpcast.com/${selectedCast.author.username}/${selectedCast.hash.slice(0, 10)}`,
      metrics: {
        likes: selectedCast.reactions.likes_count,
        recasts: selectedCast.reactions.recasts_count,
        replies: selectedCast.replies.count,
      },
      tags: generateTags(selectedCast),
      createdAt: selectedCast.timestamp,
    }

    return NextResponse.json({ cast })
  } catch (error) {
    console.error("Error fetching casts:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch casts" },
      { status: 500 }
    )
  }
}
