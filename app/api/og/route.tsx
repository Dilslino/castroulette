import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const cast = searchParams.get("cast")

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fefce8",
          fontSize: 32,
          fontWeight: 600,
        }}
      >
        <div style={{ marginBottom: 20, color: "#d97706" }}>CastRoulette</div>
        <div style={{ color: "#374151", textAlign: "center", maxWidth: "80%" }}>Temukan cast acak berkualitas</div>
        {cast && (
          <div
            style={{
              marginTop: 40,
              padding: 20,
              backgroundColor: "white",
              borderRadius: 16,
              color: "#374151",
              fontSize: 24,
              maxWidth: "90%",
              textAlign: "center",
            }}
          >
            {cast}
          </div>
        )}
      </div>,
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (e) {
    console.log(`Failed to generate image: ${e}`)
    return new Response(`Failed to generate image`, {
      status: 500,
    })
  }
}
