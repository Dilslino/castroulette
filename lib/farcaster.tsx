"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { sdk } from "@farcaster/miniapp-sdk"

interface FarcasterUser {
  fid: number
  username: string
  displayName: string
  pfpUrl: string
  bio?: string
  location?: {
    placeId: string
    description: string
  }
}

interface FarcasterContextValue {
  user: FarcasterUser | null
  isInMiniApp: boolean
  isLoading: boolean
  isReady: boolean
  error: string | null
  // Actions
  openUrl: (url: string) => Promise<void>
  viewProfile: (fid: number) => Promise<void>
  viewCast: (castHash: string) => Promise<void>
  composeCast: (options?: { text?: string; embeds?: string[] }) => Promise<void>
  hapticFeedback: (type: "light" | "medium" | "heavy") => void
}

const FarcasterContext = createContext<FarcasterContextValue | null>(null)

interface FarcasterProviderProps {
  children: ReactNode
}

export function FarcasterProvider({ children }: FarcasterProviderProps) {
  const [user, setUser] = useState<FarcasterUser | null>(null)
  const [isInMiniApp, setIsInMiniApp] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function initializeFarcaster() {
      try {
        // Check if running inside Farcaster miniapp
        const inMiniApp = await sdk.isInMiniApp()
        setIsInMiniApp(inMiniApp)

        if (inMiniApp) {
          // Get user context
          const context = await sdk.context

          if (context?.user) {
            setUser({
              fid: context.user.fid,
              username: context.user.username || "",
              displayName: context.user.displayName || context.user.username || "",
              pfpUrl: context.user.pfpUrl || "",
              bio: context.user.bio,
              location: context.user.location,
            })
          }

          // Signal that the app is ready
          await sdk.actions.ready()
          setIsReady(true)
        } else {
          // Running outside Farcaster - use mock data for development
          setUser({
            fid: 12345,
            username: "testuser",
            displayName: "Test User",
            pfpUrl: "",
            bio: "Testing CastRoulette",
          })
          setIsReady(true)
        }
      } catch (err) {
        console.error("Failed to initialize Farcaster SDK:", err)
        setError(err instanceof Error ? err.message : "Failed to initialize")
        // Still mark as ready so app can function
        setIsReady(true)
      } finally {
        setIsLoading(false)
      }
    }

    initializeFarcaster()
  }, [])

  // Action handlers
  const openUrl = async (url: string) => {
    if (isInMiniApp) {
      await sdk.actions.openUrl(url)
    } else {
      window.open(url, "_blank")
    }
  }

  const viewProfile = async (fid: number) => {
    if (isInMiniApp) {
      await sdk.actions.viewProfile({ fid })
    } else {
      window.open(`https://warpcast.com/~/profiles/${fid}`, "_blank")
    }
  }

  const viewCast = async (castHash: string) => {
    if (isInMiniApp) {
      await sdk.actions.viewCast({ hash: castHash })
    } else {
      window.open(`https://warpcast.com/~/conversations/${castHash}`, "_blank")
    }
  }

  const composeCast = async (options?: { text?: string; embeds?: string[] }) => {
    if (isInMiniApp) {
      await sdk.actions.composeCast({
        text: options?.text,
        embeds: options?.embeds,
      })
    } else {
      const text = encodeURIComponent(options?.text || "")
      window.open(`https://warpcast.com/~/compose?text=${text}`, "_blank")
    }
  }

  const hapticFeedback = (type: "light" | "medium" | "heavy") => {
    if (isInMiniApp) {
      sdk.haptics.impactOccurred(type)
    }
  }

  const value: FarcasterContextValue = {
    user,
    isInMiniApp,
    isLoading,
    isReady,
    error,
    openUrl,
    viewProfile,
    viewCast,
    composeCast,
    hapticFeedback,
  }

  return (
    <FarcasterContext.Provider value={value}>
      {children}
    </FarcasterContext.Provider>
  )
}

export function useFarcaster() {
  const context = useContext(FarcasterContext)
  if (!context) {
    throw new Error("useFarcaster must be used within a FarcasterProvider")
  }
  return context
}
