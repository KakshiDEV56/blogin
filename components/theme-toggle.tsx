"use client";

import * as React from "react";
import { Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 opacity-50" disabled>
          <GithubIcon className="w-[1.1rem] h-[1.1rem]" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 border border-border/40 opacity-50" disabled />
      </div>
    );
  }

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const isDark = theme === "dark";
    
    if (!document.startViewTransition) {
      setTheme(isDark ? "light" : "dark");
      return;
    }

    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      setTheme(isDark ? "light" : "dark");
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];
      
      document.documentElement.animate(
        {
          clipPath: isDark ? [...clipPath].reverse() : clipPath,
        },
        {
          duration: 400,
          easing: "ease-in-out",
          pseudoElement: isDark
            ? "::view-transition-old(root)"
            : "::view-transition-new(root)",
        }
      );
    });
  };

  return (
    <div className="flex items-center gap-2">
      <a 
        href="https://github.com/KakshiDEV56/blogin" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center justify-center p-2 rounded-full hover:bg-muted/50 transition-colors"
        title="View on GitHub"
      >
        <GithubIcon className="w-[1.2rem] h-[1.2rem]" />
      </a>
      
      <div className="h-4 w-px bg-border/40 mx-1" />

      <Button
        variant="ghost"
        size="icon"
        className="rounded-full w-9 h-9 border border-border/40 hover:bg-muted/50 transition-all active:scale-95 group relative flex items-center justify-center"
        onClick={handleToggle}
      >
        <div className="relative w-[1.1rem] h-[1.1rem]">
          <Moon className={`absolute inset-0 transition-all duration-300 ${theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'}`} />
          <svg
            className={`absolute inset-0 transition-all duration-300 ${theme === 'light' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 3v1" />
            <path d="M12 20v1" />
            <path d="M3 12h1" />
            <path d="M20 12h1" />
            <path d="m18.364 5.636-.707.707" />
            <path d="m6.343 17.657-.707.707" />
            <path d="m5.636 5.636.707.707" />
            <path d="m17.657 17.657.707.707" />
          </svg>
        </div>
      </Button>
    </div>
  );
}
