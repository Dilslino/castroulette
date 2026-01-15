export interface Cast {
  id: string
  author: {
    fid: number
    handle: string
    avatar: string
  }
  text: string
  image?: string
  uri?: string // optional Warpcast URL for this cast
  metrics: {
    likes: number
    recasts: number
    replies: number
  }
  tags?: string[] // 1-3 topic tags like "Warpcast Update", "Crypto", "Art"
  createdAt: string
  sponsored?: boolean
  sponsorLabel?: string
}

export interface User {
  fid?: number
  wallet?: string
  freeSpinsRemaining: number
  purchasedSpins: number
  isConnected: boolean
}

export interface Payment {
  id: string
  type: "reroll" | "tip" | "sponsor"
  amount: number
  status: "success" | "failed" | "pending"
  txHash?: string
  date: string
  description: string
}

export interface SponsorSlot {
  id: string
  uri: string
  label: string
  weight: number
  duration: number
  status: "active" | "upcoming" | "expired"
  impressions: number
  ctr: number
  createdAt: string
  expiresAt: string
}

export interface AppState {
  user: User
  currentCast: Cast | null
  payments: Payment[]
  referralFid?: number
  language: "id" | "en"
}
