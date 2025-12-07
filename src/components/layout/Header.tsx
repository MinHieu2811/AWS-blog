'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

import Button from '@/components/Button';
import { ModeToggle } from '@/components/ui/ModeToggle';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Blogs', href: '/blog' },
];

const Header = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-light)] bg-[var(--bg-primary)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="group flex items-center gap-2 font-semibold"
            aria-label="AWS Blog home"
            onClick={handleCloseMenu}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent-primary)] text-sm font-bold uppercase text-[var(--text-inverse)] shadow-sm transition-transform group-hover:scale-105">
              AWS
            </span>
            <span className="hidden text-lg tracking-tight text-[var(--text-primary)] sm:inline-block">
              Personal Blog
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-[var(--text-secondary)] md:flex" aria-label="Primary">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative transition-colors hover:text-[var(--accent-primary)]',
                  isActive(item.href) && 'text-[var(--accent-primary)]'
                )}
              >
                {item.label}
                {isActive(item.href) && (
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-[var(--accent-primary)]" />
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <ModeToggle />
          </div>
          <Button
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
            className="md:hidden"
            onClick={handleToggleMenu}
            size="icon"
            variant="ghost"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-[var(--border-light)] bg-[var(--bg-primary)] md:hidden">
          <nav aria-label="Mobile Primary" className="flex flex-col gap-1 px-4 py-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleCloseMenu}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-[rgba(212,163,115,0.12)]',
                  isActive(item.href)
                    ? 'text-[var(--accent-primary)]'
                    : 'text-[var(--text-secondary)]'
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2">
              <ModeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

