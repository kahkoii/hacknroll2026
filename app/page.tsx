'use client';

import React, { useState } from 'react';
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

  const [events] = useState([
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
  ]);

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || event.status === filter;
    return matchesSearch && matchesFilter;
  });

  const upcomingCount = events.filter((e) => e.status === 'upcoming').length;
  const completedCount = events.filter((e) => e.status === 'completed').length;

  // Add this function to handle event click
  const handleEventClick = (eventId: number) => {
    router.push(`/events/${eventId}`);
  };

  return (
    <div className='min-h-full bg-gray-50'>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        {/* Page Title & Stats */}
        <div className='mb-8'>
          <h1 className='mb-2 text-3xl font-bold text-gray-900'>My Events</h1>
          <p className='text-gray-600'>
            Manage and organize all your upcoming meetings and events
          </p>

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
                      // Handle menu click
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
