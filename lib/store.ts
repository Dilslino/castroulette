import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { AppState, Cast, Payment } from "./types"
import { mockCasts } from "./mock-data"

// Daily reward constants
const DAILY_BONUS_SPINS = 3
const DAILY_RESET_HOURS = 24

interface AppStore extends AppState {
  // Actions
  setUser: (user: Partial<AppState["user"]>) => void
  setCurrentCast: (cast: Cast | null) => void
  addPayment: (payment: Payment) => void
  setReferralFid: (fid: number) => void
  setLanguage: (lang: "id" | "en") => void

  // Daily reward
  lastDailyClaimTime: string | null
  claimDailyReward: () => boolean
  canClaimDaily: () => boolean
  getTimeUntilNextClaim: () => { hours: number; minutes: number; seconds: number }

  // Mock API functions (to be replaced with real API calls)
  getRandomCast: (includeSponsored?: boolean) => Promise<Cast>
  spinFree: () => Promise<void>
  rerollPaid: (params: { amountUSDC: number; referrer?: number }) => Promise<Cast>
  tipPaid: (params: { toWallet: string; amountUSDC: number; referrer?: number }) => Promise<void>
  createSponsor: (params: { uri: string; weight: number; duration: number; priceUSDC: number }) => Promise<void>
  getMetrics: () => Promise<{ totalSpins: number; paidRerolls: number; tipsGiven: number; tipsReceived: number }>
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: {
        freeSpinsRemaining: 5,
        purchasedSpins: 0,
        isConnected: false,
      },
      currentCast: null,
      payments: [],
      language: "id",
      seenCastIds: [] as string[],
      lastDailyClaimTime: null,

      // Actions
      setUser: (user) => set((state) => ({ user: { ...state.user, ...user } })),
      setCurrentCast: (cast) => set({ currentCast: cast }),
      addPayment: (payment) => set((state) => ({ payments: [payment, ...state.payments] })),
      setReferralFid: (fid) => set({ referralFid: fid }),
      setLanguage: (lang) => set({ language: lang }),

      // Daily reward functions
      canClaimDaily: () => {
        const { lastDailyClaimTime } = get()
        if (!lastDailyClaimTime) return true

        const lastClaim = new Date(lastDailyClaimTime)
        const now = new Date()
        const hoursSinceLastClaim = (now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60)

        return hoursSinceLastClaim >= DAILY_RESET_HOURS
      },

      claimDailyReward: () => {
        const canClaim = get().canClaimDaily()
        if (!canClaim) return false

        set((state) => ({
          user: {
            ...state.user,
            freeSpinsRemaining: state.user.freeSpinsRemaining + DAILY_BONUS_SPINS,
          },
          lastDailyClaimTime: new Date().toISOString(),
        }))

        return true
      },

      getTimeUntilNextClaim: () => {
        const { lastDailyClaimTime } = get()
        if (!lastDailyClaimTime) return { hours: 0, minutes: 0, seconds: 0 }

        const lastClaim = new Date(lastDailyClaimTime)
        const nextClaim = new Date(lastClaim.getTime() + DAILY_RESET_HOURS * 60 * 60 * 1000)
        const now = new Date()

        const diffMs = Math.max(0, nextClaim.getTime() - now.getTime())
        const hours = Math.floor(diffMs / (1000 * 60 * 60))
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000)

        return { hours, minutes, seconds }
      },

      // Mock API functions
      getRandomCast: async (includeSponsored = true) => {
        await new Promise((resolve) => setTimeout(resolve, 300))

        // Filter by sponsorship and minimum likes
        const pool = (includeSponsored ? mockCasts : mockCasts.filter((c) => !c.sponsored)).filter(
          (c) => c.metrics.likes >= 20,
        )

        // Sort by best: likes desc, then newest
        const sorted = [...pool].sort((a, b) => {
          if (b.metrics.likes !== a.metrics.likes) return b.metrics.likes - a.metrics.likes
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        })

        const { seenCastIds } = get()
        const seen = new Set(seenCastIds)

        // Find the first unseen cast
        let chosen = sorted.find((c) => !seen.has(c.id))

        // If all seen, reset and pick the top again
        if (!chosen) {
          set({ seenCastIds: [] })
          chosen = sorted[0]
        }

        // Mark as seen
        if (chosen && !seen.has(chosen.id)) {
          set((state) => ({ seenCastIds: [...state.seenCastIds, chosen!.id] }))
        }

        // Fallback if somehow no cast available
        return chosen ?? sorted[0] ?? pool[0]
      },

      spinFree: async () => {
        const { user } = get()
        if (user.freeSpinsRemaining <= 0) {
          throw new Error("No free spins remaining")
        }

        set((state) => ({
          user: {
            ...state.user,
            freeSpinsRemaining: state.user.freeSpinsRemaining - 1,
          },
        }))
      },

      rerollPaid: async ({ amountUSDC, referrer }) => {
        // Simulate payment processing
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock payment success (90% success rate)
        if (Math.random() < 0.9) {
          const payment: Payment = {
            id: Date.now().toString(),
            type: "reroll",
            amount: amountUSDC,
            status: "success",
            txHash: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`,
            date: new Date().toISOString(),
            description: "Re-roll untuk cast baru",
          }

          get().addPayment(payment)
          return get().getRandomCast(true)
        } else {
          const payment: Payment = {
            id: Date.now().toString(),
            type: "reroll",
            amount: amountUSDC,
            status: "failed",
            date: new Date().toISOString(),
            description: "Re-roll gagal - insufficient balance",
          }

          get().addPayment(payment)
          throw new Error("Payment failed")
        }
      },

      tipPaid: async ({ toWallet, amountUSDC, referrer }) => {
        // Simulate payment processing
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock payment success (95% success rate)
        if (Math.random() < 0.95) {
          const payment: Payment = {
            id: Date.now().toString(),
            type: "tip",
            amount: amountUSDC,
            status: "success",
            txHash: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`,
            date: new Date().toISOString(),
            description: `Tip ke ${toWallet}`,
          }

          get().addPayment(payment)
        } else {
          throw new Error("Tip payment failed")
        }
      },

      createSponsor: async ({ uri, weight, duration, priceUSDC }) => {
        // Simulate payment processing
        await new Promise((resolve) => setTimeout(resolve, 1500))

        const payment: Payment = {
          id: Date.now().toString(),
          type: "sponsor",
          amount: priceUSDC,
          status: "success",
          txHash: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`,
          date: new Date().toISOString(),
          description: `Slot sponsor ${duration} jam`,
        }

        get().addPayment(payment)
      },

      getMetrics: async () => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300))

        const payments = get().payments
        const totalSpins = 47 // Mock total
        const paidRerolls = payments.filter((p) => p.type === "reroll" && p.status === "success").length
        const tipsGiven = payments.filter((p) => p.type === "tip" && p.status === "success").length
        const tipsReceived = 3 // Mock received tips

        return { totalSpins, paidRerolls, tipsGiven, tipsReceived }
      },
    }),
    {
      name: "castroulette-store",
      partialize: (state) => ({
        user: state.user,
        payments: state.payments,
        language: state.language,
        referralFid: state.referralFid,
        seenCastIds: state.seenCastIds,
        lastDailyClaimTime: state.lastDailyClaimTime,
      }),
    },
  ),
)
