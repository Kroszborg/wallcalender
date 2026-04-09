"use client"

import { useState } from "react"
import { format, parseISO } from "date-fns"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
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
      <div className="px-5 pb-5 pt-4 bg-white">
        {/* ── Section header ──────────────────────────────── */}
        <div className="flex items-center gap-2 mb-4">
          <div
            className="size-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: "var(--cal-accent)" }}
          />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
            Notes
          </span>
          {rangeLabel && (
            <span
              key={rangeLabel}
              className="text-[11px] font-medium px-2 py-0.5 rounded-full animate-in fade-in-0 zoom-in-95 duration-200"
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
              className="ml-auto text-[11px] font-bold rounded-full px-2 py-0.5 animate-in fade-in-0 zoom-in-95 duration-200"
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
          <div className="flex flex-col items-center py-8 gap-2 text-center">
            <p className="text-[13px] text-stone-500">Select a date range to add notes</p>
          </div>
        )}

        {/* ── SELECTING state ─────────────────────────────── */}
        {selectionPhase === "selecting" && (
          <div className="flex flex-col items-center py-8 gap-2 text-center">
            <p className="text-[13px] font-medium text-stone-700">Click an end date</p>
            <p className="text-[12px] text-stone-400">Hover to preview the range</p>
          </div>
        )}

        {/* ── SELECTED: notes UI ──────────────────────────── */}
        {selectionPhase === "selected" && (
          <div className="flex flex-col gap-2">
            {/* Existing note cards */}
            {rangeNotes.map(note => (
              <div
                key={note.id}
                className="group relative rounded-lg bg-stone-50 p-3 pr-8"
              >
                {editingId === note.id ? (
                  <div className="flex flex-col gap-2">
                    <Textarea
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      className="text-[13px] min-h-[60px] resize-none bg-white"
                      autoFocus
                      onKeyDown={e => {
                        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSaveEdit(note.id)
                        if (e.key === "Escape") { setEditingId(null); setEditContent("") }
                      }}
                    />
                    <div className="flex gap-1 justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => { setEditingId(null); setEditContent("") }}
                        className="h-7 text-xs"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSaveEdit(note.id)}
                        disabled={!editContent.trim()}
                        className="h-7 text-xs bg-[#7c3aed] text-white hover:bg-[#7c3aed]/90"
                      >
                        Save
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
                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <button
                        onClick={() => { setEditingId(note.id); setEditContent(note.content) }}
                        className="text-stone-400 hover:text-stone-700 text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(note.id)}
                        className="text-stone-400 hover:text-rose-500 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* New note composer */}
            <div className="rounded-lg border border-stone-200 overflow-hidden">
              <Textarea
                value={draftContent}
                onChange={e => setDraftContent(e.target.value)}
                placeholder="Write a note for this range…"
                className="text-[13px] min-h-[60px] resize-none border-none bg-white shadow-none ring-0 focus-visible:ring-0 px-3 pt-2.5 pb-1"
                onKeyDown={e => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSave()
                }}
              />
              <div className="flex items-center justify-between px-3 pb-2.5 pt-2 border-t border-stone-100">
                <span className="text-[10px] text-stone-400">
                  {draftContent.length > 0 ? `${draftContent.length} chars · ` : ""}Ctrl+Enter to save
                </span>
                <button
                  onClick={handleSave}
                  disabled={!draftContent.trim()}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                    draftContent.trim()
                      ? "bg-[#7c3aed] text-white hover:opacity-90"
                      : "bg-stone-100 text-stone-400 cursor-not-allowed"
                  }`}
                >
                  Add Note
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
              className="text-white bg-rose-500 hover:bg-rose-600"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
