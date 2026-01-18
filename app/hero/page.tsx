'use client';

import React from 'react';
import { Calendar, Users, Clock, Star, CheckCircle, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className='min-h-full bg-gradient-to-b from-white to-gray-50'>
      {/* Hero Section */}
      <section className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
        <div className='text-center'>
          <h1 className='mb-6 text-5xl font-bold text-gray-900 sm:text-6xl lg:text-7xl'>
            Organize Events,
            <span className='block text-[#008f4a]'>Build Communities</span>
          </h1>
          <p className='mx-auto mb-10 max-w-2xl text-lg text-gray-600 sm:text-xl'>
            The modern platform for managing events, connecting with friends,
            and building meaningful social connections.
          </p>
          <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
            <button className='w-full rounded-full bg-[#008f4a] px-8 py-4 text-lg font-semibold text-white transition hover:bg-[#007a3f] sm:w-auto'>
              Get Started Free
            </button>
            <button className='w-full rounded-full border-2 border-gray-300 bg-white px-8 py-4 text-lg font-semibold text-gray-900 transition hover:border-gray-400 sm:w-auto'>
              Learn More
            </button>
          </div>
        </div>

        {/* Hero Image Placeholder */}
        <div className='mt-16 overflow-hidden rounded-2xl bg-gradient-to-br from-[#008f4a] to-[#6c47ff] p-1 shadow-2xl'>
          <div className='rounded-xl bg-white p-8'>
            <div className='grid gap-4 md:grid-cols-3'>
              <div className='rounded-lg bg-gray-50 p-6'>
                <div className='mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100'>
                  <Calendar className='h-6 w-6 text-blue-600' />
                </div>
                <h3 className='mb-2 font-semibold text-gray-900'>5 Events</h3>
                <p className='text-sm text-gray-600'>Upcoming this week</p>
              </div>
              <div className='rounded-lg bg-gray-50 p-6'>
                <div className='mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100'>
                  <Users className='h-6 w-6 text-purple-600' />
                </div>
                <h3 className='mb-2 font-semibold text-gray-900'>48 Friends</h3>
                <p className='text-sm text-gray-600'>In your network</p>
              </div>
              <div className='rounded-lg bg-gray-50 p-6'>
                <div className='mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100'>
                  <Star className='h-6 w-6 text-green-600' />
                </div>
                <h3 className='mb-2 font-semibold text-gray-900'>85/100</h3>
                <p className='text-sm text-gray-600'>Social credit score</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='bg-white py-16'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-4xl font-bold text-gray-900'>
              Everything you need to stay connected
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-gray-600'>
              Powerful features designed to help you organize events and
              strengthen your social connections.
            </p>
          </div>

          <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
            <div className='rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-md'>
              <div className='mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-blue-100'>
                <Calendar className='h-7 w-7 text-blue-600' />
              </div>
              <h3 className='mb-3 text-xl font-semibold text-gray-900'>
                Smart Event Planning
              </h3>
              <p className='text-gray-600'>
                Create and manage events effortlessly with our intuitive
                interface. Schedule meetings, parties, and gatherings in
                seconds.
              </p>
            </div>

            <div className='rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-md'>
              <div className='mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-purple-100'>
                <Users className='h-7 w-7 text-purple-600' />
              </div>
              <h3 className='mb-3 text-xl font-semibold text-gray-900'>
                Friend Groups
              </h3>
              <p className='text-gray-600'>
                Organize your social circles into groups. Keep your work
                friends, family, and hobby groups all in one place.
              </p>
            </div>

            <div className='rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-md'>
              <div className='mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-green-100'>
                <Star className='h-7 w-7 text-green-600' />
              </div>
              <h3 className='mb-3 text-xl font-semibold text-gray-900'>
                Social Credit Score
              </h3>
              <p className='text-gray-600'>
                Track your community engagement and build your reputation as a
                reliable and active member of your social circles.
              </p>
            </div>

            <div className='rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-md'>
              <div className='mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-orange-100'>
                <Clock className='h-7 w-7 text-orange-600' />
              </div>
              <h3 className='mb-3 text-xl font-semibold text-gray-900'>
                Real-time Updates
              </h3>
              <p className='text-gray-600'>
                Stay informed with instant notifications about event changes,
                RSVPs, and important updates from your groups.
              </p>
            </div>

            <div className='rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-md'>
              <div className='mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-pink-100'>
                <CheckCircle className='h-7 w-7 text-pink-600' />
              </div>
              <h3 className='mb-3 text-xl font-semibold text-gray-900'>
                Easy RSVP Management
              </h3>
              <p className='text-gray-600'>
                Track who&apos;s coming, who&apos;s not, and manage attendance
                for all your events with simple, powerful tools.
              </p>
            </div>

            <div className='rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-md'>
              <div className='mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-indigo-100'>
                <Zap className='h-7 w-7 text-indigo-600' />
              </div>
              <h3 className='mb-3 text-xl font-semibold text-gray-900'>
                Quick Actions
              </h3>
              <p className='text-gray-600'>
                Save time with smart shortcuts and templates. Create recurring
                events and duplicate past successful gatherings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='bg-gradient-to-r from-[#008f4a] to-[#6c47ff] py-16 text-white'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='grid gap-8 md:grid-cols-3'>
            <div className='text-center'>
              <div className='mb-2 text-5xl font-bold'>10,000+</div>
              <div className='text-lg text-white/90'>Events Created</div>
            </div>
            <div className='text-center'>
              <div className='mb-2 text-5xl font-bold'>5,000+</div>
              <div className='text-lg text-white/90'>Active Users</div>
            </div>
            <div className='text-center'>
              <div className='mb-2 text-5xl font-bold'>50,000+</div>
              <div className='text-lg text-white/90'>Connections Made</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-16'>
        <div className='mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8'>
          <h2 className='mb-6 text-4xl font-bold text-gray-900'>
            Ready to get started?
          </h2>
          <p className='mb-8 text-xl text-gray-600'>
            Join thousands of users who are already building stronger
            communities and organizing amazing events.
          </p>
          <button className='rounded-full bg-[#008f4a] px-10 py-4 text-lg font-semibold text-white transition hover:bg-[#007a3f]'>
            Create Your Free Account
          </button>
        </div>
      </section>
    </div>
  );
}
