"use client"

import { useState } from "react"
import { CreateEventForm } from "./create-event-form"
import { InviteList } from "./invite-list"
import { CalendarDays, Users, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface Invite {
  id: string
  email: string
  status: "pending" | "accepted" | "declined"
}

export interface CreateEvent {
  id: string
  title: string
  date: string
  time?: string
  invites: Invite[]
}

export function EventCreator() {
  const [events, setEvents] = useState<CreateEvent[]>([])
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null)
  const [showForm, setShowForm] = useState(false)

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

  // Landing view with hero and feature cards
  if (!showForm && !currentEvent) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          {/* Icon */}
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-accent">
            <CalendarDays className="h-7 w-7 text-primary" />
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Find the Perfect Time to Meet
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Create an event, share the link, and let everyone mark their availability.
          </p>

          {/* Feature Cards */}
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent">
                <CalendarDays className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-card-foreground">Create Event</h3>
              <p className="mt-1 text-sm text-muted-foreground">Pick your dates and time range</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-card-foreground">Share Link</h3>
              <p className="mt-1 text-sm text-muted-foreground">Invite participants to join</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-card-foreground">Find Time</h3>
              <p className="mt-1 text-sm text-muted-foreground">See overlapping availability</p>
            </div>
          </div>

          {/* CTA Button */}
          <Button size="lg" className="mt-10" onClick={() => setShowForm(true)}>
            <CalendarDays className="mr-2 h-5 w-5" />
            Create New Event
          </Button>
        </div>
      </div>
    )
  }

  // Form view
  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header with back option */}
        <header className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
            <CalendarDays className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {currentEvent ? "Manage Your Event" : "Create New Event"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {currentEvent
              ? "Invite attendees and track their responses"
              : "Fill in the details below to set up your event"}
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left column - Form & Invites */}
          <div className="space-y-8 lg:col-span-3">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-semibold text-primary">
                  1
                </span>
                <h2 className="text-lg font-semibold text-card-foreground">Event Details</h2>
              </div>
              <EventForm onCreateEvent={handleCreateEvent} currentEvent={currentEvent} onNewEvent={handleNewEvent} />
            </div>

            {currentEvent && (
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-6 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-semibold text-primary">
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
            )}
          </div>

          {/* Right column - Summary */}
          {currentEvent && (
            <div className="lg:col-span-2">
              <div className="sticky top-8 rounded-xl border border-border bg-card p-6">
                <h3 className="mb-4 text-lg font-semibold text-card-foreground">Event Summary</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Title</dt>
                    <dd className="mt-1 font-medium text-foreground">{currentEvent.title}</dd>
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
                    <dd className="mt-3 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground"></span>
                          <span className="text-muted-foreground">Pending</span>
                        </span>
                        <span className="font-medium text-foreground">
                          {currentEvent.invites.filter((i) => i.status === "pending").length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-primary"></span>
                          <span className="text-muted-foreground">Accepted</span>
                        </span>
                        <span className="font-medium text-foreground">
                          {currentEvent.invites.filter((i) => i.status === "accepted").length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-destructive"></span>
                          <span className="text-muted-foreground">Declined</span>
                        </span>
                        <span className="font-medium text-foreground">
                          {currentEvent.invites.filter((i) => i.status === "declined").length}
                        </span>
                      </div>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
