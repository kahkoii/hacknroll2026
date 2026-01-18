'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Bell, Check, X } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useUser } from '@clerk/nextjs';

interface IncomingInvite {
  id: string
  eventTitle: string
  eventDate: string
  eventTime?: string
  fromEmail: string
  toEmail: string
}

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [pendingInvites, setPendingInvites] = useState<IncomingInvite[]>([
    {
      id: "demo-1",
      eventTitle: "Team Standup Meeting",
      eventDate: "2026-02-01",
      eventTime: "10:00",
      fromEmail: "alice@example.com",
      toEmail: "bob@example.com",
    },
    {
      id: "demo-2",
      eventTitle: "Product Launch Party",
      eventDate: "2026-02-15",
      fromEmail: "bob@example.com",
      toEmail: "bob@example.com",
    },
  ])
  const { isLoaded, isSignedIn, user } = useUser()

  async function fetchInvites(): Promise<IncomingInvite[]> {
    if (!isLoaded || !isSignedIn) return []
    // TODO
    return pendingInvites;
  }

  async function onAcceptInvite(inviteId: string) {
    console.log(`TODO: ${user?.primaryEmailAddress?.emailAddress} Accepted invite ${inviteId}`)
  }

  async function onDeclineInvite(inviteId: string) {
    console.log(`TODO: Declined invite ${inviteId}`)
  }

  useEffect(() => {
    fetchInvites()
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    } 
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [pendingInvites])

  return (
    <nav className='bg-background flex items-center justify-between px-6 py-4'>
      <div className='flex items-center gap-2'>
        <Button variant={pathname === '/' ? 'default' : 'ghost'} asChild>
          <Link href='/'>Events</Link>
        </Button>
        <Button
          variant={pathname === '/plan-event' ? 'default' : 'ghost'}
          asChild
        >
          <Link href='/plan-event'>Planner</Link>
        </Button>
        <Button variant={pathname === '/profile' ? 'default' : 'ghost'} asChild>
          <Link href='/profile'>Profile</Link>
        </Button>

        { (isLoaded && isSignedIn) && (
        <div className="relative" ref={dropdownRef}>
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-muted-foreground" />
            {pendingInvites.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                {pendingInvites.length}
              </span>
            )}
          </Button>
          

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-border bg-card shadow-lg">
              <div className="border-b border-border px-4 py-3">
                <h3 className="font-semibold text-card-foreground">Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  {pendingInvites.length > 0
                    ? `You have ${pendingInvites.length} pending invite${pendingInvites.length > 1 ? "s" : ""}`
                    : "No pending invites"}
                </p>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {pendingInvites.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">No invites yet</div>
                ) : (
                  <ul className="divide-y divide-border">
                    {pendingInvites.map((invite) => (
                      <li key={invite.id} className="px-4 py-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-card-foreground">{invite.eventTitle}</p>
                            <p className="mt-0.5 text-sm text-muted-foreground">
                              {new Date(invite.eventDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                              {invite.eventTime && ` at ${invite.eventTime}`}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">From: {invite.fromEmail}</p>
                          </div>

                            <div className="flex shrink-0 gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-primary hover:bg-primary/10 hover:text-primary hover:cursor-pointer"
                                onClick={() => onAcceptInvite(invite.id)}
                                aria-label="Accept invite"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive hover:cursor-pointer"
                                onClick={() => onDeclineInvite(invite.id)}
                                aria-label="Decline invite"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
        )}
      </div>
    </nav>
  );
}
