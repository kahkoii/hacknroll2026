'use client';

import { useUser } from '@clerk/clerk-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Users, TrendingUp, Star } from 'lucide-react';

// Define types
interface FriendGroup {
  id: number;
  name: string;
  members: number;
  color: string;
}

export default function ProfilePage() {
  const { user, isLoaded } = useUser();

  // Mock data - replace with your actual data source
  const socialCreditScore = 50;
  const friendGroups: FriendGroup[] = [
    { id: 1, name: 'NUS Friends', members: 12, color: 'bg-blue-500' },
    { id: 2, name: 'Intern Friends', members: 8, color: 'bg-green-500' },
    { id: 3, name: 'Gang Gang', members: 6, color: 'bg-purple-500' },
    { id: 4, name: 'Book Club', members: 15, color: 'bg-orange-500' },
  ];

  if (!isLoaded) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center p-8'>
        <div className='text-lg'>Loading...</div>
      </div>
    );
  }

  // Add a fallback for when user is null
  if (!user) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center p-8'>
        <div className='text-lg'>Please sign in to view your profile</div>
      </div>
    );
  }

  const getScoreColor = (score: number): string => {
    if (score >= 50) return 'text-green-600';
    if (score >= 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 60) return 'Excellent';
    if (score >= 50) return 'Good';
    return 'Needs Improvement';
  };

  // Safe fallback values
  const fullName = user.fullName || 'User';
  const email = user.primaryEmailAddress?.emailAddress || 'No email';
  const initials =
    `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}` || 'U';

  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='mx-auto max-w-4xl space-y-6'>
        <h1 className='mb-8 text-center text-4xl font-bold'>View Profile</h1>

        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Mail className='h-5 w-5' />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center gap-4'>
              <Avatar className='h-16 w-16'>
                <AvatarImage src={user.imageUrl} alt={fullName} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className='flex-1'>
                <p className='text-lg font-semibold'>{fullName}</p>
                <p className='flex items-center gap-2 text-sm text-gray-600'>
                  <Mail className='h-4 w-4' />
                  {email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Credit Score Card */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <TrendingUp className='h-5 w-5' />
              Social Credit Score
            </CardTitle>
            <CardDescription>
              Your community reputation and engagement level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-4'>
                <div className='relative'>
                  <div className='text-5xl font-bold'>
                    <span className={getScoreColor(socialCreditScore)}>
                      {socialCreditScore}
                    </span>
                    <span className='text-2xl text-gray-400'>/100</span>
                  </div>
                </div>
                <div>
                  <Badge variant='outline' className='mb-2'>
                    {getScoreLabel(socialCreditScore)}
                  </Badge>
                  <div className='h-2 w-64 overflow-hidden rounded-full bg-gray-200'>
                    <div
                      className={`h-full ${
                        socialCreditScore >= 50
                          ? 'bg-green-500'
                          : socialCreditScore >= 30
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                      }`}
                      style={{ width: `${(socialCreditScore / 100) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              <Star className='h-12 w-12 text-yellow-500' />
            </div>
          </CardContent>
        </Card>

        {/* Friend Groups Card */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Users className='h-5 w-5' />
              Friend Groups
            </CardTitle>
            <CardDescription>
              Manage your social circles and connections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              {friendGroups.map((group) => (
                <div
                  key={group.id}
                  className='flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50'
                >
                  <div className='flex items-center gap-3'>
                    <div
                      className={`h-10 w-10 rounded-full ${group.color} flex items-center justify-center font-semibold text-white`}
                    >
                      {group.name[0]}
                    </div>
                    <div>
                      <p className='font-semibold'>{group.name}</p>
                      <p className='text-sm text-gray-600'>
                        {group.members} members
                      </p>
                    </div>
                  </div>
                  <Button className='hover:cursor-pointer' variant='ghost' size='sm'>
                    View
                  </Button>
                </div>
              ))}
            </div>
            <Button className='mt-4 w-full hover:cursor-pointer' variant='outline'>
              <Users className='mr-2 h-4 w-4' />
              Create New Group
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
