"use client";

import { PostEditor } from "@/components/admin/PostEditor";
import { useRouter } from "next/navigation";

export default function CreatePage() {
  const router = useRouter();

  const handleSave = async (
    title: string,
    content: string,
    status: "draft" | "published"
  ) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/blogs", {
        method: "POST",
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

  return <PostEditor onSave={handleSave} />;
}
