"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, CalendarDays } from "lucide-react"

interface Invite {
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

interface CreateEventFormProps {
  onCreateEvent: (title: string, date: string, time?: string) => void
  currentEvent: CreateEvent | null
  onNewEvent: () => void
}


export function CreateEventForm({ onCreateEvent, currentEvent, onNewEvent }: CreateEventFormProps) {
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [errors, setErrors] = useState<{ title?: string; date?: string }>({})

  const validate = () => {
    const newErrors: { title?: string; date?: string } = {}
    if (!title.trim()) {
      newErrors.title = "Event title is required"
    }
    if (!date) {
      newErrors.date = "Event date is required"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    onCreateEvent(title.trim(), date, time || undefined)
    setTitle("")
    setDate("")
    setTime("")
    setErrors({})
  }

  if (currentEvent) {
    return (
      <div className="rounded-xl bg-success/10 p-5 ring-1 ring-success/20">
        <div className="flex items-center gap-3 text-success">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success">
            <Check className="h-4 w-4 text-success-foreground" />
          </div>
          <span className="font-semibold">Event created successfully</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Your event &ldquo;{currentEvent.title}&rdquo; is ready. Add invites below or create another event.
        </p>
        <Button variant="outline" className="mt-4 bg-transparent" onClick={onNewEvent}>
          <CalendarDays className="mr-2 h-4 w-4" />
          Create Another Event
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium text-foreground">
          Event Title <span className="text-primary">*</span>
        </Label>
        <Input
          id="title"
          type="text"
          placeholder="Enter event title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-input"
        />
        {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="date" className="text-sm font-medium text-foreground">
          Date <span className="text-primary">*</span>
        </Label>
        <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-input" />
        {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="time" className="text-sm font-medium text-foreground">
          Time <span className="text-muted-foreground font-normal">(Optional)</span>
        </Label>
        <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className="bg-input" />
      </div>

      <Button type="submit" className="w-full">
        <CalendarDays className="mr-2 h-4 w-4" />
        Create Event
      </Button>
    </form>
  )
}
