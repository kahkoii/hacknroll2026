"use client"

import { useState } from "react"
import { CreateEventForm } from "@/components/plan-event-form"
import { AvailabilityGrid } from "@/components/availability-grid"
import { ParticipantsList } from "@/components/participants-list"
import { EventHeader } from "@/components/event-header"
import { Calendar, Users, Clock } from "lucide-react"

export type TimeSlot = {
  date: string
  time: string
  available: string[]
}

export type Event = {
  id: string
  name: string
  dates: string[]
  startTime: string
  endTime: string
  timeSlots: TimeSlot[]
  participants: string[]
}

export default function Home() {
  const [event, setEvent] = useState<Event | null>(null)
  const [currentUser, setCurrentUser] = useState<string>("")
  const [isJoining, setIsJoining] = useState(false)

  const handleCreateEvent = (newEvent: Omit<Event, "id" | "timeSlots" | "participants">) => {
    const timeSlots: TimeSlot[] = []
    const startHour = Number.parseInt(newEvent.startTime.split(":")[0])
    const endHour = Number.parseInt(newEvent.endTime.split(":")[0])

    newEvent.dates.forEach((date) => {
      for (let hour = startHour; hour < endHour; hour++) {
        timeSlots.push({
          date,
          time: `${hour.toString().padStart(2, "0")}:00`,
          available: [],
        })
      }
    })

    setEvent({
      ...newEvent,
      id: Math.random().toString(36).substring(7),
      timeSlots,
      participants: [],
    })
  }

  const handleJoinEvent = (name: string) => {
    if (!event || !name.trim()) return
    setCurrentUser(name.trim())
    if (!event.participants.includes(name.trim())) {
      setEvent({
        ...event,
        participants: [...event.participants, name.trim()],
      })
    }
    setIsJoining(false)
  }

  const handleToggleAvailability = (date: string, time: string) => {
    if (!event || !currentUser) return

    setEvent({
      ...event,
      timeSlots: event.timeSlots.map((slot) => {
        if (slot.date === date && slot.time === time) {
          const isAvailable = slot.available.includes(currentUser)
          return {
            ...slot,
            available: isAvailable
              ? slot.available.filter((name) => name !== currentUser)
              : [...slot.available, currentUser],
          }
        }
        return slot
      }),
    })
  }

  const handleBulkToggle = (slots: { date: string; time: string }[], adding: boolean) => {
    if (!event || !currentUser) return

    setEvent({
      ...event,
      timeSlots: event.timeSlots.map((slot) => {
        const isInSelection = slots.some((s) => s.date === slot.date && s.time === slot.time)
        if (isInSelection) {
          const isAvailable = slot.available.includes(currentUser)
          if (adding && !isAvailable) {
            return { ...slot, available: [...slot.available, currentUser] }
          } else if (!adding && isAvailable) {
            return { ...slot, available: slot.available.filter((name) => name !== currentUser) }
          }
        }
        return slot
      }),
    })
  }

  if (!event) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 mb-3">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-1 text-balance">Find the Perfect Time to Meet</h1>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto text-pretty">
              Create an event, share the link, and let everyone mark their availability.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-3 mb-6">
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-medium text-foreground text-sm mb-1">Create Event</h3>
              <p className="text-xs text-muted-foreground">Pick your dates and time range</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-medium text-foreground text-sm mb-1">Share Link</h3>
              <p className="text-xs text-muted-foreground">Invite participants to join</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-medium text-foreground text-sm mb-1">Find Time</h3>
              <p className="text-xs text-muted-foreground">See overlapping availability</p>
            </div>
          </div>

          <CreateEventForm onSubmit={handleCreateEvent} />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <EventHeader event={event} currentUser={currentUser} onJoin={() => setIsJoining(true)} />

        {isJoining || !currentUser ? (
          <JoinDialog onJoin={handleJoinEvent} onCancel={() => setIsJoining(false)} />
        ) : (
          <div className="grid lg:grid-cols-[1fr_280px] gap-8">
            <AvailabilityGrid
              event={event}
              currentUser={currentUser}
              onToggle={handleToggleAvailability}
              onBulkToggle={handleBulkToggle}
            />
            <ParticipantsList participants={event.participants} currentUser={currentUser} timeSlots={event.timeSlots} />
          </div>
        )}
      </div>
    </main>
  )
}

function JoinDialog({
  onJoin,
  onCancel,
}: {
  onJoin: (name: string) => void
  onCancel: () => void
}) {
  const [name, setName] = useState("")

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full shadow-lg">
        <h2 className="text-2xl font-bold text-foreground mb-2">Join Event</h2>
        <p className="text-muted-foreground mb-6">Enter your name to mark your availability</p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring mb-4"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter" && name.trim()) {
              onJoin(name)
            }
          }}
        />
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onJoin(name)}
            disabled={!name.trim()}
            className="flex-1 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  )
}
