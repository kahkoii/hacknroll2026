'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  ArrowLeft,
  Edit,
  Trash2,
  Video,
  Undo2,
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

// Define types
interface Attendee {
  name: string;
  email: string;
  status: 'accepted' | 'pending' | 'declined';
}

interface Event {
  id: number;
  name: string;
  date: string;
  time: string;
  participants: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  color: string;
  location: string;
  description: string;
  organizer: string;
  attendees: Attendee[];
  agenda: string[];
  meetingLink?: string;
}

// This would typically fetch data from your API/database
const getEventDetails = (id: string | string[] | undefined): Event => {
  const events: Record<string, Event> = {
    '1': {
      id: 1,
      name: 'Team Strategy Meeting',
      date: 'Jan 25, 2026',
      time: '2:00 PM - 3:30 PM',
      participants: 8,
      status: 'upcoming',
      color: 'bg-blue-500',
      location: 'Conference Room B, 3rd Floor',
      description:
        'Quarterly strategy discussion to align on key priorities and objectives for Q1 2026. We will review progress from last quarter and set goals for the upcoming period.',
      organizer: 'Sarah Johnson',
      attendees: [
        { name: 'John Doe', email: 'john@example.com', status: 'accepted' },
        { name: 'Jane Smith', email: 'jane@example.com', status: 'accepted' },
        { name: 'Mike Wilson', email: 'mike@example.com', status: 'pending' },
        { name: 'Emily Brown', email: 'emily@example.com', status: 'accepted' },
        { name: 'David Lee', email: 'david@example.com', status: 'accepted' },
        { name: 'Lisa Chen', email: 'lisa@example.com', status: 'declined' },
        { name: 'Tom Anderson', email: 'tom@example.com', status: 'accepted' },
        {
          name: 'Rachel Green',
          email: 'rachel@example.com',
          status: 'pending',
        },
      ],
      agenda: [
        'Review Q4 2025 performance',
        'Discuss Q1 2026 objectives',
        'Team capacity planning',
        'Budget allocation review',
      ],
      meetingLink: 'https://meet.example.com/team-strategy',
    },
    '2': {
      id: 2,
      name: 'Product Launch Planning',
      date: 'Jan 28, 2026',
      time: '10:00 AM - 12:00 PM',
      participants: 15,
      status: 'upcoming',
      color: 'bg-purple-500',
      location: 'Executive Boardroom',
      description:
        'Strategic planning session for the upcoming product launch. We will finalize the go-to-market strategy and assign responsibilities.',
      organizer: 'Michael Chen',
      attendees: [
        { name: 'Alex Johnson', email: 'alex@example.com', status: 'accepted' },
        {
          name: 'Sarah Williams',
          email: 'sarah@example.com',
          status: 'accepted',
        },
      ],
      agenda: [
        'Marketing strategy review',
        'Launch timeline confirmation',
        'Resource allocation',
      ],
      meetingLink: 'https://meet.example.com/product-launch',
    },
  };

  // Handle the case where id could be string, string[], or undefined
  const eventId = Array.isArray(id) ? id[0] || '1' : id || '1';
  return events[eventId] || events['1'];
};

