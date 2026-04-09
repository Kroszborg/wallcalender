"use client"

import { format } from "date-fns"

// Curated Unsplash photos per season/month
const MONTH_PHOTOS: Record<number, string> = {
  0:  "https://images.unsplash.com/photo-1547474713-0a9b697ba01a?w=1400&auto=format&fit=crop&q=80", // Jan — winter aurora
  1:  "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1400&auto=format&fit=crop&q=80", // Feb — soft pink
  2:  "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=1400&auto=format&fit=crop&q=80", // Mar — spring green
  3:  "https://images.unsplash.com/photo-1490750967868-88df5691aba9?w=1400&auto=format&fit=crop&q=80", // Apr — cherry blossom
  4:  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&auto=format&fit=crop&q=80", // May — green hills
  5:  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&auto=format&fit=crop&q=80", // Jun — beach
  6:  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&auto=format&fit=crop&q=80", // Jul — mountain
  7:  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&auto=format&fit=crop&q=80", // Aug — golden field
  8:  "https://images.unsplash.com/photo-1510784722466-f2aa240c4fd9?w=1400&auto=format&fit=crop&q=80", // Sep — autumn road
  9:  "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1400&auto=format&fit=crop&q=80", // Oct — harvest
  10: "https://images.unsplash.com/photo-1516912481800-3f852c3fb94f?w=1400&auto=format&fit=crop&q=80", // Nov — foggy forest
  11: "https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=1400&auto=format&fit=crop&q=80", // Dec — winter wonderland
}

// Fallback gradient while photo loads (solid color)
const MONTH_FALLBACK: Record<number, string> = {
  0:  "#0f172a", 1:  "#3b0a1f", 2:  "#052e16", 3:  "#2e1065",
  4:  "#422006", 5:  "#0c4a6e", 6:  "#1a2e05", 7:  "#451a03",
  8:  "#431407", 9:  "#411409", 10: "#1c1917", 11: "#0f172a",
}

// Tinted overlay per month (adds character even if photo doesn't match perfectly)
const MONTH_OVERLAY: Record<number, string> = {
  0:  "linear-gradient(135deg, rgba(15,23,42,0.55) 0%, rgba(30,58,138,0.3) 100%)",
  1:  "linear-gradient(135deg, rgba(59,10,31,0.45) 0%, rgba(190,18,60,0.25) 100%)",
  2:  "linear-gradient(135deg, rgba(5,46,22,0.45) 0%, rgba(20,83,45,0.25) 100%)",
  3:  "linear-gradient(135deg, rgba(46,16,101,0.45) 0%, rgba(109,40,217,0.25) 100%)",
  4:  "linear-gradient(135deg, rgba(66,32,6,0.4) 0%, rgba(180,83,9,0.2) 100%)",
  5:  "linear-gradient(135deg, rgba(12,74,110,0.4) 0%, rgba(3,105,161,0.2) 100%)",
  6:  "linear-gradient(135deg, rgba(26,46,5,0.35) 0%, rgba(77,124,15,0.15) 100%)",
  7:  "linear-gradient(135deg, rgba(69,26,3,0.45) 0%, rgba(202,138,4,0.2) 100%)",
  8:  "linear-gradient(135deg, rgba(67,20,7,0.5) 0%, rgba(194,65,12,0.25) 100%)",
  9:  "linear-gradient(135deg, rgba(65,20,9,0.55) 0%, rgba(124,45,18,0.25) 100%)",
  10: "linear-gradient(135deg, rgba(28,25,23,0.55) 0%, rgba(68,64,60,0.3) 100%)",
  11: "linear-gradient(135deg, rgba(15,23,42,0.55) 0%, rgba(30,27,75,0.3) 100%)",
}

const MONTH_SUBTITLES: Record<number, string> = {
  0:  "A fresh start awaits",     1:  "Warmth in the cold",
  2:  "New beginnings bloom",     3:  "Life in full color",
  4:  "Golden days ahead",        5:  "Sky-high possibilities",
  6:  "Sun-drenched moments",     7:  "Late summer magic",
  8:  "Harvest season",           9:  "Autumn's embrace",
  10: "Quiet reflection",         11: "Year's end wonder",
}

interface HeroImageProps {
  month: Date
}

export function HeroImage({ month }: HeroImageProps) {
  const m = month.getMonth()
  const subtitle = MONTH_SUBTITLES[m]
  const photoUrl = MONTH_PHOTOS[m]
  const fallback = MONTH_FALLBACK[m]
  const overlay = MONTH_OVERLAY[m]

  return (
    <div className="flex flex-col">
      {/* ── Binding strip ────────────────────────────────── */}
      <div
        className="flex items-center justify-center gap-[22px] px-6 flex-shrink-0"
        style={{
          height: "28px",
          background: "linear-gradient(180deg, #e8e4de 0%, #d4cfc8 100%)",
          borderBottom: "1px solid rgba(0,0,0,0.1)",
        }}
      >
        {Array.from({ length: 13 }).map((_, i) => (
          <div
            key={i}
            className="flex-shrink-0"
            style={{
              width: "13px",
              height: "13px",
              borderRadius: "50%",
              background: "linear-gradient(145deg, #c4bfb8 0%, #a09a93 100%)",
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.25), 0 1px 1px rgba(255,255,255,0.6)",
              border: "1px solid rgba(0,0,0,0.12)",
            }}
          />
        ))}
      </div>

      {/* ── Hero photo area ───────────────────────────────── */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: "16 / 5",
          backgroundColor: fallback,
        }}
      >
        {/* Real photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoUrl}
          alt={format(month, "MMMM yyyy")}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />

        {/* Month tint overlay */}
        <div
          className="absolute inset-0"
          style={{ background: overlay }}
        />

        {/* Reading gradient (ensures text is always readable) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.08) 40%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        {/* Grain / film texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.18] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Month name block – bottom-left */}
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-6 pb-4 md:px-8 md:pb-5">
          <div>
            <p
              className="uppercase tracking-[0.2em] text-white/70 mb-0.5"
              style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.18em" }}
            >
              {format(month, "yyyy")}
            </p>
            <h1
              className="leading-none text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 4rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              {format(month, "MMMM")}
            </h1>
            <p
              className="text-white/55 mt-1 font-light tracking-wide"
              style={{ fontSize: "12px" }}
            >
              {subtitle}
            </p>
          </div>

          {/* Day-count badge */}
          <div
            className="self-end pb-0.5 flex flex-col items-end gap-0.5 opacity-80"
          >
            <span
              className="text-white/90 font-bold leading-none"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700 }}
            >
              {new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()}
            </span>
            <span
              className="text-white/50 uppercase tracking-widest"
              style={{ fontSize: "9px" }}
            >
              days
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
