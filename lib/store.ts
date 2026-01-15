import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { AppState, Cast, Payment } from "./types"

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
  addSeenCast: (castId: string) => void

  // Daily reward
  lastDailyClaimTime: string | null
  claimDailyReward: () => boolean
  canClaimDaily: () => boolean
  getTimeUntilNextClaim: () => { hours: number; minutes: number; seconds: number }

  // API functions
  getRandomCast: () => Promise<Cast>
  spinFree: () => Promise<void>
  purchaseSpins: (amount: number) => void
  tipPaid: (params: { toWallet: string; amountUSDC: number; referrer?: number }) => Promise<void>
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

      // Permanently add a cast to seen list
      addSeenCast: (castId) => {
        const { seenCastIds } = get()
        if (!seenCastIds.includes(castId)) {
          set({ seenCastIds: [...seenCastIds, castId] })
        }
      },

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
            freeSpinsRemaining: (state.user.freeSpinsRemaining || 0) + DAILY_BONUS_SPINS,
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

      // Fetch random cast from Neynar API
      getRandomCast: async () => {
        const { seenCastIds, addSeenCast } = get()

        try {
          // Call our API endpoint with seen cast IDs
          const response = await fetch("/api/casts", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              excludeHashes: seenCastIds,
            }),
          })

          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || "Failed to fetch cast")
          }

          const data = await response.json()
          const cast: Cast = {
            id: data.cast.id,
            author: {
              fid: data.cast.author.fid,
              handle: data.cast.author.handle,
              avatar: data.cast.author.avatar,
            },
            text: data.cast.text,
            image: data.cast.image,
            uri: data.cast.uri,
            metrics: data.cast.metrics,
            tags: data.cast.tags,
            createdAt: data.cast.createdAt,
          }

          // Permanently mark as seen
          addSeenCast(cast.id)

          return cast
        } catch (error) {
          console.error("Error fetching cast:", error)
          throw error
        }
      },

      spinFree: async () => {
        const { user } = get()
        const totalSpins = (user.freeSpinsRemaining || 0) + (user.purchasedSpins || 0)

        if (totalSpins <= 0) {
          throw new Error("No spins remaining")
        }

        // Use free spins first, then purchased
        if ((user.freeSpinsRemaining || 0) > 0) {
          set((state) => ({
            user: {
              ...state.user,
              freeSpinsRemaining: (state.user.freeSpinsRemaining || 0) - 1,
            },
          }))
        } else if ((user.purchasedSpins || 0) > 0) {
          set((state) => ({
            user: {
              ...state.user,
              purchasedSpins: (state.user.purchasedSpins || 0) - 1,
            },
          }))
        }
      },

      purchaseSpins: (amount: number) => {
        set((state) => ({
          user: {
            ...state.user,
            purchasedSpins: (state.user.purchasedSpins || 0) + amount,
          },
        }))
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

      getMetrics: async () => {
        await new Promise((resolve) => setTimeout(resolve, 300))

        const { payments, seenCastIds } = get()
        const totalSpins = seenCastIds.length
        const paidRerolls = payments.filter((p) => p.type === "reroll" && p.status === "success").length
        const tipsGiven = payments.filter((p) => p.type === "tip" && p.status === "success").length
        const tipsReceived = 0

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
