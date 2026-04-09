import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isWeekend,
  isWithinInterval,
  isBefore,
} from "date-fns"

export type SelectionPhase = "idle" | "selecting" | "selected"

export interface DateRange {
  start: Date
  end: Date
}

export interface CalendarNote {
  id: string
  rangeStart: string // "yyyy-MM-dd"
  rangeEnd: string   // "yyyy-MM-dd"
  content: string
  createdAt: string
  updatedAt: string
}

export interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  isWeekend: boolean
}

export function buildCalendarDays(month: Date): CalendarDay[] {
  const monthStart = startOfMonth(month)
  const monthEnd = endOfMonth(month)
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })

  return eachDayOfInterval({ start: gridStart, end: gridEnd }).map((date) => ({
    date,
    isCurrentMonth: isSameMonth(date, month),
    isToday: isToday(date),
    isWeekend: isWeekend(date),
  }))
}

export function isInRange(date: Date, range: DateRange | null): boolean {
  if (!range) return false
  return isWithinInterval(date, { start: range.start, end: range.end })
}

export function normalizeRange(a: Date, b: Date): DateRange {
  return isBefore(a, b) ? { start: a, end: b } : { start: b, end: a }
}
