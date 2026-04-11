"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({ content }: { content: string }) {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Basic regex to find markdown headers
    const lines = content.split("\n");
    const items: TocItem[] = [];
    
    lines.forEach((line) => {
      const match = line.match(/^(#{2,3})\s+(.*)/);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-");
        items.push({ id, text, level });
      }
    });
    
    setToc(items);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0% 0% -80% 0%" }
    );

    toc.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [toc]);

  if (toc.length === 0) return null;

  return (
    <nav className="space-y-2">
      <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
        On This Page
      </p>
      <ul className="space-y-2.5">
        {toc.map((item) => (
          <li
            key={item.id}
            style={{ paddingLeft: `${(item.level - 2) * 1}rem` }}
          >
            <a
              href={`#${item.id}`}
              className={cn(
                "text-sm transition-colors hover:text-primary block py-0.5 border-l-2 pl-4 -ml-[2px]",
                activeId === item.id
                  ? "text-primary border-primary font-medium"
                  : "text-muted-foreground border-transparent"
              )}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              {item.text.toLowerCase()}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
