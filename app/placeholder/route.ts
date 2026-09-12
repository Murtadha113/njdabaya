import type { NextRequest } from "next/server"

const palette = [
  ["#e8dfd0", "#d8cbb5"],
  ["#efe8db", "#e0d3ba"],
  ["#e3d9c6", "#c9b896"],
  ["#161512", "#2a2823"],
]

function hashSeed(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const seed = searchParams.get("seed") ?? "abaya"
  const w = Number(searchParams.get("w") ?? 800)
  const h = Number(searchParams.get("h") ?? 1000)
  const label = searchParams.get("label") ?? ""

  const hash = hashSeed(seed)
  const [from, to] = palette[hash % palette.length]
  const isDark = from === "#161512"
  const textColor = isDark ? "#e8dfd0" : "#8a7a5c"

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${from}" />
        <stop offset="100%" stop-color="${to}" />
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#g)" />
    <circle cx="${w * 0.5}" cy="${h * 0.42}" r="${Math.min(w, h) * 0.14}" fill="${textColor}" fill-opacity="0.18" />
    <path d="M ${w * 0.5} ${h * 0.3} C ${w * 0.32} ${h * 0.45}, ${w * 0.3} ${h * 0.75}, ${w * 0.34} ${h * 0.95} L ${w * 0.66} ${h * 0.95} C ${w * 0.7} ${h * 0.75}, ${w * 0.68} ${h * 0.45}, ${w * 0.5} ${h * 0.3} Z" fill="${textColor}" fill-opacity="0.15" />
    ${
      label
        ? `<text x="50%" y="${h - 28}" text-anchor="middle" font-family="sans-serif" font-size="${Math.max(14, w * 0.032)}" fill="${textColor}" opacity="0.85">${label}</text>`
        : ""
    }
  </svg>`

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
