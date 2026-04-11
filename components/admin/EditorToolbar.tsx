"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface EditorToolbarProps {
  onSaveDraft: () => void;
  onPublish: () => void;
  onUploadImage: () => void;
  isSaving: boolean;
}

export function EditorToolbar({
  onSaveDraft,
  onPublish,
  onUploadImage,
  isSaving,
}: EditorToolbarProps) {
  return (
    <div className="flex gap-4 p-6 border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-10 font-mono text-xs">
      <Button
        variant="outline"
        onClick={onSaveDraft}
        disabled={isSaving}
        className="rounded-none lowercase px-6 border-border/40 hover:bg-muted"
      >
        {isSaving ? "saving..." : "save_draft"}
      </Button>
      <Button
        variant="default"
        onClick={onPublish}
        disabled={isSaving}
        className="rounded-none lowercase px-6"
      >
        publish_record
      </Button>
      <div className="flex-1" />
      <Button
        variant="ghost"
        onClick={onUploadImage}
        className="rounded-none lowercase px-6 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
      >
        <span>[upload_blob]</span>
      </Button>
    </div>
  );
}
