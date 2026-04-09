"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"

const MONTH_PHOTOS: Record<number, string> = {
  0:  "https://images.unsplash.com/photo-1477601263568-180e2c6d046e?w=1400&auto=format&fit=crop&q=82",
  1:  "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1400&auto=format&fit=crop&q=82",
  2:  "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=1400&auto=format&fit=crop&q=82",
  3:  "https://images.unsplash.com/photo-1490750967868-88df5691aba9?w=1400&auto=format&fit=crop&q=82",
  4:  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&auto=format&fit=crop&q=82",
  5:  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&auto=format&fit=crop&q=82",
  6:  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&auto=format&fit=crop&q=82",
  7:  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&auto=format&fit=crop&q=82",
  8:  "https://images.unsplash.com/photo-1510784722466-f2aa240c4fd9?w=1400&auto=format&fit=crop&q=82",
  9:  "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1400&auto=format&fit=crop&q=82",
  10: "https://images.unsplash.com/photo-1516912481800-3f852c3fb94f?w=1400&auto=format&fit=crop&q=82",
  11: "https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=1400&auto=format&fit=crop&q=82",
}

const MONTH_FALLBACK: Record<number, string> = {
  0: "#0f172a", 1: "#3b0a1f", 2: "#052e16",  3: "#2e1065",
  4: "#422006", 5: "#0c4a6e", 6: "#1a2e05",  7: "#451a03",
  8: "#431407", 9: "#411409", 10: "#1c1917", 11: "#0f172a",
}

const MONTH_OVERLAY: Record<number, string> = {
  0:  "linear-gradient(135deg,rgba(15,23,42,.55) 0%,rgba(30,58,138,.28) 100%)",
  1:  "linear-gradient(135deg,rgba(59,10,31,.45) 0%,rgba(190,18,60,.22) 100%)",
  2:  "linear-gradient(135deg,rgba(5,46,22,.45) 0%,rgba(20,83,45,.22) 100%)",
  3:  "linear-gradient(135deg,rgba(46,16,101,.45) 0%,rgba(109,40,217,.22) 100%)",
  4:  "linear-gradient(135deg,rgba(66,32,6,.4) 0%,rgba(180,83,9,.18) 100%)",
  5:  "linear-gradient(135deg,rgba(12,74,110,.4) 0%,rgba(3,105,161,.18) 100%)",
  6:  "linear-gradient(135deg,rgba(26,46,5,.35) 0%,rgba(77,124,15,.15) 100%)",
  7:  "linear-gradient(135deg,rgba(69,26,3,.45) 0%,rgba(202,138,4,.18) 100%)",
  8:  "linear-gradient(135deg,rgba(67,20,7,.5) 0%,rgba(194,65,12,.22) 100%)",
  9:  "linear-gradient(135deg,rgba(65,20,9,.55) 0%,rgba(124,45,18,.22) 100%)",
  10: "linear-gradient(135deg,rgba(28,25,23,.55) 0%,rgba(68,64,60,.28) 100%)",
  11: "linear-gradient(135deg,rgba(15,23,42,.55) 0%,rgba(30,27,75,.28) 100%)",
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

  // Fade out → fade in when month changes
  useEffect(() => {
    setLoaded(false)
  }, [photoUrl])

  const daysInMonth = new Date(month.getFullYear(), m + 1, 0).getDate()

  return (
    <div className="flex flex-col">
      {/* ── Spiral binding strip ─────────────────────────── */}
      <div
        className="relative flex items-center justify-around px-5 flex-shrink-0 z-10"
        style={{
          height: "34px",
          background:
            "linear-gradient(180deg,#ddd8d0 0%,#c8c2ba 55%,#b8b2aa 100%)",
          borderBottom: "1px solid rgba(0,0,0,0.14)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
        }}
      >
        {/* Metal ridge highlight */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "rgba(255,255,255,0.6)" }}
        />
        {Array.from({ length: 13 }).map((_, i) => (
          <div
            key={i}
            className="relative flex-shrink-0"
            style={{
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 38% 35%, #d8d2ca 0%, #9a948c 60%, #7a746c 100%)",
              boxShadow:
                "inset 0 1px 3px rgba(0,0,0,0.35), 0 1px 2px rgba(255,255,255,0.5)",
              border: "1px solid rgba(0,0,0,0.18)",
            }}
          >
            {/* Inner hole highlight */}
            <div
              style={{
                position: "absolute",
                top: "3px",
                left: "3px",
                width: "10px",
                height: "5px",
                borderRadius: "50% 50% 0 0",
                background: "rgba(255,255,255,0.28)",
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
          boxShadow: "inset 0 -24px 40px rgba(0,0,0,0.10)",
        }}
      >
        {/* Photo with zoom-on-hover parallax */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={photoUrl}
          src={photoUrl}
          alt={format(month, "MMMM yyyy")}
          className="absolute inset-0 w-full h-full object-cover
            scale-[1.07] group-hover:scale-[1.02]
            transition-[transform,opacity] duration-700 ease-out"
          style={{ opacity: loaded ? 1 : 0 }}
          onLoad={() => setLoaded(true)}
          loading="eager"
        />

        {/* Month colour tint overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{ background: MONTH_OVERLAY[m] }}
        />

        {/* Bottom-up reading gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom,rgba(0,0,0,0) 0%,rgba(0,0,0,0.06) 45%,rgba(0,0,0,0.62) 100%)",
          }}
        />

        {/* Left vignette for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right,rgba(0,0,0,0.38) 0%,rgba(0,0,0,0) 55%)",
          }}
        />

        {/* Film grain */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.16] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Text block — bottom left */}
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-6 pb-5 md:px-7">
          <div>
            <p
              className="text-white/55 uppercase mb-0.5"
              style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.22em",
              }}
            >
              {format(month, "yyyy")}
            </p>
            <h1
              className="leading-[0.9] text-white"
              style={{
                fontSize: "clamp(2.4rem,7vw,3.8rem)",
                fontWeight: 800,
                letterSpacing: "-0.035em",
                textShadow: "0 2px 18px rgba(0,0,0,0.55)",
              }}
            >
              {format(month, "MMMM")}
            </h1>
            <p
              className="text-white/45 mt-1.5 font-light tracking-wide"
              style={{ fontSize: "11px" }}
            >
              {MONTH_SUBTITLES[m]}
            </p>
          </div>

          {/* Day-count chip */}
          <div className="self-end pb-0.5 text-right">
            <span
              className="text-white/90 font-bold leading-none block"
              style={{ fontSize: "clamp(1.6rem,3.5vw,2.2rem)", fontWeight: 700 }}
            >
              {daysInMonth}
            </span>
            <span
              className="text-white/40 uppercase tracking-[0.18em] block mt-0.5"
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
