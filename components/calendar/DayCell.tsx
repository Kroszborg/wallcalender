"use client"

import { format, isWeekend as isWeekendDay } from "date-fns"
import { cn } from "@/lib/utils"
import { getHoliday } from "@/lib/holidays"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
  const isSingleDate = isStart && isEnd
  const holiday = getHoliday(date)

  // Only show bands for multi-date ranges (not single date)
  const showStartBand = isStart && !isEnd
  const showEndBand = isEnd && !isStart
  const showMiddleBand = isInRange && !isSingleDate
  const showHoverBand = isHoverRange && !isInRange && !isSingleDate

  const dayNumber = format(date, "d")

  const cellContent = (
    <div
      className={cn(
        "relative flex h-10 items-center justify-center select-none",
        isWeekend && isCurrentMonth && "bg-stone-50/60"
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* ── Confirmed range band — only for multi-date ranges ──────── */}
      {!isSingleDate && showStartBand && (
        <div
          className="absolute inset-y-[5px] left-1/2 right-0"
          style={{ backgroundColor: "var(--cal-accent-light)" }}
        />
      )}
      {!isSingleDate && showMiddleBand && (
        <div
          className="absolute inset-y-[5px] left-0 right-0"
          style={{ backgroundColor: "var(--cal-accent-light)" }}
        />
      )}
      {!isSingleDate && showEndBand && (
        <div
          className="absolute inset-y-[5px] left-0 right-1/2"
          style={{ backgroundColor: "var(--cal-accent-light)" }}
        />
      )}

      {/* ── Hover preview band — only for multi-date ranges ─────────── */}
      {!isSingleDate && showHoverBand && (
        <div
          className="absolute inset-y-[5px] left-0 right-0"
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

        {/* Holiday dot */}
        {holiday && !isSelected && (
          <span
            className="absolute bottom-[3px] size-1.5 rounded-full bg-rose-400"
          />
        )}

        {/* Today accent dot */}
        {isToday && !holiday && !isSelected && (
          <span
            className="absolute bottom-[3px] size-1 rounded-full"
            style={{ backgroundColor: "var(--cal-accent)" }}
          />
        )}
      </button>
    </div>
  )

  if (holiday) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {cellContent}
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          {holiday.name}
        </TooltipContent>
      </Tooltip>
    )
  }

  return cellContent
}
