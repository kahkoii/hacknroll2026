'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Users,
  MoreVertical,
  Plus,
  Search,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EventsPage() {
  const router = useRouter();

  // Initial events data
  const initialEvents = [
    {
      id: 1,
      name: 'Team Strategy Meeting',
      date: 'Jan 25, 2026',
      time: '2:00 PM - 3:30 PM',
      participants: 8,
      status: 'upcoming',
      color: 'bg-blue-500',
    },
    {
      id: 2,
      name: 'Product Launch Planning',
      date: 'Jan 28, 2026',
      time: '10:00 AM - 12:00 PM',
      participants: 15,
      status: 'upcoming',
      color: 'bg-purple-500',
    },
    {
      id: 3,
      name: 'Client Review Session',
      date: 'Jan 30, 2026',
      time: '3:00 PM - 4:00 PM',
      participants: 5,
      status: 'upcoming',
      color: 'bg-green-500',
    },
    {
      id: 4,
      name: 'Quarterly Team Offsite',
      date: 'Feb 5, 2026',
      time: '9:00 AM - 5:00 PM',
      participants: 22,
      status: 'upcoming',
      color: 'bg-orange-500',
    },
    {
      id: 5,
      name: 'Marketing Workshop',
      date: 'Jan 15, 2026',
      time: '1:00 PM - 2:30 PM',
      participants: 12,
      status: 'completed',
      color: 'bg-gray-400',
    },
  ];

  // Initialize with empty arrays/objects for SSR
  const [removedEventIds, setRemovedEventIds] = useState<number[]>([]);
  const [editedEvents, setEditedEvents] = useState<Record<number, any>>({});
  const [events, setEvents] = useState(initialEvents);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isClient, setIsClient] = useState(false);

  // Load data from localStorage only on client side
  useEffect(() => {
    setIsClient(true);
    const savedRemovedIds = localStorage.getItem('removedEventIds');
    const savedEditedEvents = localStorage.getItem('editedEvents');

    if (savedRemovedIds) {
      setRemovedEventIds(JSON.parse(savedRemovedIds));
    }

    if (savedEditedEvents) {
      setEditedEvents(JSON.parse(savedEditedEvents));
    }
  }, []);

  // Update events when removedEventIds or editedEvents change
  useEffect(() => {
    if (!isClient) return;

    let updatedEvents = initialEvents.filter(
      (event) => !removedEventIds.includes(event.id),
    );

    // Apply edits if any
    updatedEvents = updatedEvents.map((event) => {
      if (editedEvents[event.id]) {
        return { ...event, ...editedEvents[event.id] };
      }
      return event;
    });

    setEvents(updatedEvents);
  }, [removedEventIds, editedEvents, isClient]);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!isClient) return;

    localStorage.setItem('removedEventIds', JSON.stringify(removedEventIds));
    localStorage.setItem('editedEvents', JSON.stringify(editedEvents));
  }, [removedEventIds, editedEvents, isClient]);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || event.status === filter;
    return matchesSearch && matchesFilter;
  });

  const upcomingCount = events.filter((e) => e.status === 'upcoming').length;
  const completedCount = events.filter((e) => e.status === 'completed').length;

  // Function to restore event
  const restoreEvent = (eventId: number) => {
    setRemovedEventIds((prev) => prev.filter((id) => id !== eventId));
  };

  const handleEventClick = (eventId: number) => {
    router.push(`/events/${eventId}`);
  };

  // Don't render conditionally based on localStorage until client-side
  if (!isClient) {
    return (
      <div className='min-h-full bg-gray-50'>
        <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
          <div className='mb-8'>
            <h1 className='mb-2 text-3xl font-bold text-gray-900'>My Events</h1>
            <p className='text-gray-600'>
              Manage and organize all your upcoming meetings and events
            </p>
          </div>
          <div className='animate-pulse space-y-4'>
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className='rounded-lg border border-gray-200 bg-white p-6'
              >
                <div className='flex items-start justify-between'>
                  <div className='flex flex-1 items-start gap-4'>
                    <div className='h-16 w-2 rounded-full bg-gray-200'></div>
                    <div className='flex-1 space-y-2'>
                      <div className='h-6 w-3/4 rounded bg-gray-200'></div>
                      <div className='h-4 w-1/2 rounded bg-gray-200'></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-full bg-gray-50'>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        {/* Page Title & Stats */}
        <div className='mb-8'>
          <h1 className='mb-2 text-3xl font-bold text-gray-900'>My Events</h1>
          <p className='text-gray-600'>
            Manage and organize all your upcoming meetings and events
          </p>

          {/* Show restoration banner only for Team Strategy Meeting when removed */}
          {removedEventIds.includes(1) && (
            <div className='mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-100'>
                    <Calendar className='h-5 w-5 text-blue-600' />
                  </div>
                  <div>
                    <p className='font-medium text-blue-800'>
                      Team Strategy Meeting has been left
                    </p>
                    <p className='text-sm text-blue-600'>
                      You can restore it from the event details page
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => restoreEvent(1)}
                  className='rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700'
                >
                  Restore Event
                </button>
              </div>
            </div>
          )}

          <div className='mt-6 grid grid-cols-1 gap-4 md:grid-cols-3'>
            <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-600'>Total Events</p>
                  <p className='mt-1 text-3xl font-bold text-gray-900'>
                    {events.length}
                  </p>
                </div>
                <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-green-100'>
                  <Calendar className='h-6 w-6 text-green-600' />
                </div>
              </div>
            </div>

            <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-600'>Upcoming</p>
                  <p className='mt-1 text-3xl font-bold text-gray-900'>
                    {upcomingCount}
                  </p>
                </div>
                <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-green-100'>
                  <Clock className='h-6 w-6 text-green-600' />
                </div>
              </div>
            </div>

            <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-600'>Completed</p>
                  <p className='mt-1 text-3xl font-bold text-gray-900'>
                    {completedCount}
                  </p>
                </div>
                <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100'>
                  <Users className='h-6 w-6 text-gray-600' />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className='mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
          <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
            <div className='relative w-full flex-1 sm:w-auto'>
              <Search className='absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400' />
              <input
                type='text'
                placeholder='Search events...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:ring-2 focus:ring-[#6c47ff] focus:outline-none'
              />
            </div>

            <div className='flex w-full gap-2 sm:w-auto'>
              <button
                onClick={() => setFilter('all')}
                className={`rounded-lg px-4 py-2 font-medium transition ${
                  filter === 'all'
                    ? 'bg-[#008f4a] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('upcoming')}
                className={`rounded-lg px-4 py-2 font-medium transition ${
                  filter === 'upcoming'
                    ? 'bg-[#008f4a] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`rounded-lg px-4 py-2 font-medium transition ${
                  filter === 'completed'
                    ? 'bg-[#008f4a] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Completed
              </button>
            </div>
            <button
              onClick={() => router.push('/create-event')}
              className='inline-flex items-center justify-center rounded-md bg-[#008f4a] px-4 py-2 font-medium text-white transition hover:bg-[#007a3f]'
            >
              New Event
            </button>
          </div>
        </div>

        {/* Events List */}
        <div className='space-y-4'>
          {filteredEvents.length === 0 ? (
            <div className='rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm'>
              <Calendar className='mx-auto mb-4 h-16 w-16 text-gray-300' />
              <h3 className='mb-2 text-xl font-semibold text-gray-900'>
                No events found
              </h3>
              <p className='mb-6 text-gray-600'>
                {searchTerm
                  ? 'Try adjusting your search'
                  : 'Get started by creating your first event'}
              </p>
              <button
                onClick={() => router.push('/create-event')}
                className='inline-flex items-center gap-2 rounded-lg bg-[#6c47ff] px-6 py-2 font-medium text-white transition hover:bg-[#5639cc]'
              >
                <Plus className='h-5 w-5' />
                Create Event
              </button>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => handleEventClick(event.id)}
                className='cursor-pointer rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md'
              >
                <div className='flex items-start justify-between'>
                  <div className='flex flex-1 items-start gap-4'>
                    <div
                      className={`h-16 w-2 rounded-full ${event.color}`}
                    ></div>
                    <div className='flex-1'>
                      <div className='mb-2 flex items-center gap-3'>
                        <h3 className='text-xl font-semibold text-gray-900'>
                          {event.name}
                          {editedEvents[event.id] && (
                            <span className='ml-2 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700'>
                              Edited
                            </span>
                          )}
                        </h3>
                        {event.status === 'completed' && (
                          <span className='rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600'>
                            Completed
                          </span>
                        )}
                      </div>
                      <div className='flex flex-wrap gap-4 text-gray-600'>
                        <div className='flex items-center gap-2'>
                          <Calendar className='h-4 w-4' />
                          <span>{event.date}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Clock className='h-4 w-4' />
                          <span>{event.time}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Users className='h-4 w-4' />
                          <span>{event.participants} participants</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Only show menu for other events
                    }}
                    className='rounded-lg p-2 transition hover:bg-gray-100'
                  >
                    <MoreVertical className='h-5 w-5 text-gray-600' />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
