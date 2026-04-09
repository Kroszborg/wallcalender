"use client"

import { format } from "date-fns"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { Holiday } from "@/lib/holidays"

interface DayCellProps {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  isWeekend: boolean
  isStart: boolean
  isEnd: boolean
  isInRange: boolean
  isHoverRange: boolean
  hasNote: boolean
  holiday: Holiday | undefined
  onClick: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}

export function DayCell({
  date,
  isCurrentMonth,
  isToday,
  isWeekend,
  isStart,
  isEnd,
  isInRange,
  isHoverRange,
  hasNote,
  holiday,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: DayCellProps) {
  const isSelected = isStart || isEnd
  const isSingleDay = isStart && isEnd

  // Show confirmed pill band on start/end/interior cells (not single-day)
  const showStartBand  = isStart && !isEnd
  const showEndBand    = isEnd && !isStart
  const showMiddleBand = isInRange  // interior confirmed cells
  const showHoverBand  = isHoverRange && !isInRange  // hover preview (no pill caps)

  const dayNumber = format(date, "d")

  const cellContent = (
    <div
      className={cn(
        "relative flex h-10 items-center justify-center select-none",
        // Weekend column — very subtle warm tint
        isWeekend && isCurrentMonth && "bg-stone-50/70"
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* ── Confirmed range band — pill-shaped ───────────── */}
      {showStartBand && (
        <div
          className="absolute inset-y-[7px] left-1/2 right-0 rounded-l-full transition-colors duration-200"
          style={{ backgroundColor: "var(--cal-accent-light)" }}
        />
      )}
      {showMiddleBand && (
        <div
          className="absolute inset-y-[7px] left-0 right-0 transition-colors duration-200"
          style={{ backgroundColor: "var(--cal-accent-light)" }}
        />
      )}
      {showEndBand && (
        <div
          className="absolute inset-y-[7px] left-0 right-1/2 rounded-r-full transition-colors duration-200"
          style={{ backgroundColor: "var(--cal-accent-light)" }}
        />
      )}

      {/* ── Hover preview band (flat, dimmer) ────────────── */}
      {showHoverBand && (
        <div
          className="absolute inset-y-[7px] left-0 right-0 transition-colors duration-150"
          style={{ backgroundColor: "var(--cal-accent-light)", opacity: 0.42 }}
        />
      )}

      {/* ── Today pulsing beacon ─────────────────────────── */}
      {isToday && !isSelected && (
        <span
          className="absolute inset-[6px] rounded-full pointer-events-none"
          style={{
            backgroundColor: "var(--cal-accent-light)",
            animation: "cal-beacon 2.6s ease-out infinite",
          }}
        />
      )}

      {/* ── Day circle button ────────────────────────────── */}
      <button
        onClick={onClick}
        aria-label={format(date, "MMMM d, yyyy")}
        className={cn(
          "relative z-10 flex flex-col items-center justify-center rounded-full",
          "text-[13px] font-medium cursor-pointer outline-none select-none",
          "transition-all duration-150",
          "focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-violet-400",
          "size-9",
          "active:scale-95",
          // Unselected hover
          !isSelected && "hover:scale-105",
          !isSelected && isCurrentMonth && "hover:bg-stone-100",
          !isSelected && !isCurrentMonth && "hover:bg-stone-50",
          // Text colours
          !isCurrentMonth && "text-stone-300",
          isCurrentMonth && isWeekend && !isSelected && "text-stone-400",
          isCurrentMonth && !isWeekend && !isSelected && "text-stone-800",
          // Today emphasis
          isToday && !isSelected && "font-bold",
          // Selected endpoint
          isSelected && "text-white font-bold scale-105"
        )}
        style={
          isSelected
            ? {
                backgroundColor: "var(--cal-accent)",
                boxShadow: `0 4px 14px rgba(var(--cal-accent-rgb), 0.42), 0 0 0 3px rgba(var(--cal-accent-rgb), 0.18)`,
              }
            : undefined
        }
      >
        <span className="leading-none">{dayNumber}</span>

        {/* Today accent dot (below number) */}
        {isToday && !isSelected && (
          <span
            className="absolute bottom-[2px] size-[5px] rounded-full"
            style={{ backgroundColor: "var(--cal-accent)" }}
          />
        )}

        {/* Holiday / note indicator dots */}
        {!isToday && (holiday || hasNote) && (
          <span className="absolute bottom-[2px] flex gap-0.5">
            {holiday && (
              <span
                className={cn("block size-1 rounded-full", isSelected ? "bg-white/60" : "bg-rose-400")}
              />
            )}
            {hasNote && (
              <span
                className={cn("block size-1 rounded-full", isSelected ? "bg-white/60" : "")}
                style={!isSelected ? { backgroundColor: "var(--cal-accent-mid)" } : undefined}
              />
            )}
          </span>
        )}
      </button>
    </div>
  )

  if (holiday) {
    return (
      <Tooltip>
        <TooltipTrigger render={<div />}>
          {cellContent}
        </TooltipTrigger>
        <TooltipContent side="top">
          <span>{holiday.name}</span>
        </TooltipContent>
      </Tooltip>
    )
  }

  return cellContent
}
