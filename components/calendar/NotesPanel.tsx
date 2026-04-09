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
          n =>
            n.rangeStart === format(rangeStart, "yyyy-MM-dd") &&
            n.rangeEnd === format(rangeEnd, "yyyy-MM-dd")
        )
      : []

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

  function handleSave() {
    if (!draftContent.trim() || !rangeStart || !rangeEnd) return
    onSaveNote(draftContent, rangeStart, rangeEnd)
    setDraftContent("")
  }

  function handleSaveEdit(id: string) {
    if (!editContent.trim()) return
    onUpdateNote(id, editContent)
    setEditingId(null)
    setEditContent("")
  }

  return (
    <>
      <div className="px-5 pb-5 pt-3 bg-white/95 backdrop-blur-sm">
        {/* ── Section header ──────────────────────────────── */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className="size-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: "var(--cal-accent)" }}
          />
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-stone-400">
            Notes
          </span>

          {/* Animated range chip */}
          {rangeLabel && (
            <span
              key={rangeLabel}
              className="text-[11px] font-medium px-2 py-0.5 rounded-full animate-in fade-in-0 zoom-in-95 duration-200 ml-0.5"
              style={{
                backgroundColor: "var(--cal-accent-light)",
                color: "var(--cal-accent)",
              }}
            >
              {rangeLabel}
            </span>
          )}

          {rangeNotes.length > 0 && (
            <span
              className="ml-auto text-[10px] font-bold rounded-full px-2 py-0.5"
              style={{
                backgroundColor: "var(--cal-accent-light)",
                color: "var(--cal-accent)",
              }}
            >
              {rangeNotes.length}
            </span>
          )}
        </div>

        {/* ── IDLE empty state ────────────────────────────── */}
        {selectionPhase === "idle" && (
          <div className="flex flex-col items-center py-6 gap-3 text-center">
            {/* Premium SVG illustration — calendar + pen */}
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" className="opacity-[0.32]">
              <rect x="6" y="10" width="34" height="38" rx="4" fill="#a8a29e" />
              <rect x="6" y="10" width="34" height="10" rx="4" fill="#78716c" />
              <rect x="13" y="26" width="20" height="2" rx="1" fill="white" opacity="0.8" />
              <rect x="13" y="32" width="15" height="2" rx="1" fill="white" opacity="0.6" />
              <rect x="13" y="38" width="18" height="2" rx="1" fill="white" opacity="0.4" />
              <rect x="14" y="6" width="4" height="9" rx="2" fill="#57534e" />
              <rect x="28" y="6" width="4" height="9" rx="2" fill="#57534e" />
              {/* Pen */}
              <rect x="34" y="30" width="5" height="18" rx="2.5" transform="rotate(-35 34 30)" fill="#6d28d9" />
              <polygon points="30,46 33,44 31.5,47.5" fill="#4c1d95" />
              <rect x="35" y="30" width="5" height="4" rx="1" transform="rotate(-35 35 30)" fill="#8b5cf6" />
            </svg>
            <div>
              <p className="text-[13px] font-semibold text-stone-500">No range selected</p>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Click any date to start selecting a range
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-stone-400 bg-stone-50 rounded-lg px-3 py-2">
              <kbd className="font-mono bg-white border border-stone-200 rounded px-1.5 py-0.5 text-[9px] shadow-sm">←</kbd>
              <kbd className="font-mono bg-white border border-stone-200 rounded px-1.5 py-0.5 text-[9px] shadow-sm">→</kbd>
              <span>navigate months · <kbd className="font-mono bg-white border border-stone-200 rounded px-1 py-0.5 text-[9px] shadow-sm">Esc</kbd> clear</span>
            </div>
          </div>
        )}

        {/* ── SELECTING state ──────────────────────────────── */}
        {selectionPhase === "selecting" && (
          <div className="flex flex-col items-center py-6 gap-3 text-center">
            <div
              className="size-11 rounded-2xl flex items-center justify-center"
              style={{
                backgroundColor: "var(--cal-accent-light)",
                animation: "cal-beacon 2s ease-out infinite",
              }}
            >
              <HugeiconsIcon
                icon={Calendar01Icon}
                size={20}
                strokeWidth={1.5}
                style={{ color: "var(--cal-accent)" }}
              />
            </div>
            <div>
              <p className="text-[13px] font-bold text-stone-700">Click an end date</p>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Hover to preview the range
              </p>
            </div>
          </div>
        )}

        {/* ── SELECTED: notes UI ───────────────────────────── */}
        {selectionPhase === "selected" && (
          <div className="flex flex-col gap-2.5">
            {/* Existing note cards */}
            {rangeNotes.map(note => (
              <div
                key={note.id}
                className={cn(
                  "group relative rounded-xl bg-stone-50 border border-stone-100/80 p-3 pl-[14px]",
                  "animate-in fade-in-0 slide-in-from-bottom-2 duration-200",
                  "shadow-sm"
                )}
              >
                {/* Left accent border */}
                <div
                  className="absolute left-0 inset-y-0 w-[3px] rounded-l-xl"
                  style={{ backgroundColor: "var(--cal-accent)" }}
                />

                {editingId === note.id ? (
                  <div className="flex flex-col gap-2">
                    <Textarea
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      className="text-[13px] min-h-[52px] resize-none bg-white border-stone-200"
                      autoFocus
                      onKeyDown={e => {
                        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSaveEdit(note.id)
                        if (e.key === "Escape") { setEditingId(null); setEditContent("") }
                      }}
                    />
                    <div className="flex gap-1.5 justify-end">
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => { setEditingId(null); setEditContent("") }}
                        className="text-stone-400 hover:text-stone-600"
                      >
                        <HugeiconsIcon icon={Cancel01Icon} size={12} strokeWidth={2} />
                      </Button>
                      <Button
                        size="icon-sm"
                        onClick={() => handleSaveEdit(note.id)}
                        disabled={!editContent.trim()}
                        className="text-white hover:opacity-90"
                        style={{ backgroundColor: "var(--cal-accent)" }}
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
                        onClick={() => { setEditingId(note.id); setEditContent(note.content) }}
                        className="text-stone-400 hover:text-stone-700"
                      >
                        <HugeiconsIcon icon={Edit01Icon} size={11} strokeWidth={2} />
                      </Button>
                      <Button
                        size="icon-xs"
                        variant="ghost"
                        onClick={() => setDeleteTarget(note.id)}
                        className="text-stone-400 hover:text-rose-500 hover:bg-rose-50"
                      >
                        <HugeiconsIcon icon={Delete01Icon} size={11} strokeWidth={2} />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* New note composer */}
            <div
              className="rounded-xl overflow-hidden border"
              style={{ borderColor: "#e4dfd8", background: "white" }}
            >
              <Textarea
                value={draftContent}
                onChange={e => setDraftContent(e.target.value)}
                placeholder="Write a note for this range…"
                className="text-[13px] min-h-[64px] resize-none border-none bg-transparent rounded-none shadow-none ring-0 focus-visible:ring-0 px-3 pt-2.5 pb-1"
                onKeyDown={e => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSave()
                }}
              />
              <div
                className="flex items-center justify-between px-3 pb-2.5 pt-1.5 border-t"
                style={{ borderColor: "#ede8e2" }}
              >
                <span className="text-[10px] text-stone-400">
                  {draftContent.length > 0 ? `${draftContent.length} · ` : ""}⌘↵ save
                </span>
                <button
                  onClick={handleSave}
                  disabled={!draftContent.trim()}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg",
                    "text-[11px] font-bold transition-all duration-150 active:scale-95",
                    draftContent.trim()
                      ? "text-white shadow-sm hover:opacity-90"
                      : "text-stone-300 bg-stone-100 cursor-not-allowed"
                  )}
                  style={draftContent.trim() ? { backgroundColor: "var(--cal-accent)" } : undefined}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M5 1.5V8.5M1.5 5H8.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Delete confirmation ───────────────────────────── */}
      <Dialog
        open={deleteTarget !== null}
        onOpenChange={open => { if (!open) setDeleteTarget(null) }}
      >
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>Delete this note?</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground">This cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button
              size="sm"
              onClick={() => { if (deleteTarget) { onDeleteNote(deleteTarget); setDeleteTarget(null) } }}
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
