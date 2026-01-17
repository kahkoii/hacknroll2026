"use client"

import { useState, useCallback, useRef } from "react"
import type { Event } from "@/app/plan-event/page"
import { format, parseISO } from "date-fns"

type Props = {
  event: Event
  currentUser: string
  onToggle: (date: string, time: string) => void
  onBulkToggle: (slots: { date: string; time: string }[], adding: boolean) => void
}

export function AvailabilityGrid({ event, currentUser, onToggle, onBulkToggle }: Props) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<{ date: string; time: string } | null>(null)
  const [dragEnd, setDragEnd] = useState<{ date: string; time: string } | null>(null)
  const [dragMode, setDragMode] = useState<"add" | "remove">("add")
  const [hoveredSlot, setHoveredSlot] = useState<{ date: string; time: string } | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const startHour = Number.parseInt(event.startTime.split(":")[0])
  const endHour = Number.parseInt(event.endTime.split(":")[0])
  const hours = Array.from({ length: endHour - startHour }, (_, i) => startHour + i)

  const getSlotAvailability = (date: string, time: string) => {
    const slot = event.timeSlots.find((s) => s.date === date && s.time === time)
    return slot?.available || []
  }

  const isUserAvailable = (date: string, time: string) => {
    return getSlotAvailability(date, time).includes(currentUser)
  }

  const getAvailabilityLevel = (date: string, time: string) => {
    const available = getSlotAvailability(date, time)
    if (event.participants.length === 0) return 0
    return available.length / event.participants.length
  }

  const getSelectionRange = useCallback(() => {
    if (!dragStart || !dragEnd) return []

    const startDateIdx = event.dates.indexOf(dragStart.date)
    const endDateIdx = event.dates.indexOf(dragEnd.date)
    const startTimeIdx = hours.indexOf(Number.parseInt(dragStart.time.split(":")[0]))
    const endTimeIdx = hours.indexOf(Number.parseInt(dragEnd.time.split(":")[0]))

    const minDateIdx = Math.min(startDateIdx, endDateIdx)
    const maxDateIdx = Math.max(startDateIdx, endDateIdx)
    const minTimeIdx = Math.min(startTimeIdx, endTimeIdx)
    const maxTimeIdx = Math.max(startTimeIdx, endTimeIdx)

    const slots: { date: string; time: string }[] = []
    for (let d = minDateIdx; d <= maxDateIdx; d++) {
      for (let t = minTimeIdx; t <= maxTimeIdx; t++) {
        slots.push({
          date: event.dates[d],
          time: `${hours[t].toString().padStart(2, "0")}:00`,
        })
      }
    }
    return slots
  }, [dragStart, dragEnd, event.dates, hours])

  const isInSelection = (date: string, time: string) => {
    if (!isDragging) return false
    return getSelectionRange().some((s) => s.date === date && s.time === time)
  }

  const handleMouseDown = (date: string, time: string) => {
    const isAvailable = isUserAvailable(date, time)
    setDragMode(isAvailable ? "remove" : "add")
    setIsDragging(true)
    setDragStart({ date, time })
    setDragEnd({ date, time })
  }

  const handleMouseEnter = (date: string, time: string) => {
    setHoveredSlot({ date, time })
    if (isDragging) {
      setDragEnd({ date, time })
    }
  }

  const handleMouseUp = () => {
    if (isDragging && dragStart) {
      const slots = getSelectionRange()
      if (slots.length === 1) {
        onToggle(slots[0].date, slots[0].time)
      } else {
        onBulkToggle(slots, dragMode === "add")
      }
    }
    setIsDragging(false)
    setDragStart(null)
    setDragEnd(null)
  }

  const handleMouseLeave = () => {
    setHoveredSlot(null)
  }

  const hoveredAvailability = hoveredSlot ? getSlotAvailability(hoveredSlot.date, hoveredSlot.time) : []

  return (
    <div className="bg-card border border-border rounded-2xl p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Your Availability</h2>
          <p className="text-sm text-muted-foreground">Click and drag to select time slots</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-muted border border-border" />
            <span className="text-muted-foreground">Unavailable</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary" />
            <span className="text-muted-foreground">Available</span>
          </div>
        </div>
      </div>

      <div
        ref={gridRef}
        className="overflow-x-auto"
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          handleMouseUp()
          handleMouseLeave()
        }}
      >
        <div className="min-w-fit">
          {/* Date Headers */}
          <div className="flex">
            <div className="w-20 shrink-0" />
            {event.dates.map((date) => (
              <div key={date} className="flex-1 min-w-[60px] text-center px-1 pb-3">
                <div className="text-xs text-muted-foreground uppercase">{format(parseISO(date), "EEE")}</div>
                <div className="text-sm font-semibold text-foreground">{format(parseISO(date), "MMM d")}</div>
              </div>
            ))}
          </div>

          {/* Time Grid */}
          <div className="border border-border rounded-lg overflow-hidden">
            {hours.map((hour, hourIdx) => (
              <div key={hour} className="flex">
                <div className="w-20 shrink-0 py-2 px-3 text-xs text-muted-foreground border-r border-border bg-muted/30 flex items-center">
                  {format(new Date(`2000-01-01T${hour.toString().padStart(2, "0")}:00`), "h a")}
                </div>
                {event.dates.map((date, dateIdx) => {
                  const time = `${hour.toString().padStart(2, "0")}:00`
                  const isAvailable = isUserAvailable(date, time)
                  const level = getAvailabilityLevel(date, time)
                  const inSelection = isInSelection(date, time)
                  const isHovered = hoveredSlot?.date === date && hoveredSlot?.time === time

                  return (
                    <div
                      key={`${date}-${time}`}
                      className={`
                        flex-1 min-w-[60px] h-10 border-r border-b border-border cursor-pointer
                        transition-all duration-75 select-none relative
                        ${dateIdx === event.dates.length - 1 ? "border-r-0" : ""}
                        ${hourIdx === hours.length - 1 ? "border-b-0" : ""}
                        ${
                          inSelection
                            ? dragMode === "add"
                              ? "bg-primary/60"
                              : "bg-destructive/30"
                            : isAvailable
                              ? "bg-primary hover:bg-primary/80"
                              : level > 0
                                ? `bg-primary/${Math.round(level * 40 + 10)}`
                                : "bg-background hover:bg-muted"
                        }
                      `}
                      onMouseDown={() => handleMouseDown(date, time)}
                      onMouseEnter={() => handleMouseEnter(date, time)}
                      title={`${format(parseISO(date), "MMM d")} at ${format(new Date(`2000-01-01T${time}`), "h a")}`}
                    >
                      {level > 0 && !isAvailable && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[10px] font-medium text-primary">
                            {Math.round(level * event.participants.length)}
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hover Info */}
      {hoveredSlot && hoveredAvailability.length > 0 && (
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-foreground">
            <span className="font-medium">
              {format(parseISO(hoveredSlot.date), "EEE, MMM d")} at{" "}
              {format(new Date(`2000-01-01T${hoveredSlot.time}`), "h a")}
            </span>
          </p>
          <p className="text-sm text-muted-foreground">Available: {hoveredAvailability.join(", ")}</p>
        </div>
      )}
    </div>
  )
}
