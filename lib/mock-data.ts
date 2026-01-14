import type { Cast, Payment, SponsorSlot } from "./types"

export const mockCasts: Cast[] = [
  {
    id: "1",
    author: {
      fid: 123,
      handle: "vitalik",
      avatar: "/vitalik-ethereum-founder.jpg",
    },
    text: "The future of decentralized social networks is here. Building on Base makes everything so much smoother for developers and users alike.",
    uri: "https://warpcast.com/vitalik/0x1111",
    metrics: {
      likes: 234,
      recasts: 45,
      replies: 12,
    },
    createdAt: "2024-01-15T10:30:00Z",
    sponsored: false,
  },
  {
    id: "2",
    author: {
      fid: 456,
      handle: "dwr",
      avatar: "/dan-romero-farcaster.jpg",
    },
    text: "Just shipped a major update to Warpcast. The new feed algorithm is 10x better at surfacing quality content. Try it out!",
    image: "/warpcast-app-screenshot.jpg",
    uri: "https://warpcast.com/dwr/0x2222",
    metrics: {
      likes: 567,
      recasts: 89,
      replies: 34,
    },
    createdAt: "2024-01-15T09:15:00Z",
    sponsored: true,
    sponsorLabel: "Warpcast Update",
  },
  {
    id: "3",
    author: {
      fid: 789,
      handle: "jessepollak",
      avatar: "/jesse-pollak-base-coinbase.jpg",
    },
    text: "Base is processing over 1M transactions per day now. The onchain economy is thriving! 🔵",
    uri: "https://warpcast.com/jessepollak/0x3333",
    metrics: {
      likes: 445,
      recasts: 78,
      replies: 23,
    },
    createdAt: "2024-01-15T08:45:00Z",
    sponsored: false,
  },
  {
    id: "4",
    author: {
      fid: 321,
      handle: "balajis",
      avatar: "/balaji-srinivasan.jpg",
    },
    text: "The network state concept is becoming reality. Decentralized communities are forming around shared values and economic incentives.",
    uri: "https://warpcast.com/balajis/0x4444",
    metrics: {
      likes: 678,
      recasts: 123,
      replies: 45,
    },
    createdAt: "2024-01-15T07:20:00Z",
    sponsored: false,
  },
  {
    id: "5",
    author: {
      fid: 654,
      handle: "linda",
      avatar: "/linda-xie-crypto.jpg",
    },
    text: "Web3 UX has improved dramatically this year. The gap between web2 and web3 user experience is closing fast.",
    uri: "https://warpcast.com/linda/0x5555",
    metrics: {
      likes: 234,
      recasts: 56,
      replies: 18,
    },
    createdAt: "2024-01-15T06:30:00Z",
    sponsored: false,
  },
]

export const mockPayments: Payment[] = [
  {
    id: "1",
    type: "reroll",
    amount: 0.05,
    status: "success",
    txHash: "0x1234...5678",
    date: "2024-01-15T10:00:00Z",
    description: "Re-roll untuk cast baru",
  },
  {
    id: "2",
    type: "tip",
    amount: 0.1,
    status: "success",
    txHash: "0x2345...6789",
    date: "2024-01-15T09:30:00Z",
    description: "Tip ke @vitalik",
  },
  {
    id: "3",
    type: "sponsor",
    amount: 5.0,
    status: "pending",
    date: "2024-01-15T09:00:00Z",
    description: "Slot sponsor 24 jam",
  },
  {
    id: "4",
    type: "reroll",
    amount: 0.05,
    status: "failed",
    date: "2024-01-15T08:45:00Z",
    description: "Re-roll gagal - insufficient balance",
  },
  {
    id: "5",
    type: "tip",
    amount: 0.1,
    status: "success",
    txHash: "0x3456...7890",
    date: "2024-01-15T08:15:00Z",
    description: "Tip ke @dwr",
  },
]

export const mockSponsorSlots: SponsorSlot[] = [
  {
    id: "1",
    uri: "https://warpcast.com/dwr/0x12345",
    label: "Warpcast Update",
    weight: 8,
    duration: 24,
    status: "active",
    impressions: 1234,
    ctr: 2.3,
    createdAt: "2024-01-15T00:00:00Z",
    expiresAt: "2024-01-16T00:00:00Z",
  },
  {
    id: "2",
    uri: "https://warpcast.com/base/0x67890",
    label: "Base Mainnet",
    weight: 5,
    duration: 72,
    status: "expired",
    impressions: 5678,
    ctr: 1.8,
    createdAt: "2024-01-12T00:00:00Z",
    expiresAt: "2024-01-15T00:00:00Z",
  },
]
