"use client"

import { useState } from "react"
import { format, parseISO } from "date-fns"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Edit01Icon,
  Delete01Icon,
  Cancel01Icon,
  Tick01Icon,
  Calendar01Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { SelectionPhase, CalendarNote } from "@/lib/calendar-utils"

interface NotesPanelProps {
  rangeStart: Date | null
  rangeEnd: Date | null
  selectionPhase: SelectionPhase
  notes: CalendarNote[]
  onSaveNote: (content: string, rangeStart: Date, rangeEnd: Date) => void
  onUpdateNote: (id: string, content: string) => void
  onDeleteNote: (id: string) => void
}

export function NotesPanel({
  rangeStart,
  rangeEnd,
  selectionPhase,
  notes,
  onSaveNote,
  onUpdateNote,
  onDeleteNote,
}: NotesPanelProps) {
  const [draftContent, setDraftContent] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const rangeNotes =
    rangeStart && rangeEnd
      ? notes.filter(
          (n) =>
            n.rangeStart === format(rangeStart, "yyyy-MM-dd") &&
            n.rangeEnd === format(rangeEnd, "yyyy-MM-dd")
        )
      : []

  function handleSave() {
    if (!draftContent.trim() || !rangeStart || !rangeEnd) return
    onSaveNote(draftContent, rangeStart, rangeEnd)
    setDraftContent("")
  }

  function handleStartEdit(note: CalendarNote) {
    setEditingId(note.id)
    setEditContent(note.content)
  }

  function handleSaveEdit(id: string) {
    if (!editContent.trim()) return
    onUpdateNote(id, editContent)
    setEditingId(null)
    setEditContent("")
  }

  function handleCancelEdit() {
    setEditingId(null)
    setEditContent("")
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return
    onDeleteNote(deleteTarget)
    setDeleteTarget(null)
  }

  const isSameDate =
    rangeStart && rangeEnd
      ? format(rangeStart, "yyyy-MM-dd") === format(rangeEnd, "yyyy-MM-dd")
      : false

  const rangeLabel =
    rangeStart && rangeEnd
      ? isSameDate
        ? format(rangeStart, "MMMM d, yyyy")
        : `${format(rangeStart, "MMM d")} – ${format(rangeEnd, "MMM d, yyyy")}`
      : null

  return (
    <>
      {/* ── Notes section ──────────────────────────────────── */}
      <div className="px-5 md:px-6 pb-5 pt-1">
        {/* Section label row */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className="size-1.5 rounded-full"
            style={{ backgroundColor: "var(--cal-accent)" }}
          />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">
            Notes
          </span>
          {rangeLabel && (
            <>
              <span className="text-stone-300 text-xs">·</span>
              <span
                className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: "var(--cal-accent-light)",
                  color: "var(--cal-accent)",
                }}
              >
                {rangeLabel}
              </span>
            </>
          )}
          {rangeNotes.length > 0 && (
            <span
              className="ml-auto text-[10px] font-semibold rounded-full px-2 py-0.5"
              style={{
                backgroundColor: "var(--cal-accent-light)",
                color: "var(--cal-accent)",
              }}
            >
              {rangeNotes.length}
            </span>
          )}
        </div>

        {/* ── IDLE: empty state ──────────────────────────── */}
        {selectionPhase === "idle" && (
          <div className="flex flex-col items-center justify-center py-7 gap-3 text-center">
            {/* SVG illustration */}
            <svg
              width="52"
              height="52"
              viewBox="0 0 52 52"
              fill="none"
              className="opacity-30"
            >
              <rect x="8" y="6" width="36" height="40" rx="4" fill="#a8a29e" />
              <rect x="14" y="16" width="24" height="2" rx="1" fill="white" />
              <rect x="14" y="22" width="18" height="2" rx="1" fill="white" />
              <rect x="14" y="28" width="21" height="2" rx="1" fill="white" />
              <rect x="14" y="34" width="14" height="2" rx="1" fill="white" />
              <rect x="18" y="2" width="4" height="8" rx="2" fill="#78716c" />
              <rect x="30" y="2" width="4" height="8" rx="2" fill="#78716c" />
            </svg>
            <div>
              <p className="text-[13px] font-medium text-stone-500">
                No range selected
              </p>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Click a day to start selecting a date range
              </p>
            </div>
          </div>
        )}

        {/* ── SELECTING: in-progress state ───────────────── */}
        {selectionPhase === "selecting" && (
          <div className="flex flex-col items-center justify-center py-7 gap-3 text-center">
            <div
              className="size-10 rounded-2xl flex items-center justify-center animate-pulse"
              style={{ backgroundColor: "var(--cal-accent-light)" }}
            >
              <HugeiconsIcon
                icon={Calendar01Icon}
                size={20}
                strokeWidth={1.5}
                style={{ color: "var(--cal-accent)" }}
              />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-stone-700">
                Now click an end date
              </p>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Hover to preview · Click to confirm range
              </p>
            </div>
          </div>
        )}

        {/* ── SELECTED: full notes UI ─────────────────────── */}
        {selectionPhase === "selected" && (
          <div className="flex flex-col gap-3">
            {/* Existing note cards */}
            {rangeNotes.map((note) => (
              <div
                key={note.id}
                className={cn(
                  "group relative rounded-xl bg-stone-50 border border-stone-100 p-3 pl-4",
                  "animate-in fade-in-0 slide-in-from-bottom-1 duration-200"
                )}
              >
                {/* Left accent bar */}
                <div
                  className="absolute left-0 inset-y-0 w-[3px] rounded-l-xl"
                  style={{ backgroundColor: "var(--cal-accent)" }}
                />

                {editingId === note.id ? (
                  <div className="flex flex-col gap-2">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="text-[13px] min-h-[56px] resize-none bg-white border-stone-200"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && (e.metaKey || e.ctrlKey))
                          handleSaveEdit(note.id)
                        if (e.key === "Escape") handleCancelEdit()
                      }}
                    />
                    <div className="flex gap-1.5 justify-end">
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={handleCancelEdit}
                        className="text-stone-400 hover:text-stone-600"
                      >
                        <HugeiconsIcon icon={Cancel01Icon} size={12} strokeWidth={2} />
                      </Button>
                      <Button
                        size="icon-sm"
                        onClick={() => handleSaveEdit(note.id)}
                        disabled={!editContent.trim()}
                        style={{ backgroundColor: "var(--cal-accent)" }}
                        className="text-white hover:opacity-90"
                      >
                        <HugeiconsIcon icon={Tick01Icon} size={12} strokeWidth={2} />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-stone-700 leading-relaxed whitespace-pre-wrap">
                        {note.content}
                      </p>
                      <p className="text-[10px] text-stone-400 mt-1.5">
                        {format(parseISO(note.updatedAt), "MMM d 'at' h:mm a")}
                      </p>
                    </div>
                    <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0 pt-0.5">
                      <Button
                        size="icon-xs"
                        variant="ghost"
                        onClick={() => handleStartEdit(note)}
                        aria-label="Edit note"
                        className="text-stone-400 hover:text-stone-700"
                      >
                        <HugeiconsIcon icon={Edit01Icon} size={11} strokeWidth={2} />
                      </Button>
                      <Button
                        size="icon-xs"
                        variant="ghost"
                        onClick={() => setDeleteTarget(note.id)}
                        aria-label="Delete note"
                        className="text-stone-400 hover:text-rose-500 hover:bg-rose-50"
                      >
                        <HugeiconsIcon icon={Delete01Icon} size={11} strokeWidth={2} />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* New note input area */}
            <div
              className="rounded-xl border border-stone-150 overflow-hidden"
              style={{ background: "white", borderColor: "#e8e5e0" }}
            >
              <Textarea
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
                placeholder="Write a note for this date range…"
                className="text-[13px] min-h-[68px] resize-none border-none bg-transparent rounded-none shadow-none ring-0 focus-visible:ring-0 px-3 pt-2.5 pb-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSave()
                }}
              />
              <div
                className="flex items-center justify-between px-3 pb-2.5 pt-1 border-t"
                style={{ borderColor: "#f0ece6" }}
              >
                <span className="text-[10px] text-stone-400">
                  {draftContent.length > 0
                    ? `${draftContent.length} chars · `
                    : ""}
                  ⌘ + Enter to save
                </span>
                <button
                  onClick={handleSave}
                  disabled={!draftContent.trim()}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold",
                    "transition-all duration-150 active:scale-95",
                    draftContent.trim()
                      ? "text-white shadow-sm hover:opacity-90"
                      : "text-stone-300 bg-stone-100 cursor-not-allowed"
                  )}
                  style={
                    draftContent.trim()
                      ? { backgroundColor: "var(--cal-accent)" }
                      : undefined
                  }
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 2.5V9.5M2.5 6H9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                  Add Note
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Delete confirm dialog ──────────────────────────── */}
      <Dialog
        open={deleteTarget !== null}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
      >
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>Delete this note?</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground">
            This cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleDeleteConfirm}
              className="text-white"
              style={{ backgroundColor: "var(--destructive)" }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
