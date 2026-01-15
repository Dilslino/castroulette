import { NextResponse } from "next/server"

// Public Farcaster Hub endpoints
const HUB_URL = "https://hub.pinata.cloud"

interface HubCast {
  data: {
    type: string
    fid: number
    timestamp: number
    castAddBody?: {
      text: string
      embeds?: Array<{ url?: string }>
      embedsDeprecated?: string[]
      parentCastId?: { fid: number; hash: string }
      parentUrl?: string
    }
  }
  hash: string
}

interface HubReaction {
  data: {
    type: string
    fid: number
    reactionBody: {
      type: number // 1 = like, 2 = recast
      targetCastId: {
        fid: number
        hash: string
      }
    }
  }
}

interface UserData {
  fid: number
  username: string
  displayName: string
  pfp: string
}

// Get user data from hub
async function getUserData(fid: number): Promise<UserData | null> {
  try {
    const [usernameRes, displayRes, pfpRes] = await Promise.all([
      fetch(`${HUB_URL}/v1/userDataByFid?fid=${fid}&user_data_type=6`), // username
      fetch(`${HUB_URL}/v1/userDataByFid?fid=${fid}&user_data_type=2`), // display name
      fetch(`${HUB_URL}/v1/userDataByFid?fid=${fid}&user_data_type=1`), // pfp
    ])

    const username = usernameRes.ok ? await usernameRes.json() : null
    const display = displayRes.ok ? await displayRes.json() : null
    const pfp = pfpRes.ok ? await pfpRes.json() : null

    return {
      fid,
      username: username?.data?.userDataBody?.value || `user${fid}`,
      displayName: display?.data?.userDataBody?.value || `User ${fid}`,
      pfp: pfp?.data?.userDataBody?.value || "",
    }
  } catch {
    return null
  }
}

// Get reaction count for a cast
async function getReactionCount(fid: number, hash: string): Promise<{ likes: number; recasts: number }> {
  try {
    const [likesRes, recastsRes] = await Promise.all([
      fetch(`${HUB_URL}/v1/reactionsByCast?target_fid=${fid}&target_hash=${hash}&reaction_type=1`),
      fetch(`${HUB_URL}/v1/reactionsByCast?target_fid=${fid}&target_hash=${hash}&reaction_type=2`),
    ])

    const likesData = likesRes.ok ? await likesRes.json() : { messages: [] }
    const recastsData = recastsRes.ok ? await recastsRes.json() : { messages: [] }

    return {
      likes: likesData.messages?.length || 0,
      recasts: recastsData.messages?.length || 0,
    }
  } catch {
    return { likes: 0, recasts: 0 }
  }
}

// Get casts from a specific FID
async function getCastsByFid(fid: number, limit: number = 20): Promise<HubCast[]> {
  try {
    const res = await fetch(`${HUB_URL}/v1/castsByFid?fid=${fid}&pageSize=${limit}&reverse=1`)
    if (!res.ok) return []
    const data = await res.json()
    return data.messages || []
  } catch {
    return []
  }
}

// Popular/Active FIDs to sample from (mix of creators)
const SAMPLE_FIDS = [
  3, // dwr (Dan Romero)
  2, // v (Varun)
  5650, // jesse
  194, // cassie
  239, // ted
  1325, // colin
  7143, // 0xdesigner
  12142, // pugson
  8685, // nonlinear
  616, // ace
  2433, // jayme
  1317, // matthew
  3621, // yb
  4085, // giu
  5253, // greg
  6806, // phil
  7963, // adam
  8447, // evan
  9152, // alex
  10636, // mike
  12026, // sophia
  15218, // crypto
  18949, // web3
  20396, // nft
  25178, // builder
  30452, // dev
  35789, // art
  40123, // music
  45678, // gaming
  50234, // meme
]

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function extractImageFromCast(cast: HubCast): string | undefined {
  const embeds = cast.data.castAddBody?.embeds || []

  for (const embed of embeds) {
    if (embed.url && /\.(jpg|jpeg|png|gif|webp)$/i.test(embed.url)) {
      return embed.url
    }
  }

  return undefined
}

function generateTags(text: string, likes: number): string[] {
  const tags: string[] = []
  const lowerText = text.toLowerCase()

  if (lowerText.includes("$") || lowerText.includes("crypto") || lowerText.includes("eth")) {
    tags.push("Crypto")
  }
  if (lowerText.includes("art") || lowerText.includes("nft") || lowerText.includes("🎨")) {
    tags.push("Art")
  }
  if (lowerText.includes("dev") || lowerText.includes("code") || lowerText.includes("build")) {
    tags.push("Dev")
  }
  if (lowerText.includes("farcaster") || lowerText.includes("warpcast")) {
    tags.push("Farcaster")
  }
  if (lowerText.includes("gm") || lowerText.includes("good morning")) {
    tags.push("GM")
  }
  if (likes >= 50) {
    tags.push("🔥 Hot")
  }

  return tags.slice(0, 3)
}

