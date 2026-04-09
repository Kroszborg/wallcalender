"use client"

import { format } from "date-fns"

const MONTH_GRADIENTS: Record<number, string> = {
  0:  "linear-gradient(135deg, #1e3a5f 0%, #2d5a87 50%, #3d7ab5 100%)",
  1:  "linear-gradient(135deg, #4a1942 0%, #7c2d5e 50%, #a94578 100%)",
  2:  "linear-gradient(135deg, #1a4d2e 0%, #2d7a4a 50%, #4fa36f 100%)",
  3:  "linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #a78bfa 100%)",
  4:  "linear-gradient(135deg, #7c2d12 0%, #c2410c 50%, #f97316 100%)",
  5:  "linear-gradient(135deg, #0c4a6e 0%, #0284c7 50%, #38bdf8 100%)",
  6:  "linear-gradient(135deg, #7c2d12 0%, #ea580c 50%, #fb923c 100%)",
  7:  "linear-gradient(135deg, #a16207 0%, #ca8a04 50%, #facc15 100%)",
  8:  "linear-gradient(135deg, #78350f 0%, #b45309 50%, #f59e0b 100%)",
  9:  "linear-gradient(135deg, #7c2d12 0%, #9a3412 50%, #ea580c 100%)",
  10: "linear-gradient(135deg, #3f3f46 0%, #57534e 50%, #78716c 100%)",
  11: "linear-gradient(135deg, #1e3a5f 0%, #3730a3 50%, #6366f1 100%)",
}

interface HeroImageProps {
  month: Date
}

export function HeroImage({ month }: HeroImageProps) {
  const m = month.getMonth()
  const gradient = MONTH_GRADIENTS[m]
  const daysInMonth = new Date(month.getFullYear(), m + 1, 0).getDate()

  return (
    <div className="flex flex-col">
      {/* ── Spiral binding strip ─────────────────────────── */}
      <div
        className="relative flex items-center justify-around px-5 flex-shrink-0 z-10"
        style={{
          height: "34px",
          background: "linear-gradient(180deg, #e8e4de 0%, #d4cfc7 55%, #c4beb6 100%)",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        {Array.from({ length: 13 }).map((_, i) => (
          <div
            key={i}
            className="relative flex-shrink-0"
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              background: "linear-gradient(180deg, #c4c0b8 0%, #a8a49c 100%)",
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.15), 0 1px 0 rgba(255,255,255,0.4)",
              border: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "2px",
                left: "2px",
                right: "2px",
                bottom: "2px",
                borderRadius: "50%",
                background: "radial-gradient(circle, #d8d4cc 0%, #b0ac94 100%)",
              }}
            />
          </div>
        ))}
      </div>

      {/* ── Hero gradient ────────────────────────────────── */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: "16/5",
          background: gradient,
        }}
      >
        {/* Subtle texture overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Text block — bottom left */}
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-6 pb-4">
          <div>
            <p
              className="text-white/60 uppercase mb-0.5"
              style={{
                fontSize: "9px",
                fontWeight: 600,
                letterSpacing: "0.28em",
              }}
            >
              {format(month, "yyyy")}
            </p>
            <h1
              className="leading-none text-white"
              style={{
                fontSize: "clamp(2rem,6vw,3rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              {format(month, "MMMM")}
            </h1>
          </div>

          {/* Day-count */}
          <div className="text-right">
            <span
              className="text-white/90 font-bold leading-none block"
              style={{ fontSize: "clamp(1.4rem,3vw,1.8rem)", fontWeight: 700 }}
            >
              {daysInMonth}
            </span>
            <span
              className="text-white/50 uppercase tracking-[0.2em] block mt-0.5"
              style={{ fontSize: "7px" }}
            >
              days
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
