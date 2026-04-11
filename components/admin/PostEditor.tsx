"use client";

import { MarkdownRenderer } from "@/components/blog/MarkdownRenderer";
import { EditorToolbar } from "./EditorToolbar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";

interface PostEditorProps {
  initialTitle?: string;
  initialContent?: string;
  onSave: (title: string, content: string, status: "draft" | "published") => Promise<void>;
}

export function PostEditor({
  initialTitle = "",
  initialContent = "",
  onSave,
}: PostEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      await onSave(title, content, "draft");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setIsSaving(true);
    try {
      await onSave(title, content, "published");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadImage = () => {
    // Implementation for image upload modal
    console.log("Open image upload");
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <EditorToolbar
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        onUploadImage={handleUploadImage}
        isSaving={isSaving}
      />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Split View */}
        <div className="hidden lg:flex flex-1 divide-x divide-border/40">
          {/* Editor */}
          <div className="flex-1 flex flex-col p-8 space-y-6 overflow-hidden">
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                var pointer_title =
              </label>
              <Input
                type="text"
                placeholder="slug_identifier_here"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-bold bg-transparent border-none focus-visible:ring-0 p-0 rounded-none h-auto lowercase tracking-tight"
              />
            </div>
            
            <div className="flex-1 flex flex-col gap-2 min-h-0">
              <label className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                std::io::stdin().read_to_string()
              </label>
              <Textarea
                placeholder="write in markdown_flavor..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="flex-1 bg-transparent border-none focus-visible:ring-0 p-0 rounded-none resize-none font-mono text-sm leading-relaxed scrollbar-thin scrollbar-thumb-primary/20"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="flex-1 flex flex-col bg-muted/5 p-8 overflow-y-auto">
            <label className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-8 sticky top-0 bg-background/5  py-2">
              stdout // rendering preview
            </label>
            <article className="prose-custom">
              <h1 className="text-4xl font-bold mb-8 lowercase tracking-tighter">
                {title || "Untitled Post"}
              </h1>
              {content ? (
                <MarkdownRenderer content={content} />
              ) : (
                <div className="text-muted-foreground/30 font-mono text-sm animate-pulse">
                   esperando entrada...
                </div>
              )}
            </article>
          </div>
        </div>

        {/* Mobile Tabs View */}
        <Tabs defaultValue="editor" className="flex flex-col flex-1 lg:hidden">
          <TabsList className="bg-muted/50 rounded-none border-b border-border/40 h-12">
            <TabsTrigger value="editor" className="flex-1 rounded-none font-mono text-xs uppercase">Editor</TabsTrigger>
            <TabsTrigger value="preview" className="flex-1 rounded-none font-mono text-xs uppercase">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="editor" className="flex-1 flex flex-col p-6 m-0 focus-visible:ring-0">
            <Input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-bold bg-transparent border-none p-0 mb-4 h-auto lowercase"
            />
            <Textarea
              placeholder="Content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 bg-transparent border-none p-0 resize-none font-mono text-sm"
            />
          </TabsContent>
          <TabsContent value="preview" className="flex-1 p-6 m-0 overflow-y-auto">
            <article className="prose-custom">
              <h1 className="text-3xl font-bold mb-6 lowercase">{title}</h1>
              <MarkdownRenderer content={content} />
            </article>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
