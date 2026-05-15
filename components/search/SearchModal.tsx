'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useDebounce } from '@/hooks/useDebounce';
import { FileText, SquareTerminal } from 'lucide-react';

export function SearchModal() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const debouncedQuery = useDebounce(query, 300);
  const [results, setResults] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const listRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const isInput = (
        (e.target instanceof HTMLElement && e.target.isContentEditable) ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      );

      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
        if (isInput) return;
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  React.useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
        if (!response.ok) throw new Error('Search failed');
        const data = await response.json();
        console.log(`[SearchModal] Query: "${debouncedQuery}" returned ${data?.length || 0} results`);
        setResults(data);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command className="bg-[#111111] dark:bg-[#111111] text-zinc-100 border border-white/10">
        <CommandInput 
          placeholder="Search..." 
          value={query}
          onValueChange={setQuery}
          className="font-mono text-sm border-none ring-0 placeholder:text-zinc-500"
        />
        <CommandList 
          ref={listRef}
          className="max-h-[60vh] overflow-y-auto scroll-smooth"
        >
          {results?.length === 0 && query.length > 0 && !loading && (
            <CommandEmpty className="py-6 text-center text-xs font-mono text-muted-foreground uppercase tracking-widest">
              errno 404: no matches for &quot;{query}&quot;
            </CommandEmpty>
          )}
          
          <CommandGroup heading="quick_actions" className="font-mono text-[10px] uppercase text-muted-foreground tracking-widest px-2">
            <CommandItem 
              onSelect={() => runCommand(() => router.push('/'))} 
              className="cursor-pointer" 
              value="home-nav"
            >
              <div className="flex items-center gap-2">
                <SquareTerminal className="w-4 h-4" />
                <span>~/home</span>
              </div>
            </CommandItem>
            <CommandItem 
              onSelect={() => runCommand(() => router.push('/blogs'))} 
              className="cursor-pointer" 
              value="blogs-nav"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>~/blogs</span>
              </div>
            </CommandItem>
          </CommandGroup>

          {results?.length > 0 && results.map((blog, blogIndex) => (
            <CommandGroup 
              key={`blog-${blog.id}`}
              heading={blog.title}
              className="font-mono text-[10px] uppercase text-muted-foreground tracking-widest px-2 mt-4 first:mt-0"
            >
              <CommandItem
                onSelect={() => runCommand(() => router.push(`/blogs/${blog.slug}`))}
                className="cursor-pointer flex flex-col items-start gap-2 p-3 aria-selected:bg-primary/10"
                value={`blog-${blog.id}-${blogIndex}`}
              >
                <div className="flex items-center gap-2 text-foreground font-semibold lowercase text-sm">
                  <FileText className="w-3 h-3 text-primary" />
                  <span>{blog.title}</span>
                </div>
                <div className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3 w-full">
                  {blog.content ? (
                    <div className="opacity-80">
                      {blog.content.substring(0, 150)}...
                    </div>
                  ) : (
                    <div className="opacity-50">No preview available</div>
                  )}
                </div>
              </CommandItem>
            </CommandGroup>
          ))}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
