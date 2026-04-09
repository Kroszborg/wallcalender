"use client"

import { format } from "date-fns"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface MonthNavigatorProps {
  currentMonth: Date
  onPrev: () => void
  onNext: () => void
  animationDirection: "left" | "right" | null
}

export function MonthNavigator({
  currentMonth,
  onPrev,
  onNext,
  animationDirection,
}: MonthNavigatorProps) {
  return (
    <div className="flex items-center justify-between px-5 md:px-6 py-3 border-b border-stone-100">
      <Button
        variant="ghost"
        size="icon"
        onClick={onPrev}
        className="size-8 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-all duration-150 active:scale-95"
        aria-label="Previous month"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} size={15} strokeWidth={2} />
      </Button>

      {/* Month + Year animated */}
      <div className="relative overflow-hidden h-[38px] flex-1 flex flex-col items-center justify-center">
        <div
          key={format(currentMonth, "yyyy-MM")}
          className={cn(
            "flex flex-col items-center gap-0",
            animationDirection === "left" &&
              "animate-in slide-in-from-right-4 fade-in-0 duration-280",
            animationDirection === "right" &&
              "animate-in slide-in-from-left-4 fade-in-0 duration-280",
            animationDirection === null &&
              "animate-in fade-in-0 duration-200"
          )}
        >
          <span className="text-[15px] font-bold tracking-tight text-stone-900 leading-tight">
            {format(currentMonth, "MMMM")}
          </span>
          <span className="text-[11px] text-stone-400 font-medium leading-tight">
            {format(currentMonth, "yyyy")}
          </span>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={onNext}
        className="size-8 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-all duration-150 active:scale-95"
        aria-label="Next month"
      >
        <HugeiconsIcon icon={ArrowRight01Icon} size={15} strokeWidth={2} />
      </Button>
    </div>
  )
}
