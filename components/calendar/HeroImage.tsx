"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"

const MONTH_PHOTOS: Record<number, string> = {
  0:  "https://images.unsplash.com/photo-1477601263568-180e2c6d046e?w=1400&auto=format&fit=crop&q=80",
  1:  "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1400&auto=format&fit=crop&q=80",
  2:  "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=1400&auto=format&fit=crop&q=80",
  3:  "https://images.unsplash.com/photo-1490750967868-88df5691aba9?w=1400&auto=format&fit=crop&q=80",
  4:  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&auto=format&fit=crop&q=80",
  5:  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&auto=format&fit=crop&q=80",
  6:  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&auto=format&fit=crop&q=80",
  7:  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&auto=format&fit=crop&q=80",
  8:  "https://images.unsplash.com/photo-1510784722466-f2aa240c4fd9?w=1400&auto=format&fit=crop&q=80",
  9:  "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1400&auto=format&fit=crop&q=80",
  10: "https://images.unsplash.com/photo-1516912481800-3f852c3fb94f?w=1400&auto=format&fit=crop&q=80",
  11: "https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=1400&auto=format&fit=crop&q=80",
}

const MONTH_FALLBACK: Record<number, string> = {
  0: "#1e3a5f", 1: "#4a1942", 2: "#1a4d2e",  3: "#4c1d95",
  4: "#7c2d12", 5: "#0c4a6e", 6: "#7c2d12",  7: "#a16207",
  8: "#78350f", 9: "#7c2d12", 10: "#3f3f46", 11: "#1e3a5f",
}

const MONTH_SUBTITLES: Record<number, string> = {
  0:  "A fresh start awaits",   1:  "Warmth in the cold",
  2:  "New beginnings bloom",   3:  "Life in full color",
  4:  "Golden days ahead",      5:  "Sky-high possibilities",
  6:  "Sun-drenched moments",   7:  "Late summer magic",
  8:  "Harvest season",         9:  "Autumn's embrace",
  10: "Quiet reflection",       11: "Year's end wonder",
}

interface HeroImageProps {
  month: Date
}

export function HeroImage({ month }: HeroImageProps) {
  const m = month.getMonth()
  const photoUrl = MONTH_PHOTOS[m]
  const [loaded, setLoaded] = useState(false)
  const daysInMonth = new Date(month.getFullYear(), m + 1, 0).getDate()

  useEffect(() => {
    setLoaded(false)
  }, [photoUrl])

  return (
    <div className="flex flex-col">
      {/* ── Spiral binding strip ─────────────────────────── */}
      <div
        className="relative flex items-center justify-around px-5 flex-shrink-0 z-10"
        style={{
          height: "40px",
          background: "linear-gradient(180deg, #d4d0c8 0%, #c4c0b8 55%, #b8b2aa 100%)",
          borderBottom: "1px solid rgba(0,0,0,0.1)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        }}
      >
        {/* Top highlight ridge */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "rgba(255,255,255,0.7)" }}
        />
        {Array.from({ length: 13 }).map((_, i) => (
          <div
            key={i}
            className="relative flex-shrink-0"
            style={{
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              background: "radial-gradient(circle at 35% 32%, #e8e4dc 0%, #b0ac94 55%, #8a867c 100%)",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3), 0 1px 2px rgba(255,255,255,0.4)",
              border: "1px solid rgba(0,0,0,0.15)",
            }}
          >
            {/* Inner ring highlight */}
            <div
              style={{
                position: "absolute",
                top: "2px",
                left: "2px",
                right: "2px",
                bottom: "2px",
                borderRadius: "50%",
                background: "radial-gradient(circle at 40% 35%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.1) 50%, transparent 70%)",
              }}
            />
          </div>
        ))}
      </div>

      {/* ── Hero photo ────────────────────────────────────── */}
      <div
        className="group relative w-full overflow-hidden"
        style={{
          aspectRatio: "16/6",
          backgroundColor: MONTH_FALLBACK[m],
        }}
      >
        {/* Photo with subtle zoom on hover */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={photoUrl}
          src={photoUrl}
          alt={format(month, "MMMM yyyy")}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            transform: loaded ? "scale(1.02)" : "scale(1.08)",
            opacity: loaded ? 1 : 0,
            transition: "transform 0.7s ease-out, opacity 0.5s ease-out",
          }}
          onLoad={() => setLoaded(true)}
          loading="eager"
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.65) 100%)",
          }}
        />

        {/* Left vignette for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to right, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 50%)",
          }}
        />

        {/* Subtle film grain texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.12] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23g)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Text block — bottom left */}
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-6 pb-5 md:px-8">
          <div>
            <p
              className="text-white/65 uppercase mb-1"
              style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.24em",
              }}
            >
              {format(month, "yyyy")}
            </p>
            <h1
              className="leading-none text-white"
              style={{
                fontSize: "clamp(2.2rem,7vw,3.5rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                textShadow: "0 2px 20px rgba(0,0,0,0.5)",
              }}
            >
              {format(month, "MMMM")}
            </h1>
            <p
              className="text-white/50 mt-1.5 font-light tracking-wide"
              style={{ fontSize: "11px" }}
            >
              {MONTH_SUBTITLES[m]}
            </p>
          </div>

          {/* Day-count */}
          <div className="text-right pb-0.5">
            <span
              className="text-white/90 font-bold leading-none block"
              style={{ fontSize: "clamp(1.5rem,3.5vw,2rem)", fontWeight: 700 }}
            >
              {daysInMonth}
            </span>
            <span
              className="text-white/45 uppercase tracking-[0.18em] block mt-0.5"
              style={{ fontSize: "8px" }}
            >
              days
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
