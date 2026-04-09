"use client"

import { format, isWeekend as isWeekendDay } from "date-fns"
import { cn } from "@/lib/utils"

interface DayCellProps {
  date: Date
  isCurrentMonth: boolean
  isStart: boolean
  isEnd: boolean
  isInRange: boolean
  isHoverRange: boolean
  onClick: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}

export function DayCell({
  date,
  isCurrentMonth,
  isStart,
  isEnd,
  isInRange,
  isHoverRange,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: DayCellProps) {
  const isSelected = isStart || isEnd
  const isToday = format(new Date(), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
  const isWeekend = isWeekendDay(date)

  const showStartBand = isStart && !isEnd
  const showEndBand = isEnd && !isStart
  const showMiddleBand = isInRange
  const showHoverBand = isHoverRange && !isInRange

  const dayNumber = format(date, "d")

  const cellContent = (
    <div
      className={cn(
        "relative flex h-10 items-center justify-center select-none",
        isWeekend && isCurrentMonth && "bg-stone-50/40"
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* ── Confirmed range band — full height solid ──────── */}
      {showStartBand && (
        <div
          className="absolute inset-y-1 left-1/2 right-0 transition-colors duration-200"
          style={{ backgroundColor: "var(--cal-accent-light)", borderRadius: "6px 0 0 6px" }}
        />
      )}
      {showMiddleBand && (
        <div
          className="absolute inset-y-1 left-0 right-0 transition-colors duration-200"
          style={{ backgroundColor: "var(--cal-accent-light)" }}
        />
      )}
      {showEndBand && (
        <div
          className="absolute inset-y-1 left-0 right-1/2 transition-colors duration-200"
          style={{ backgroundColor: "var(--cal-accent-light)", borderRadius: "0 6px 6px 0" }}
        />
      )}

      {/* ── Hover preview band (lighter) ─────────────────── */}
      {showHoverBand && (
        <div
          className="absolute inset-y-1 left-0 right-0 transition-colors duration-150"
          style={{ backgroundColor: "var(--cal-accent-light)", opacity: 0.5 }}
        />
      )}

      {/* ── Day circle button ────────────────────────────── */}
      <button
        onClick={onClick}
        aria-label={format(date, "MMMM d, yyyy")}
        className={cn(
          "relative z-10 flex items-center justify-center rounded-full",
          "text-[13px] font-medium cursor-pointer outline-none select-none",
          "transition-all duration-150",
          "focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-violet-400",
          "size-8",
          "active:scale-95",
          !isSelected && "hover:bg-stone-100",
          !isCurrentMonth && "text-stone-300",
          isCurrentMonth && "text-stone-700",
          isToday && !isSelected && "font-semibold text-stone-900",
          isSelected && "text-white font-semibold"
        )}
        style={
          isSelected
            ? {
                backgroundColor: "var(--cal-accent)",
              }
            : undefined
        }
      >
        <span>{dayNumber}</span>

        {/* Today accent dot */}
        {isToday && !isSelected && (
          <span
            className="absolute bottom-[3px] size-1 rounded-full"
            style={{ backgroundColor: "var(--cal-accent)" }}
          />
        )}
      </button>
    </div>
  )

  return cellContent
}
