import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <nav className='bg-background flex items-center justify-between px-6 py-4'>
      <div className='flex items-center gap-2'>
        <Button variant='ghost'>
          <Link href='/'>Events</Link>
        </Button>
        <Button>
          <Link href='/create-events'>New Event</Link>
        </Button>
        <Button variant='ghost' asChild>
          <Link href='/plan-event'>Planner</Link>
        </Button>
        <Button variant='ghost'>
          <Link href='/profile'>Profile</Link>
        </Button>
      </div>
    </nav>
  );
}
