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

const MONTH_ACCENTS = [
  "#1e3a5f", "#4a1942", "#1a4d2e", "#4c1d95", // Jan-Apr
  "#7c2d12", "#0c4a6e", "#7c2d12", "#a16207", // May-Aug
  "#78350f", "#7c2d12", "#3f3f46", "#1e3a5f", // Sep-Dec
]

export function Calendar() {
  const [currentMonth, setCurrentMonth] = useState<Date>(() => startOfMonth(new Date()))
  const [selectionPhase, setSelectionPhase] = useState<SelectionPhase>("idle")
  const [rangeStart, setRangeStart] = useState<Date | null>(null)
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null)
  const [hoverDate, setHoverDate] = useState<Date | null>(null)
  const [notes, setNotes] = useState<CalendarNote[]>([])
  const [animationDirection, setAnimationDirection] = useState<"left" | "right" | null>(null)

  // SSR-safe localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(NOTES_KEY)
      if (raw) setNotes(JSON.parse(raw) as CalendarNote[])
    } catch { /* silent */ }
  }, [])

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

  // ── Month navigation ──────────────────────────────────────
  function handlePrevMonth() {
    setAnimationDirection("right")
    setCurrentMonth(prev => subMonths(prev, 1))
    setTimeout(() => setAnimationDirection(null), 400)
  }

  function handleNextMonth() {
    setAnimationDirection("left")
    setCurrentMonth(prev => addMonths(prev, 1))
    setTimeout(() => setAnimationDirection(null), 400)
  }

  // ── Keyboard navigation ───────────────────────────────────
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // Don't capture while typing in a form field
      if (
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLInputElement
      ) return

      if (e.key === "ArrowLeft") {
        e.preventDefault()
        setAnimationDirection("right")
        setCurrentMonth(prev => subMonths(prev, 1))
        setTimeout(() => setAnimationDirection(null), 400)
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        setAnimationDirection("left")
        setCurrentMonth(prev => addMonths(prev, 1))
        setTimeout(() => setAnimationDirection(null), 400)
      } else if (e.key === "Escape") {
        setRangeStart(null)
        setRangeEnd(null)
        setSelectionPhase("idle")
        setHoverDate(null)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, []) // state setters are stable refs

  // ── 3-click selection machine ─────────────────────────────
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

  // ── Notes CRUD ────────────────────────────────────────────
  function handleSaveNote(content: string, start: Date, end: Date) {
    setNotes(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        rangeStart: format(start, "yyyy-MM-dd"),
        rangeEnd: format(end, "yyyy-MM-dd"),
        content: content.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ])
  }

  function handleUpdateNote(id: string, content: string) {
    setNotes(prev =>
      prev.map(n =>
        n.id === id
          ? { ...n, content: content.trim(), updatedAt: new Date().toISOString() }
          : n
      )
    )
  }

  function handleDeleteNote(id: string) {
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  return (
    <div
      suppressHydrationWarning
      className="w-full max-w-[500px] rounded-3xl overflow-hidden bg-white shadow-[0_40px_120px_-20px_rgba(0,0,0,0.25)] relative"
      style={{
        transform: "rotate(0.15deg)",
      }}
    >
      {/* Month-themed accent border glow */}
      <div
        className="absolute inset-0 pointer-events-none rounded-3xl transition-colors duration-500"
        style={{
          boxShadow: `inset 0 0 0 2px ${MONTH_ACCENTS[currentMonth.getMonth()]}15`,
        }}
      />
      <HeroImage
        month={currentMonth}
        key={format(currentMonth, "yyyy-MM")}
        animate={animationDirection !== null}
      />

      <MonthNavigator
        currentMonth={currentMonth}
        onPrev={handlePrevMonth}
        onNext={handleNextMonth}
        animationDirection={animationDirection}
      />

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

      <div className="mx-5 border-t border-stone-100" />

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
