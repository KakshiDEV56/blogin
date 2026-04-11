'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Globe, FileText, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { cn } from '@/lib/utils';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md">
      <div className="container mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-lg font-bold tracking-tight">BI</span>
        </Link>

        {/* Search Trigger */}
        <div className="flex flex-1 items-center justify-center px-6">
          <button
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: '/' }))}
            className="group relative flex w-full max-w-sm items-center rounded-md border border-white/10 bg-[#111] px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-white/5"
          >
            <Search className="mr-2 h-4 w-4" />
            <span className="flex-1 text-left">Search articles...</span>
            <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="hidden text-xs font-medium tracking-tight sm:inline-flex uppercase" asChild>
            <Link href="/portfolio">Portfolio</Link>
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
            <Link href="/resume" target="_blank">
              <FileText className="h-[1.2rem] w-[1.2rem]" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Languages className="h-[1.2rem] w-[1.2rem]" />
          </Button>
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
