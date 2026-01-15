import { NextResponse } from "next/server"

// Hub endpoints
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
    }
  }
  hash: string
}

// Fallback sample casts when Hub is unreachable
const FALLBACK_CASTS = [
  {
    id: "0xfallback001",
    author: { fid: 3, handle: "dwr.eth", avatar: "https://i.imgur.com/Y1au2zB.jpg" },
    text: "Building in public is the best way to learn. Ship fast, iterate faster. The community will guide you.",
    metrics: { likes: 142, recasts: 23, replies: 45 },
    tags: ["Dev"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "0xfallback002",
    author: { fid: 2, handle: "v", avatar: "https://i.imgur.com/naZWL9n.gif" },
    text: "Farcaster is growing faster than ever. The future of social is decentralized and permissionless.",
    metrics: { likes: 234, recasts: 56, replies: 89 },
    tags: ["Farcaster"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "0xfallback003",
    author: { fid: 5650, handle: "jessepollak", avatar: "https://i.imgur.com/dBkLxVP.jpg" },
    text: "Base is onchain for everyone. We're building the global onchain economy, one block at a time.",
    metrics: { likes: 567, recasts: 123, replies: 234 },
    tags: ["Crypto", "Dev"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "0xfallback004",
    author: { fid: 194, handle: "cassie", avatar: "https://i.imgur.com/5BItsAn.jpg" },
    text: "Web3 social is not about replacing web2. It's about giving users ownership and control over their data.",
    metrics: { likes: 189, recasts: 34, replies: 67 },
    tags: ["Farcaster"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "0xfallback005",
    author: { fid: 239, handle: "ted", avatar: "https://i.imgur.com/HmJJz7a.jpg" },
    text: "The best founders I know are obsessed with their users. They talk to them daily, not weekly.",
    metrics: { likes: 312, recasts: 67, replies: 123 },
    tags: ["Dev"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "0xfallback006",
    author: { fid: 616, handle: "ace", avatar: "https://i.imgur.com/hJnTaYN.jpg" },
    text: "gm to everyone building something they believe in. Keep shipping, keep learning, keep growing.",
    metrics: { likes: 423, recasts: 89, replies: 156 },
    tags: ["GM"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "0xfallback007",
    author: { fid: 7143, handle: "0xdesigner", avatar: "https://i.imgur.com/kVXU9Km.jpg" },
    text: "Design is not just how it looks, it's how it works. Every pixel should have a purpose.",
    metrics: { likes: 267, recasts: 45, replies: 89 },
    tags: ["Art", "Dev"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "0xfallback008",
    author: { fid: 12142, handle: "pugson", avatar: "https://i.imgur.com/YwxmP1Q.jpg" },
    text: "The best apps feel like magic. They solve your problems before you even know you have them.",
    metrics: { likes: 198, recasts: 34, replies: 56 },
    tags: ["Dev"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "0xfallback009",
    author: { fid: 1325, handle: "colin", avatar: "https://i.imgur.com/5G7ZNDB.jpg" },
    text: "Crypto is still early. We're just getting started. The next 10 years will be incredible.",
    metrics: { likes: 445, recasts: 98, replies: 178 },
    tags: ["Crypto"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "0xfallback010",
    author: { fid: 8685, handle: "nonlinear.eth", avatar: "https://i.imgur.com/4NZ6R2E.jpg" },
    text: "The internet changed everything. Crypto will change everything again. We're living through history.",
    metrics: { likes: 334, recasts: 67, replies: 123 },
    tags: ["Crypto"],
    createdAt: new Date().toISOString(),
  },
]

async function fetchFromHub(fid: number): Promise<HubCast[]> {
  try {
    const res = await fetch(
      `${HUB_URL}/v1/castsByFid?fid=${fid}&pageSize=20&reverse=1`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'CastRoulette/1.0'
        },
        cache: 'no-store',
      }
    )

    if (!res.ok) {
      console.log(`Hub returned ${res.status} for fid ${fid}`)
      return []
    }

    const data = await res.json()
    return data.messages || []
  } catch (e) {
    console.log(`Hub fetch error for fid ${fid}:`, e)
    return []
  }
}

async function getUserData(fid: number): Promise<{ username: string; pfp: string }> {
  try {
    const [userRes, pfpRes] = await Promise.all([
      fetch(`${HUB_URL}/v1/userDataByFid?fid=${fid}&user_data_type=6`, { cache: 'no-store' }),
      fetch(`${HUB_URL}/v1/userDataByFid?fid=${fid}&user_data_type=1`, { cache: 'no-store' }),
    ])

    const userData = userRes.ok ? await userRes.json() : null
    const pfpData = pfpRes.ok ? await pfpRes.json() : null

    return {
      username: userData?.data?.userDataBody?.value || `fid:${fid}`,
      pfp: pfpData?.data?.userDataBody?.value || "",
    }
  } catch {
    return { username: `fid:${fid}`, pfp: "" }
  }
}

const ACTIVE_FIDS = [3, 2, 5650, 194, 239, 616, 1325, 7143, 8685, 12142]
const FARCASTER_EPOCH = 1609459200

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function generateTags(text: string): string[] {
  const tags: string[] = []
  const t = text.toLowerCase()
  if (t.includes("crypto") || t.includes("eth") || t.includes("$")) tags.push("Crypto")
  if (t.includes("art") || t.includes("nft")) tags.push("Art")
  if (t.includes("dev") || t.includes("build") || t.includes("code") || t.includes("ship")) tags.push("Dev")
  if (t.includes("farcaster") || t.includes("warpcast")) tags.push("Farcaster")
  if (t.includes("gm")) tags.push("GM")
  return tags.slice(0, 3)
}

async function fetchRandomCast(excludeHashes: Set<string>): Promise<any> {
  // Try to fetch from Hub first
  const selectedFids = shuffleArray(ACTIVE_FIDS).slice(0, 3)
  console.log("Trying Hub with FIDs:", selectedFids)

  const results = await Promise.all(selectedFids.map(fid => fetchFromHub(fid)))
  const allCasts = results.flat()

  console.log(`Hub returned ${allCasts.length} casts`)

  if (allCasts.length > 0) {
    // Filter and pick a cast
    const validCasts = allCasts.filter(cast => {
      if (!cast.data?.castAddBody?.text) return false
      if (cast.data.castAddBody.text.length < 15) return false
      if (excludeHashes.has(cast.hash)) return false
      return true
    })

    if (validCasts.length > 0) {
      const selected = validCasts[Math.floor(Math.random() * validCasts.length)]
      const userData = await getUserData(selected.data.fid)

      return {
        id: selected.hash,
        author: {
          fid: selected.data.fid,
          handle: userData.username,
          avatar: userData.pfp,
        },
        text: selected.data.castAddBody?.text || "",
        uri: `https://warpcast.com/${userData.username}`,
        metrics: {
          likes: Math.floor(Math.random() * 100) + 10,
          recasts: Math.floor(Math.random() * 20),
          replies: Math.floor(Math.random() * 30),
        },
        tags: generateTags(selected.data.castAddBody?.text || ""),
        createdAt: new Date((FARCASTER_EPOCH + selected.data.timestamp) * 1000).toISOString(),
      }
    }
  }

  // Fallback to sample data
  console.log("Using fallback sample data")
  const available = FALLBACK_CASTS.filter(c => !excludeHashes.has(c.id))

  if (available.length === 0) {
    // Reset - return random from all
    return {
      ...FALLBACK_CASTS[Math.floor(Math.random() * FALLBACK_CASTS.length)],
      id: `0xfallback${Date.now()}`, // New ID so it's not excluded
    }
  }

  return available[Math.floor(Math.random() * available.length)]
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const exclude = searchParams.get("exclude") || ""
    const excludeHashes = new Set(exclude ? exclude.split(",") : [])

    const cast = await fetchRandomCast(excludeHashes)
    return NextResponse.json({ cast })
  } catch (error) {
    console.error("GET Error:", error)
    // Return fallback even on error
    const fallback = FALLBACK_CASTS[Math.floor(Math.random() * FALLBACK_CASTS.length)]
    return NextResponse.json({ cast: { ...fallback, id: `0xerror${Date.now()}` } })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const excludeHashes = new Set<string>(body.excludeHashes || [])

    const cast = await fetchRandomCast(excludeHashes)
    return NextResponse.json({ cast })
  } catch (error) {
    console.error("POST Error:", error)
    // Return fallback even on error
    const fallback = FALLBACK_CASTS[Math.floor(Math.random() * FALLBACK_CASTS.length)]
    return NextResponse.json({ cast: { ...fallback, id: `0xerror${Date.now()}` } })
  }
}
