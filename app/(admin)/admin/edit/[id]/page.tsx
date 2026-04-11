"use client";

import { PostEditor } from "@/components/admin/PostEditor";
import { Blog } from "@/types/blog";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditPage({ params }: { params: { id: string } }) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/admin/blogs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch blog");
        const data = await response.json();
        setBlog(data.blog);
      } catch (error) {
        console.error("Error fetching blog:", error);
        router.push("/admin/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [id, router]);

  const handleSave = async (
    title: string,
    content: string,
    status: "draft" | "published"
  ) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          status,
        }),
      });

      if (!response.ok) throw new Error("Failed to save post");
      router.push("/admin/dashboard");
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Failed to save post");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="font-mono text-sm text-muted-foreground animate-pulse p-4 border border-border/40 lowercase">
          [kernel]: retrieving_post_at_0x{id}...
        </div>
      </div>
    );
  }

  return (
    <PostEditor
      initialTitle={blog?.title}
      initialContent={blog?.content}
      onSave={handleSave}
    />
  );
}
