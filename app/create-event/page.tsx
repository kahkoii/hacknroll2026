"use client"

import { useState } from "react"
import { CreateEventForm } from "@/components/create-event-form"
import { InviteList } from "@/components/invite-list"
import { CalendarDays, Sparkles } from "lucide-react"

export interface Invite {
  id: string
  email: string
  status: "pending" | "accepted" | "declined"
}

interface CreateEvent {
  id: string
  title: string
  date: string
  time?: string
  invites: Invite[]
}

export default function HeroSection() {
  const [events, setEvents] = useState<CreateEvent[]>([])
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null)
  const [showForm, setShowForm] = useState(true)

  const handleCreateEvent = (title: string, date: string, time?: string) => {
    const newEvent: Event = {
      id: crypto.randomUUID(),
      title,
      date,
      time,
      invites: [],
    }
    setEvents((prev) => [...prev, newEvent])
    setCurrentEvent(newEvent)
  }

  const handleAddInvite = (email: string) => {
    if (!currentEvent) return

    const newInvite: Invite = {
      id: crypto.randomUUID(),
      email,
      status: "pending",
    }

    const updatedEvent = {
      ...currentEvent,
      invites: [...currentEvent.invites, newInvite],
    }

    setCurrentEvent(updatedEvent)
    setEvents((prev) => prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)))
  }

  const handleRemoveInvite = (inviteId: string) => {
    if (!currentEvent) return

    const updatedEvent = {
      ...currentEvent,
      invites: currentEvent.invites.filter((i) => i.id !== inviteId),
    }

    setCurrentEvent(updatedEvent)
    setEvents((prev) => prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)))
  }

  const handleUpdateInviteStatus = (inviteId: string, status: Invite["status"]) => {
    if (!currentEvent) return

    const updatedEvent = {
      ...currentEvent,
      invites: currentEvent.invites.map((i) => (i.id === inviteId ? { ...i, status } : i)),
    }

    setCurrentEvent(updatedEvent)
    setEvents((prev) => prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)))
  }

  const handleNewEvent = () => {
    setCurrentEvent(null)
    setShowForm(true)
  }

  return (
    <div className="flex min-h-screen items-start justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <header className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
            <CalendarDays className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {currentEvent ? "Manage Your Event" : "Create New Event"}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            {currentEvent
              ? "Invite attendees and track their responses"
              : "Fill in the details below to set up your event"}
          </p>
        </header>

        <div className="space-y-6">
          {/* Event Details Card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                1
              </span>
              <h2 className="text-lg font-semibold text-card-foreground">Event Details</h2>
            </div>
            <CreateEventForm onCreateEvent={handleCreateEvent} currentEvent={currentEvent} onNewEvent={handleNewEvent} />
          </div>

          {currentEvent && (
            <>
              {/* Invite Attendees Card */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                    2
                  </span>
                  <h2 className="text-lg font-semibold text-card-foreground">Invite Attendees</h2>
                </div>
                <InviteList
                  invites={currentEvent.invites}
                  onAddInvite={handleAddInvite}
                  onRemoveInvite={handleRemoveInvite}
                  onUpdateStatus={handleUpdateInviteStatus}
                />
              </div>

              {/* Event Summary Card */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-card-foreground">Event Summary</h3>
                </div>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Title</dt>
                    <dd className="mt-1 font-semibold text-foreground">{currentEvent.title}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Date</dt>
                    <dd className="mt-1 text-foreground">
                      {new Date(currentEvent.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </dd>
                  </div>
                  {currentEvent.time && (
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Time</dt>
                      <dd className="mt-1 text-foreground">{currentEvent.time}</dd>
                    </div>
                  )}
                  <div className="border-t border-border pt-4">
                    <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Invitations</dt>
                    <dd className="mt-3 flex gap-6">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground"></span>
                        <span className="text-muted-foreground">Pending</span>
                        <span className="font-semibold text-foreground">
                          {currentEvent.invites.filter((i) => i.status === "pending").length}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="h-2.5 w-2.5 rounded-full bg-success"></span>
                        <span className="text-muted-foreground">Accepted</span>
                        <span className="font-semibold text-foreground">
                          {currentEvent.invites.filter((i) => i.status === "accepted").length}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="h-2.5 w-2.5 rounded-full bg-destructive"></span>
                        <span className="text-muted-foreground">Declined</span>
                        <span className="font-semibold text-foreground">
                          {currentEvent.invites.filter((i) => i.status === "declined").length}
                        </span>
                      </div>
                    </dd>
                  </div>
                </dl>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
