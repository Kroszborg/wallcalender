"use client"

import { isSameDay, isWithinInterval, format, parseISO } from "date-fns"
import { cn } from "@/lib/utils"
import { buildCalendarDays, isInRange } from "@/lib/calendar-utils"
import { getHoliday } from "@/lib/holidays"
import { DayCell } from "./DayCell"
import type { SelectionPhase, DateRange, CalendarNote } from "@/lib/calendar-utils"

const DAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

interface CalendarGridProps {
  currentMonth: Date
  selectionPhase: SelectionPhase
  rangeStart: Date | null
  rangeEnd: Date | null
  hoverDate: Date | null
  activeRange: DateRange | null
  notes: CalendarNote[]
  onDayClick: (date: Date) => void
  onDayHover: (date: Date | null) => void
  animationDirection: "left" | "right" | null
}

export function CalendarGrid({
  currentMonth,
  selectionPhase,
  rangeStart,
  rangeEnd,
  hoverDate,
  activeRange,
  notes,
  onDayClick,
  onDayHover,
  animationDirection,
}: CalendarGridProps) {
  const days = buildCalendarDays(currentMonth)

  return (
    <div
      className="px-5 md:px-6 pb-1 pt-2"
      onMouseLeave={() => onDayHover(null)}
    >
      {/* Day-of-week header row */}
      <div className="grid grid-cols-7 mb-0.5">
        {DAY_HEADERS.map((day, idx) => (
          <div
            key={day}
            className={cn(
              "flex h-7 items-center justify-center",
              "text-[10px] uppercase tracking-widest font-semibold",
              // Weekend headers
              idx === 0 || idx === 6
                ? "text-stone-400"
                : "text-stone-400"
            )}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid — key change triggers slide animation */}
      <div
        key={format(currentMonth, "yyyy-MM")}
        className={cn(
          "grid grid-cols-7",
          animationDirection === "left" &&
            "animate-in slide-in-from-right-5 fade-in-0 duration-300",
          animationDirection === "right" &&
            "animate-in slide-in-from-left-5 fade-in-0 duration-300",
          animationDirection === null && "animate-in fade-in-0 duration-200"
        )}
      >
        {days.map((day) => {
          const isStart = !!(rangeStart && isSameDay(day.date, rangeStart))
          const isEnd = !!(rangeEnd && isSameDay(day.date, rangeEnd))

          const inConfirmedRange =
            !!rangeStart &&
            !!rangeEnd &&
            isWithinInterval(day.date, { start: rangeStart, end: rangeEnd }) &&
            !isStart &&
            !isEnd

          const inHoverRange =
            selectionPhase === "selecting" &&
            !!activeRange &&
            !rangeEnd &&
            isInRange(day.date, activeRange) &&
            !isStart

          const hasNote = notes.some((n) => {
            try {
              return isWithinInterval(day.date, {
                start: parseISO(n.rangeStart),
                end: parseISO(n.rangeEnd),
              })
            } catch {
              return false
            }
          })

          return (
            <DayCell
              key={day.date.toISOString()}
              date={day.date}
              isCurrentMonth={day.isCurrentMonth}
              isToday={day.isToday}
              isWeekend={day.isWeekend}
              isStart={isStart}
              isEnd={isEnd}
              isInRange={inConfirmedRange}
              isHoverRange={inHoverRange}
              hasNote={hasNote}
              holiday={getHoliday(day.date)}
              onClick={() => onDayClick(day.date)}
              onMouseEnter={() => onDayHover(day.date)}
              onMouseLeave={() => {}}
            />
          )
        })}
      </div>
    </div>
  )
}