function hashToHex(hash: string): string {
  // If already hex string, return as is
  if (hash.startsWith("0x")) return hash
  // Convert base64 or other format to hex
  try {
    const buffer = Buffer.from(hash, "base64")
    return "0x" + buffer.toString("hex")
  } catch {
    return hash
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const excludeHashesParam = searchParams.get("exclude") || ""
    const excludeHashes = new Set(excludeHashesParam ? excludeHashesParam.split(",") : [])

    // Randomly select FIDs to fetch from
    const selectedFids = shuffleArray(SAMPLE_FIDS).slice(0, 10)

    // Fetch casts from selected FIDs in parallel
    const castsPromises = selectedFids.map((fid) => getCastsByFid(fid, 10))
    const castsResults = await Promise.all(castsPromises)

    // Flatten and filter casts
    const allCasts: HubCast[] = castsResults
      .flat()
      .filter((cast) => {
        // Must have text content
        const text = cast.data.castAddBody?.text || ""
        if (text.length < 10) return false

        // Must not be a reply
        if (cast.data.castAddBody?.parentCastId) return false

        // Must not be already seen
        const hashHex = hashToHex(cast.hash)
        if (excludeHashes.has(hashHex) || excludeHashes.has(cast.hash)) return false

        return true
      })

    if (allCasts.length === 0) {
      return NextResponse.json({ error: "No casts available" }, { status: 404 })
    }

    // Shuffle and pick random casts to check reactions
    const shuffledCasts = shuffleArray(allCasts).slice(0, 20)

    // Get reaction counts for top candidates
    const castsWithReactions = await Promise.all(
      shuffledCasts.map(async (cast) => {
        const reactions = await getReactionCount(cast.data.fid, cast.hash)
        return { cast, reactions }
      })
    )

    // Filter by minimum likes (10)
    const qualityCasts = castsWithReactions.filter((c) => c.reactions.likes >= 10)

    // If no quality casts, take the one with most likes
    let selected = qualityCasts[0]
    if (!selected) {
      selected = castsWithReactions.sort((a, b) => b.reactions.likes - a.reactions.likes)[0]
    }

    if (!selected) {
      return NextResponse.json({ error: "No quality casts found" }, { status: 404 })
    }

    // Get user data
    const userData = await getUserData(selected.cast.data.fid)

    const text = selected.cast.data.castAddBody?.text || ""
    const hashHex = hashToHex(selected.cast.hash)

    const cast = {
      id: hashHex,
      author: {
        fid: selected.cast.data.fid,
        handle: userData?.username || `user${selected.cast.data.fid}`,
        avatar: userData?.pfp || "",
      },
      text,
      image: extractImageFromCast(selected.cast),
      uri: `https://warpcast.com/${userData?.username || "user"}/${hashHex.slice(0, 10)}`,
      metrics: {
        likes: selected.reactions.likes,
        recasts: selected.reactions.recasts,
        replies: 0,
      },
      tags: generateTags(text, selected.reactions.likes),
      createdAt: new Date(selected.cast.data.timestamp * 1000).toISOString(),
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
  try {
    const body = await request.json()
    const excludeHashes = new Set<string>(body.excludeHashes || [])

    // Randomly select FIDs to fetch from
    const selectedFids = shuffleArray(SAMPLE_FIDS).slice(0, 10)

    // Fetch casts from selected FIDs in parallel
    const castsPromises = selectedFids.map((fid) => getCastsByFid(fid, 10))
    const castsResults = await Promise.all(castsPromises)

    // Flatten and filter casts
    const allCasts: HubCast[] = castsResults
      .flat()
      .filter((cast) => {
        const text = cast.data.castAddBody?.text || ""
        if (text.length < 10) return false
        if (cast.data.castAddBody?.parentCastId) return false

        const hashHex = hashToHex(cast.hash)
        if (excludeHashes.has(hashHex) || excludeHashes.has(cast.hash)) return false

        return true
      })

    if (allCasts.length === 0) {
      return NextResponse.json({ error: "No casts available" }, { status: 404 })
    }

    // Shuffle and pick random casts to check reactions
    const shuffledCasts = shuffleArray(allCasts).slice(0, 20)

    // Get reaction counts
    const castsWithReactions = await Promise.all(
      shuffledCasts.map(async (cast) => {
        const reactions = await getReactionCount(cast.data.fid, cast.hash)
        return { cast, reactions }
      })
    )

    // Filter by minimum likes (10)
    const qualityCasts = castsWithReactions.filter((c) => c.reactions.likes >= 10)

    let selected = qualityCasts[0]
    if (!selected) {
      selected = castsWithReactions.sort((a, b) => b.reactions.likes - a.reactions.likes)[0]
    }

    if (!selected) {
      return NextResponse.json({ error: "No quality casts found" }, { status: 404 })
    }

    const userData = await getUserData(selected.cast.data.fid)

    const text = selected.cast.data.castAddBody?.text || ""
    const hashHex = hashToHex(selected.cast.hash)

    const cast = {
      id: hashHex,
      author: {
        fid: selected.cast.data.fid,
        handle: userData?.username || `user${selected.cast.data.fid}`,
        avatar: userData?.pfp || "",
      },
      text,
      image: extractImageFromCast(selected.cast),
      uri: `https://warpcast.com/${userData?.username || "user"}/${hashHex.slice(0, 10)}`,
      metrics: {
        likes: selected.reactions.likes,
        recasts: selected.reactions.recasts,
        replies: 0,
      },
      tags: generateTags(text, selected.reactions.likes),
      createdAt: new Date(selected.cast.data.timestamp * 1000).toISOString(),
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
