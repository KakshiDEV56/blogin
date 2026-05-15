"use client";

import { marked } from "marked";
import React, { useMemo, useEffect } from "react";
import hljs from "highlight.js";
// VS Code-like dark theme for highlight.js
import "highlight.js/styles/atom-one-dark.css";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  const renderedContent = useMemo(() => {
    // Check if the content is Editor.js JSON
    let isEditorJs = false;
    let editorJsData: any = null;
    
    try {
      if (content.trim().startsWith('{') && content.includes('"blocks"')) {
        editorJsData = JSON.parse(content);
        if (editorJsData.blocks) {
          isEditorJs = true;
        }
      }
    // eslint-disable-next-line no-empty
    } catch (e) {}

    // --- EDITOR.JS CONVERTER ---
    if (isEditorJs) {
      let htmlOutput = "";
      for (const block of editorJsData.blocks) {
        switch (block.type) {
          case "paragraph":
            htmlOutput += `<p>${block.data.text}</p>`;
            break;
          case "header":
            const level = block.data.level || 2;
            const id = block.data.text.toLowerCase().replace(/[^\\w\\s-]/g, "").replace(/\\s+/g, "-");
            htmlOutput += `<h${level} id="${id}">${block.data.text}</h${level}>`;
            break;
          case "list":
            const tag = block.data.style === "ordered" ? "ol" : "ul";
            const items = block.data.items.map((i: string) => `<li>${i}</li>`).join("");
            htmlOutput += `<${tag}>${items}</${tag}>`;
            break;
          case "code":
            // highlight the code using highlight.js
            const highlightedCode = hljs.highlightAuto(block.data.code).value;
            htmlOutput += `<pre><code class="hljs">${highlightedCode}</code></pre>`;
            break;
          case "image":
            const url = block.data.file?.url || block.data.url;
            const caption = block.data.caption ? `<figcaption>${block.data.caption}</figcaption>` : "";
            const withBorder = block.data.withBorder ? "border: 1px solid var(--border);" : "";
            const withBackground = block.data.withBackground ? "background: var(--muted); padding: 1rem;" : "";
            const stretched = block.data.stretched ? "width: 100%;" : "";
            htmlOutput += `<figure style="${withBorder} ${withBackground} ${stretched}">
              <img src="${url}" alt="${block.data.caption || 'image'}" />
              ${caption}
            </figure>`;
            break;
          case "quote":
            htmlOutput += `<blockquote class="border-l-4 border-primary pl-4 italic"><p>${block.data.text}</p>${block.data.caption ? `<cite className="block mt-2 text-sm text-muted-foreground">- ${block.data.caption}</cite>` : ''}</blockquote>`;
            break;
          case "delimiter":
            htmlOutput += `<hr class="my-8 border-border" />`;
            break;
          default:
            console.warn("Unknown block type", block.type);
            break;
        }
      }
      return htmlOutput;
    }

    // --- MARKDOWN CONVERTER ---
    const renderer = new marked.Renderer();
    renderer.heading = (text, level) => {
      const id = text
        .toLowerCase()
        .replace(/[^\\w\\s-]/g, "")
        .replace(/\\s+/g, "-");
      return `<h${level} id="${id}">${text}</h${level}>`;
    };

    // Support code block highlighting in marked
    renderer.code = (code, language) => {
      const validLanguage = hljs.getLanguage(language || '') ? (language as string) : 'plaintext';
      const highlightedCode = validLanguage !== 'plaintext' 
        ? hljs.highlight(code, { language: validLanguage }).value
        : hljs.highlightAuto(code).value;
        
      return `<pre><code class="hljs ${validLanguage}">${highlightedCode}</code></pre>`;
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
      dangerouslySetInnerHTML={{ __html: renderedContent }}
    />
  );
}
