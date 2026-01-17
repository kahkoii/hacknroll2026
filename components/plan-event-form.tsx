"use client"

import type React from "react"

import { useState } from "react"
import { Calendar } from "lucide-react"
import { format, addDays, startOfWeek, isSameDay } from "date-fns"

type Props = {
  onSubmit: (event: {
    name: string
    dates: string[]
    startTime: string
    endTime: string
  }) => void
}

export function CreateEventForm({ onSubmit }: Props) {
  const [name, setName] = useState("")
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("17:00")
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const handleDateClick = (date: Date) => {
    setSelectedDates((prev) => {
      const isSelected = prev.some((d) => isSameDay(d, date))
      if (isSelected) {
        return prev.filter((d) => !isSameDay(d, date))
      }
      return [...prev, date].sort((a, b) => a.getTime() - b.getTime())
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || selectedDates.length === 0) return

    onSubmit({
      name: name.trim(),
      dates: selectedDates.map((d) => format(d, "yyyy-MM-dd")),
      startTime,
      endTime,
    })
  }

  const renderCalendar = () => {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const weekStart = startOfWeek(monthStart)
    const days = []

    for (let i = 0; i < 42; i++) {
      const day = addDays(weekStart, i)
      const isCurrentMonth = day.getMonth() === currentMonth.getMonth()
      const isSelected = selectedDates.some((d) => isSameDay(d, day))
      const isPast = day < new Date(new Date().setHours(0, 0, 0, 0))

      days.push(
        <button
          key={i}
          type="button"
          disabled={isPast}
          onClick={() => handleDateClick(day)}
          className={`
            aspect-square flex items-center justify-center text-sm rounded-lg transition-all
            ${!isCurrentMonth ? "text-muted-foreground/40" : ""}
            ${isPast ? "text-muted-foreground/30 cursor-not-allowed" : "hover:bg-muted cursor-pointer"}
            ${isSelected ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}
          `}
        >
          {day.getDate()}
        </button>,
      )
    }

    return days
  }

  const timeOptions = []
  for (let i = 0; i < 24; i++) {
    const time = `${i.toString().padStart(2, "0")}:00`
    timeOptions.push(
      <option key={time} value={time}>
        {format(new Date(`2000-01-01T${time}`), "h:mm a")}
      </option>,
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6">
      <div className="mb-4">
        <label htmlFor="event-name" className="block text-sm font-medium text-foreground mb-1.5">
          Event Name
        </label>
        <input
          id="event-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Team Meeting, Group Picnic, etc."
          className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-foreground mb-2">Select Dates</label>
        <div className="border border-border rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className="p-1.5 hover:bg-muted rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="font-medium text-foreground text-sm">{format(currentMonth, "MMMM yyyy")}</span>
            <button
              type="button"
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              className="p-1.5 hover:bg-muted rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-7 gap-0.5 mb-1">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0.5">{renderCalendar()}</div>
        </div>
        {selectedDates.length > 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            {selectedDates.length} date{selectedDates.length > 1 ? "s" : ""} selected
          </p>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        <div>
          <label htmlFor="start-time" className="block text-sm font-medium text-foreground mb-1.5">
            Start Time
          </label>
          <select
            id="start-time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          >
            {timeOptions}
          </select>
        </div>
        <div>
          <label htmlFor="end-time" className="block text-sm font-medium text-foreground mb-1.5">
            End Time
          </label>
          <select
            id="end-time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          >
            {timeOptions}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={!name.trim() || selectedDates.length === 0}
        className="w-full hover:cursor-pointer px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Calendar className="w-4 h-4" />
        Create Event
      </button>
    </form>
  )
}
