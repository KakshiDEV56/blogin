"use client";

import { marked, Renderer } from "marked";
import React, { useMemo } from "react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  const html = useMemo(() => {
    const renderer = new Renderer();
    renderer.heading = (text, level) => {
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      return `<h${level} id="${id}">${text}</h${level}>`;
    };

    return marked(content, {
      breaks: true,
      gfm: true,
      renderer,
    });
  }, [content]);

  return (
    <div
      className={`prose-custom ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
