"use client"

import type { TerritoryPOI } from "@/lib/types"
import { useMemo, useState } from "react"

export function TerritoryMap({ pois }: { pois: TerritoryPOI[] }) {
  const [hover, setHover] = useState<TerritoryPOI | null>(null)

  const bounds = useMemo(() => {
    const lats = pois.map((p) => p.lat)
    const lngs = pois.map((p) => p.lng)
    const padLat = 0.04
    const padLng = 0.04
    return {
      minLat: Math.min(...lats) - padLat,
      maxLat: Math.max(...lats) + padLat,
      minLng: Math.min(...lngs) - padLng,
      maxLng: Math.max(...lngs) + padLng,
    }
  }, [pois])

  const project = (lat: number, lng: number) => {
    const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100
    const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * 100
    return { x, y }
  }

  const colorFor = (cat: string) => {
    if (cat === "mineria") return "var(--accent)"
    if (cat === "templo" || cat === "ritual") return "oklch(0.62 0.13 50)"
    if (cat === "geologico") return "oklch(0.55 0.08 150)"
    if (cat === "escuela") return "oklch(0.55 0.10 220)"
    if (cat === "mercado") return "oklch(0.65 0.13 80)"
    return "oklch(0.50 0.05 60)"
  }

  return (
    <div className="relative w-full aspect-[16/10] border border-border/60 bg-card overflow-hidden">
      {/* Topographic grid */}
      <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="oklch(0.32 0.02 60)" strokeWidth="0.5" />
          </pattern>
          <pattern id="contour" width="120" height="120" patternUnits="userSpaceOnUse">
            <circle cx="60" cy="60" r="50" fill="none" stroke="oklch(0.32 0.02 60)" strokeWidth="0.4" />
            <circle cx="60" cy="60" r="35" fill="none" stroke="oklch(0.32 0.02 60)" strokeWidth="0.4" />
            <circle cx="60" cy="60" r="20" fill="none" stroke="oklch(0.32 0.02 60)" strokeWidth="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#contour)" />
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Compass */}
      <div className="absolute top-4 right-4 font-mono text-[10px] text-muted-foreground tracking-[0.3em]">
        N ↑
      </div>
      <div className="absolute bottom-4 left-4 font-mono text-[10px] text-muted-foreground tracking-wider">
        20.1432°N · 98.6694°W
      </div>

      {/* Points */}
      {pois.map((p) => {
        const { x, y } = project(p.lat, p.lng)
        const isHover = hover?.id === p.id
        return (
          <button
            key={p.id}
            onMouseEnter={() => setHover(p)}
            onMouseLeave={() => setHover(null)}
            className="absolute -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: `${x}%`, top: `${y}%` }}
            aria-label={p.name}
          >
            <span
              className="block h-2.5 w-2.5 rounded-full ring-1 ring-background"
              style={{
                backgroundColor: colorFor(p.category),
                boxShadow: isHover ? `0 0 0 4px ${colorFor(p.category)}33` : undefined,
              }}
            />
            <span
              className={`absolute left-4 top-1/2 -translate-y-1/2 font-mono text-[10px] uppercase tracking-wider whitespace-nowrap transition-opacity ${
                isHover ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              } text-foreground bg-background/90 px-2 py-1 border border-border/60`}
            >
              {p.name}
            </span>
          </button>
        )
      })}

      {/* Hover detail */}
      {hover ? (
        <div className="absolute bottom-4 right-4 max-w-xs bg-background/95 border border-border p-4 backdrop-blur-sm">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-2">
            {hover.category} · {hover.municipality}
          </p>
          <h4 className="font-serif text-sm text-foreground mb-2">{hover.name}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">{hover.description}</p>
        </div>
      ) : null}
    </div>
  )
}
