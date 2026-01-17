"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Invite } from "./event-creator"
import { Mail, X, UserPlus } from "lucide-react"

interface InviteListProps {
  invites: Invite[]
  onAddInvite: (email: string) => void
  onRemoveInvite: (inviteId: string) => void
  onUpdateStatus: (inviteId: string, status: Invite["status"]) => void
}

export function InviteList({ invites, onAddInvite, onRemoveInvite, onUpdateStatus }: InviteListProps) {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleAddInvite = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email.trim()) {
      setError("Email is required")
      return
    }

    if (!validateEmail(email.trim())) {
      setError("Please enter a valid email address")
      return
    }

    if (invites.some((i) => i.email.toLowerCase() === email.toLowerCase())) {
      setError("This email has already been invited")
      return
    }

    onAddInvite(email.trim())
    setEmail("")
  }

  const getStatusStyles = (status: Invite["status"]) => {
    switch (status) {
      case "pending":
        return "bg-muted text-muted-foreground"
      case "accepted":
        return "bg-success/20 text-success"
      case "declined":
        return "bg-destructive/20 text-destructive"
    }
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleAddInvite} className="space-y-3">
        <Label htmlFor="email" className="text-sm font-medium text-foreground">
          Email Address
        </Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="Enter email to invite"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-input pl-10"
            />
          </div>
          <Button type="submit">
            <UserPlus className="mr-2 h-4 w-4" />
            Add
          </Button>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </form>

      {invites.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Invited ({invites.length})</h4>
          <ul className="divide-y divide-border rounded-xl border border-border overflow-hidden">
            {invites.map((invite) => (
              <li key={invite.id} className="flex items-center justify-between gap-4 bg-secondary/50 p-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary uppercase">
                    {invite.email[0]}
                  </div>
                  <span className="truncate text-sm text-foreground">{invite.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={invite.status}
                    onChange={(e) => onUpdateStatus(invite.id, e.target.value as Invite["status"])}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium cursor-pointer border-0 focus:outline-none focus:ring-2 focus:ring-ring ${getStatusStyles(invite.status)}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="declined">Declined</option>
                  </select>
                  <button
                    onClick={() => onRemoveInvite(invite.id)}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    aria-label={`Remove ${invite.email}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {invites.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-secondary/30 p-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <p className="text-sm font-medium text-foreground">No invites yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Add email addresses above to invite attendees.</p>
        </div>
      )}
    </div>
  )
}
