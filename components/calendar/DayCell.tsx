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
  const showBand = (isInRange || isHoverRange) && !isSingleDay
  const dayNumber = format(date, "d")

  const cellContent = (
    <div
      className="relative flex h-10 items-center justify-center select-none group/cell"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* ── Range band (confirmed) ──────────────────────── */}
      {isInRange && !isSingleDay && (
        <div
          className="absolute inset-y-[5px] inset-x-0 transition-all duration-150"
          style={{ backgroundColor: "var(--cal-accent-light)" }}
          data-range-part={
            isStart ? "start" : isEnd ? "end" : "middle"
          }
        />
      )}

      {/* ── Range band (hover preview) ──────────────────── */}
      {isHoverRange && !isInRange && !isSingleDay && (
        <div
          className="absolute inset-y-[5px] inset-x-0 transition-all duration-150"
          style={{ backgroundColor: "var(--cal-accent-light)", opacity: 0.55 }}
        />
      )}

      {/* Band end-caps: cut the band flush at start/end edges */}
      {showBand && isStart && !isSingleDay && (
        <div
          className="absolute inset-y-[5px] left-0 w-1/2"
          style={{ backgroundColor: "var(--card, white)" }}
        />
      )}
      {showBand && isEnd && !isSingleDay && (
        <div
          className="absolute inset-y-[5px] right-0 w-1/2"
          style={{ backgroundColor: "var(--card, white)" }}
        />
      )}

      {/* ── Day circle ────────────────────────────────────── */}
      <button
        onClick={onClick}
        aria-label={format(date, "MMMM d, yyyy")}
        className={cn(
          "relative z-10 flex flex-col items-center justify-center rounded-full",
          "text-[13px] font-medium cursor-pointer outline-none select-none",
          "transition-all duration-150",
          "focus-visible:ring-2 focus-visible:ring-offset-1",
          // Size
          "size-9",
          // Not selected — hover states
          !isSelected && isCurrentMonth && [
            "hover:scale-105",
            isWeekend ? "hover:bg-stone-100" : "hover:bg-stone-100",
          ],
          !isSelected && !isCurrentMonth && "hover:bg-stone-50",
          // Out-of-month
          !isCurrentMonth && "text-stone-300",
          // Weekends
          isCurrentMonth && isWeekend && !isSelected && "text-stone-400",
          // Regular days
          isCurrentMonth && !isWeekend && !isSelected && "text-stone-800",
          // Today (not selected) — ring treatment
          isToday && !isSelected && [
            "font-bold",
          ],
          // Selected start/end
          isSelected && [
            "scale-105 font-bold text-white",
            "shadow-[0_4px_14px_rgba(79,70,229,0.45)]",
          ]
        )}
        style={
          isSelected
            ? { backgroundColor: "var(--cal-accent)" }
            : undefined
        }
      >
        <span className="leading-none">{dayNumber}</span>

        {/* Today accent dot */}
        {isToday && !isSelected && (
          <span
            className="absolute bottom-[3px] size-1 rounded-full"
            style={{ backgroundColor: "var(--cal-accent)" }}
          />
        )}

        {/* Holiday / note dots (below number) */}
        {!isToday && (holiday || hasNote) && (
          <span className="absolute bottom-[3px] flex items-center gap-0.5">
            {holiday && (
              <span
                className={cn(
                  "block size-1 rounded-full",
                  isSelected ? "bg-white/70" : "bg-rose-400"
                )}
              />
            )}
            {hasNote && (
              <span
                className={cn(
                  "block size-1 rounded-full",
                  isSelected ? "bg-white/70" : ""
                )}
                style={!isSelected ? { backgroundColor: "var(--cal-accent-mid)" } : undefined}
              />
            )}
          </span>
        )}

        {isToday && (holiday || hasNote) && (
          <span className="absolute bottom-[3px] flex items-center gap-0.5">
            {holiday && (
              <span className="block size-1 rounded-full bg-rose-400" />
            )}
            {hasNote && (
              <span
                className="block size-1 rounded-full"
                style={{ backgroundColor: "var(--cal-accent-mid)" }}
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
