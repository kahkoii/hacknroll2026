"use client"

import type { TimeSlot } from "@/app/plan-event/page"
import { Users, Check } from "lucide-react"

type Props = {
  participants: string[]
  currentUser: string
  timeSlots: TimeSlot[]
}

export function ParticipantsList({ participants, currentUser, timeSlots }: Props) {
  const getParticipantAvailability = (name: string) => {
    return timeSlots.filter((slot) => slot.available.includes(name)).length
  }

  const totalSlots = timeSlots.length

  return (
    <div className="bg-card border border-border rounded-2xl p-6 h-fit sticky top-8">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Participants ({participants.length})</h2>
      </div>

      {participants.length === 0 ? (
        <p className="text-sm text-muted-foreground">No one has joined yet. Be the first to mark your availability!</p>
      ) : (
        <div className="space-y-3">
          {participants.map((name) => {
            const slots = getParticipantAvailability(name)
            const percentage = totalSlots > 0 ? Math.round((slots / totalSlots) * 100) : 0
            const isCurrentUser = name === currentUser

            return (
              <div
                key={name}
                className={`p-3 rounded-lg border transition-colors ${
                  isCurrentUser ? "bg-primary/10 border-primary/30" : "bg-muted/30 border-border"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-medium ${isCurrentUser ? "text-primary" : "text-foreground"}`}>
                    {name}
                    {isCurrentUser && <span className="text-xs ml-1">(you)</span>}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {slots}/{totalSlots} slots
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-300" style={{ width: `${percentage}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-border">
        <h3 className="text-sm font-medium text-foreground mb-3">Best Times</h3>
        {getBestTimes(timeSlots, participants.length).length > 0 ? (
          <div className="space-y-2">
            {getBestTimes(timeSlots, participants.length)
              .slice(0, 3)
              .map((slot, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary" />
                  <span className="text-foreground">{formatSlotTime(slot.date, slot.time)}</span>
                  <span className="text-muted-foreground ml-auto">
                    {slot.available.length}/{participants.length}
                  </span>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Add more availability to find best times</p>
        )}
      </div>
    </div>
  )
}

function getBestTimes(timeSlots: TimeSlot[], totalParticipants: number) {
  return timeSlots.filter((slot) => slot.available.length > 0).sort((a, b) => b.available.length - a.available.length)
}

function formatSlotTime(date: string, time: string) {
  const d = new Date(date)
  const hour = Number.parseInt(time.split(":")[0])
  const ampm = hour >= 12 ? "PM" : "AM"
  const hour12 = hour % 12 || 12

  return `${d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} ${hour12}${ampm}`
}
