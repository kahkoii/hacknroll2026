"use client"

import type { Event } from "@/app/plan-event/page"
import { Calendar, Clock, Share2, Check } from "lucide-react"
import { format, parseISO } from "date-fns"
import { useState } from "react"

type Props = {
  event: Event
  currentUser: string
  onJoin: () => void
}

export function EventHeader({ event, currentUser, onJoin }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const dateRange =
    event.dates.length > 1
      ? `${format(parseISO(event.dates[0]), "MMM d")} - ${format(parseISO(event.dates[event.dates.length - 1]), "MMM d, yyyy")}`
      : format(parseISO(event.dates[0]), "MMMM d, yyyy")

  const timeRange = `${format(new Date(`2000-01-01T${event.startTime}`), "h a")} - ${format(new Date(`2000-01-01T${event.endTime}`), "h a")}`

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 text-balance">{event.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {dateRange}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {timeRange}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-primary" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </>
            )}
          </button>
          {!currentUser && (
            <button
              onClick={onJoin}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Join Event
            </button>
          )}
        </div>
      </div>

      {currentUser && (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Editing as <span className="font-medium">{currentUser}</span>
        </div>
      )}
    </div>
  )
}
