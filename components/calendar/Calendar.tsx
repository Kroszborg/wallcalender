"use client"

import { useState, useMemo, useEffect } from "react"
import { format, addMonths, subMonths, isBefore, startOfMonth } from "date-fns"
import { cn } from "@/lib/utils"
import { HeroImage } from "./HeroImage"
import { MonthNavigator } from "./MonthNavigator"
import { CalendarGrid } from "./CalendarGrid"
import { NotesPanel } from "./NotesPanel"
import type { SelectionPhase, DateRange, CalendarNote } from "@/lib/calendar-utils"

const NOTES_KEY = "wall-calendar-notes-v1"

export function Calendar() {
  // Use a lazy initializer — stable on client, avoids SSR mismatch
  const [currentMonth, setCurrentMonth] = useState<Date>(() =>
    startOfMonth(new Date())
  )
  const [selectionPhase, setSelectionPhase] = useState<SelectionPhase>("idle")
  const [rangeStart, setRangeStart] = useState<Date | null>(null)
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null)
  const [hoverDate, setHoverDate] = useState<Date | null>(null)
  const [notes, setNotes] = useState<CalendarNote[]>([])
  const [animationDirection, setAnimationDirection] = useState<
    "left" | "right" | null
  >(null)

  // SSR-safe localStorage hydration
  useEffect(() => {
    try {
      const raw = localStorage.getItem(NOTES_KEY)
      if (raw) setNotes(JSON.parse(raw) as CalendarNote[])
    } catch {
      // silent fail
    }
  }, [])

  // Persist notes on change
  useEffect(() => {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes))
  }, [notes])

  // Derived active range (confirmed or hover preview)
  const activeRange = useMemo((): DateRange | null => {
    if (!rangeStart) return null
    if (rangeEnd) return { start: rangeStart, end: rangeEnd }
    if (hoverDate) {
      return isBefore(hoverDate, rangeStart)
        ? { start: hoverDate, end: rangeStart }
        : { start: rangeStart, end: hoverDate }
    }
    return null
  }, [rangeStart, rangeEnd, hoverDate])

  // ── 3-click selection state machine ──────────────────────
  function handleDayClick(date: Date) {
    switch (selectionPhase) {
      case "idle": {
        setRangeStart(date)
        setRangeEnd(null)
        setSelectionPhase("selecting")
        break
      }
      case "selecting": {
        if (!rangeStart) return
        if (isBefore(date, rangeStart)) {
          setRangeStart(date)
          setRangeEnd(rangeStart)
        } else {
          setRangeEnd(date)
        }
        setSelectionPhase("selected")
        setHoverDate(null)
        break
      }
      case "selected": {
        setRangeStart(date)
        setRangeEnd(null)
        setSelectionPhase("selecting")
        break
      }
    }
  }

  function handleDayHover(date: Date | null) {
    if (selectionPhase === "selecting") setHoverDate(date)
  }

  function handlePrevMonth() {
    setAnimationDirection("right")
    setCurrentMonth((prev) => subMonths(prev, 1))
    setTimeout(() => setAnimationDirection(null), 320)
  }

  function handleNextMonth() {
    setAnimationDirection("left")
    setCurrentMonth((prev) => addMonths(prev, 1))
    setTimeout(() => setAnimationDirection(null), 320)
  }

  // ── Notes CRUD ────────────────────────────────────────────
  function handleSaveNote(content: string, start: Date, end: Date) {
    const note: CalendarNote = {
      id: crypto.randomUUID(),
      rangeStart: format(start, "yyyy-MM-dd"),
      rangeEnd: format(end, "yyyy-MM-dd"),
      content: content.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setNotes((prev) => [...prev, note])
  }

  function handleUpdateNote(id: string, content: string) {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, content: content.trim(), updatedAt: new Date().toISOString() }
          : n
      )
    )
  }

  function handleDeleteNote(id: string) {
    setNotes((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <div
      suppressHydrationWarning
      className={cn(
        "w-full max-w-[480px] md:max-w-[520px] rounded-[28px] overflow-hidden bg-white",
        "shadow-[0_40px_100px_-20px_rgba(0,0,0,0.22),0_12px_32px_-8px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)]"
      )}
    >
      {/* Hero + binding strip */}
      <HeroImage month={currentMonth} />

      {/* Month navigator */}
      <MonthNavigator
        currentMonth={currentMonth}
        onPrev={handlePrevMonth}
        onNext={handleNextMonth}
        animationDirection={animationDirection}
      />

      {/* Calendar grid */}
      <CalendarGrid
        currentMonth={currentMonth}
        selectionPhase={selectionPhase}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        hoverDate={hoverDate}
        activeRange={activeRange}
        notes={notes}
        onDayClick={handleDayClick}
        onDayHover={handleDayHover}
        animationDirection={animationDirection}
      />

      {/* Divider */}
      <div className="mx-5 md:mx-6 border-t border-stone-100" />

      {/* Notes panel */}
      <NotesPanel
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        selectionPhase={selectionPhase}
        notes={notes}
        onSaveNote={handleSaveNote}
        onUpdateNote={handleUpdateNote}
        onDeleteNote={handleDeleteNote}
      />
    </div>
  )
}
