'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const pathname = usePathname();

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
      </div>
    </nav>
  );
}
