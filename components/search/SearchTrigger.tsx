'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SearchTrigger() {
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => {
		setMounted(true);
	}, []);

	const openSearch = () => {
		// Dispatch a keyboard event to trigger the SearchModal's listener
		const event = new KeyboardEvent('keydown', {
			key: 'k',
			ctrlKey: true,
			bubbles: true,
			cancelable: true,
		});
		document.dispatchEvent(event);
	};

	if (!mounted) return null;

	return (
		<>
			<Button
				variant="outline"
				size="icon"
				className="md:hidden relative h-9 w-9 text-muted-foreground bg-card/30 hover:bg-muted/50 border-border/40 rounded-full transition-all"
				onClick={openSearch}
			>
				<Search className="h-4 w-4" />
			</Button>
			<Button
				variant="outline"
				className="hidden md:flex relative w-64 justify-start text-[13px] text-muted-foreground font-mono bg-card/30 hover:bg-muted/50 border-border/40 rounded-full h-9 px-4 transition-all"
				onClick={openSearch}
			>
				<Search className="mr-2 h-3.5 w-3.5 opacity-70" />
				<span className="inline-flex">Search articles...</span>
				<kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 select-none items-center gap-1 rounded border border-border/40 bg-muted/50 px-1.5 font-mono text-[10px] font-medium opacity-100 flex h-5">
					<span className="text-[8px]">⌘</span>K
				</kbd>
			</Button>
		</>
	);
}
