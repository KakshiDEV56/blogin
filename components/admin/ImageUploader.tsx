"use client";

import { Button } from "@/components/ui/button";
import React, { useRef, useState } from "react";

interface ImageUploaderProps {
  onUploadSuccess: (url: string | null) => void;
}

export function ImageUploader({ onUploadSuccess }: ImageUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) {
      onUploadSuccess(null);
      return;
    }

    setIsLoading(true);
    try {
      // Get presigned URL
      const presignResponse = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      });

      if (!presignResponse.ok) throw new Error("Failed to get presigned URL");
      
      const { url, filename } = await presignResponse.json();

      // Upload to S4 (S3)
      const uploadResponse = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadResponse.ok) throw new Error("S3 Upload failed");

      // Construct public URL
      const publicUrl = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION || "us-east-1"}.amazonaws.com/${filename}`;
      onUploadSuccess(publicUrl);
    } catch (error) {
      console.error("Upload failed:", error);
      onUploadSuccess(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-mono text-[10px] uppercase tracking-widest">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        variant="outline"
        className="rounded-none border-dashed border-border/60 h-24 w-full flex flex-col gap-2 lowercase hover:bg-primary/5 transition-colors"
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="animate-pulse">transferring_bits...</span>
        ) : (
          <>
            <span className="text-muted-foreground">[ click_to_mount_storage ]</span>
            <span className="text-[9px] text-muted-foreground/50 opacity-50">max_size: 10mb</span>
          </>
        )}
      </Button>
    </div>
  );
}