export default function EventDetailsPage() {
  const router = useRouter();
  const params = useParams();

  // State for leave modal
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveReason, setLeaveReason] = useState('');

  // State for tracking removed events
  const [removedEventIds, setRemovedEventIds] = useState<number[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Get event ID safely
  const eventId = params?.id;
  const event = getEventDetails(eventId);

  // Check if this event is currently removed
  const [isEventRemoved, setIsEventRemoved] = useState(false);

  // Load removedEventIds from localStorage on client side
  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('removedEventIds');
    if (saved) {
      const parsedIds = JSON.parse(saved);
      setRemovedEventIds(parsedIds);
      setIsEventRemoved(parsedIds.includes(event.id));
    }
  }, [event.id]);

  // Update isEventRemoved when removedEventIds changes
  useEffect(() => {
    if (isClient) {
      setIsEventRemoved(removedEventIds.includes(event.id));
    }
  }, [removedEventIds, event.id, isClient]);

  // Save removedEventIds to localStorage whenever it changes
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('removedEventIds', JSON.stringify(removedEventIds));
    }
  }, [removedEventIds, isClient]);

  const handleGoBack = () => {
    router.push('/');
  };

  const handleEdit = () => {
    if (!isClient) return;

    // Load edited events from localStorage
    const editedEvents = JSON.parse(
      localStorage.getItem('editedEvents') || '{}',
    );

    // For Team Strategy Meeting (id: 1), update with sample edits
    if (event.id === 1) {
      const updates = {
        name: 'Team Strategy Meeting (Updated)',
        date: 'Jan 26, 2026', // Changed date
        time: '3:00 PM - 4:30 PM', // Changed time
        participants: 10, // Updated participant count
      };

      editedEvents[1] = updates;
      localStorage.setItem('editedEvents', JSON.stringify(editedEvents));
    }

    router.push(`/events/${event.id}/edit`);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this event?')) {
      // For Team Strategy Meeting, add to removed events
      if (event.id === 1 && isClient) {
        setRemovedEventIds((prev) => [...prev, event.id]);
      }
      router.push('/');
    }
  };

  const handleLeaveEvent = () => {
    setShowLeaveModal(true);
  };

  const handleCancelLeave = () => {
    setShowLeaveModal(false);
    setLeaveReason('');
  };

  const handleSubmitLeave = () => {
    // For Team Strategy Meeting, remove from events list
    if (event.id === 1 && isClient) {
      setRemovedEventIds((prev) => [...prev, event.id]);
    }

    setShowLeaveModal(false);
    setLeaveReason('');
    router.push('/');
  };

  // New function to restore event
  const handleRestoreEvent = () => {
    if (isClient) {
      setRemovedEventIds((prev) => prev.filter((id) => id !== event.id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'declined':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Show loading state until client-side
  if (!isClient) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <div className='mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8'>
          <div className='animate-pulse'>
            <div className='mb-6'>
              <div className='mb-4 h-6 w-32 rounded bg-gray-200'></div>
              <div className='h-10 w-3/4 rounded bg-gray-200'></div>
            </div>
            <div className='grid gap-6 lg:grid-cols-3'>
              <div className='space-y-6 lg:col-span-2'>
                <div className='h-64 rounded-lg bg-gray-200'></div>
                <div className='h-48 rounded-lg bg-gray-200'></div>
                <div className='h-64 rounded-lg bg-gray-200'></div>
              </div>
              <div className='h-96 rounded-lg bg-gray-200'></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-6'>
          <button
            onClick={handleGoBack}
            className='mb-4 inline-flex items-center gap-2 text-gray-600 transition hover:text-gray-900'
          >
            <ArrowLeft className='h-5 w-5' />
            Back to Events
          </button>

          {/* Show event status banner */}
          {isEventRemoved && event.id === 1 && (
            <div className='mb-6 rounded-lg border border-orange-200 bg-orange-50 p-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-orange-100'>
                    <Calendar className='h-5 w-5 text-orange-600' />
                  </div>
                  <div>
                    <p className='font-medium text-orange-800'>
                      You have left this event
                    </p>
                    <p className='text-sm text-orange-600'>
                      This event is hidden from your events list
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className='flex items-start justify-between'>
            <div className='flex items-start gap-4'>
              <div className={`h-20 w-2 rounded-full ${event.color}`}></div>
              <div>
                <h1 className='mb-2 text-3xl font-bold text-gray-900'>
                  {event.name}
                </h1>
                {event.status === 'completed' && (
                  <span className='rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600'>
                    Completed
                  </span>
                )}
              </div>
            </div>

            <div className='flex gap-2'>
              <button
                onClick={handleEdit}
                className='rounded-lg bg-blue-500 p-2 text-white transition hover:bg-blue-600'
              >
                <Edit className='h-5 w-5' />
              </button>
              <button
                onClick={handleDelete}
                className='rounded-lg bg-red-500 p-2 text-white transition hover:bg-red-600'
              >
                <Trash2 className='h-5 w-5' />
              </button>

              {/* Conditionally show Leave or Restore button */}
              {isEventRemoved ? (
                <button
                  onClick={handleRestoreEvent}
                  className='flex items-center gap-2 rounded-lg bg-green-500 p-2 px-4 text-white transition hover:bg-green-600'
                >
                  <Undo2 className='h-5 w-5' />
                  Restore Event
                </button>
              ) : (
                <button
                  onClick={handleLeaveEvent}
                  className='rounded-lg bg-orange-500 p-2 px-4 text-white transition hover:bg-orange-600'
                >
                  Leave Event
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className='grid gap-6 lg:grid-cols-3'>
          {/* Left Column - Main Details */}
          <div className='space-y-6 lg:col-span-2'>
            {/* Event Details Card */}
            <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
              <h2 className='mb-4 text-xl font-semibold text-gray-900'>
                Event Details
              </h2>
              <div className='space-y-4'>
                <div className='flex items-start gap-3'>
                  <Calendar className='mt-1 h-5 w-5 text-gray-400' />
                  <div>
                    <p className='text-sm text-gray-600'>Date</p>
                    <p className='font-medium text-gray-900'>{event.date}</p>
                  </div>
                </div>

                <div className='flex items-start gap-3'>
                  <Clock className='mt-1 h-5 w-5 text-gray-400' />
                  <div>
                    <p className='text-sm text-gray-600'>Time</p>
                    <p className='font-medium text-gray-900'>{event.time}</p>
                  </div>
                </div>

                <div className='flex items-start gap-3'>
                  <MapPin className='mt-1 h-5 w-5 text-gray-400' />
                  <div>
                    <p className='text-sm text-gray-600'>Location</p>
                    <p className='font-medium text-gray-900'>
                      {event.location}
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-3'>
                  <Users className='mt-1 h-5 w-5 text-gray-400' />
                  <div>
                    <p className='text-sm text-gray-600'>Organizer</p>
                    <p className='font-medium text-gray-900'>
                      {event.organizer}
                    </p>
                  </div>
                </div>

                {event.meetingLink && (
                  <div className='flex items-start gap-3'>
                    <Video className='mt-1 h-5 w-5 text-gray-400' />
                    <div>
                      <p className='text-sm text-gray-600'>Meeting Link</p>
                      <a
                        href={event.meetingLink}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='font-medium text-blue-600 hover:underline'
                      >
                        Join Video Call
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
              <h2 className='mb-4 text-xl font-semibold text-gray-900'>
                Description
              </h2>
              <p className='text-gray-700'>{event.description}</p>
            </div>

            {/* Agenda */}
            <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
              <h2 className='mb-4 text-xl font-semibold text-gray-900'>
                Agenda
              </h2>
              <ul className='space-y-2'>
                {event.agenda.map((item: string, index: number) => (
                  <li key={index} className='flex items-start gap-3'>
                    <span className='mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600'>
                      {index + 1}
                    </span>
                    <span className='text-gray-700'>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column - Attendees */}
          <div className='lg:col-span-1'>
            <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
              <h2 className='mb-4 text-xl font-semibold text-gray-900'>
                Attendees ({event.attendees.length})
              </h2>
              <div className='space-y-3'>
                {event.attendees.map((attendee: Attendee, index: number) => (
                  <div
                    key={index}
                    className='flex items-center justify-between rounded-lg border border-gray-100 p-3'
                  >
                    <div className='flex items-center gap-3'>
                      <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600'>
                        {attendee.name.charAt(0)}
                      </div>
                      <div>
                        <p className='font-medium text-gray-900'>
                          {attendee.name}
                        </p>
                        <p className='text-sm text-gray-500'>
                          {attendee.email}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                        attendee.status,
                      )}`}
                    >
                      {attendee.status}
                    </span>
                  </div>
                ))}
              </div>

              <button className='mt-4 w-full rounded-lg border border-gray-300 py-2 font-medium text-gray-700 transition hover:bg-gray-50'>
                Invite More People
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Leave Event Modal */}
      {showLeaveModal && (
        <div className='bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black'>
          <div className='mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl'>
            <h2 className='mb-4 text-2xl font-bold text-gray-900'>
              Leave Event
            </h2>
            <p className='mb-4 text-gray-600'>
              Are you sure you want to leave &quot;{event.name}&quot;?
            </p>

            {event.id === 1 && (
              <div className='mb-4 rounded-lg bg-blue-50 p-3'>
                <p className='text-sm text-blue-700'>
                  <strong>Note:</strong> This event will be removed from your
                  homepage. You can restore it later from this page.
                </p>
              </div>
            )}

            <textarea
              value={leaveReason}
              onChange={(e) => setLeaveReason(e.target.value)}
              placeholder='Optional: Enter your reason for leaving...'
              className='mb-4 w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none'
              rows={4}
            />

            <div className='flex justify-end gap-3'>
              <button
                onClick={handleCancelLeave}
                className='rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50'
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitLeave}
                className='rounded-lg bg-orange-500 px-4 py-2 font-medium text-white transition hover:bg-orange-600'
              >
                Confirm Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
