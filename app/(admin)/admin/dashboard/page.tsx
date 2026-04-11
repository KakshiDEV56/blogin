"use client";

import { PostTable } from "@/components/admin/PostTable";
import { Button } from "@/components/ui/button";
import { createSupabaseClient } from "@/lib/supabase/client";
import { Blog } from "@/types/blog";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [posts, setPosts] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/admin/login");
        return;
      }
      
      setUser(user);
      fetchPosts();
    };
    
    checkAuth();
  }, [router]);

  const fetchPosts = async () => {
    try {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const supabase = createSupabaseClient();
      const { error } = await supabase
        .from("blogs")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setPosts(posts.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/edit/${id}`);
  };

  const handlePublish = async (id: string) => {
    try {
      const supabase = createSupabaseClient();
      const { error } = await supabase
        .from("blogs")
        .update({ status: "published" })
        .eq("id", id);

      if (error) throw error;
      fetchPosts();
    } catch (error) {
      console.error("Error publishing post:", error);
    }
  };

  const handleLogout = async () => {
    const supabase = createSupabaseClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 md:py-24">
      <div className="flex justify-between items-baseline mb-12 border-b border-border/40 pb-6">
        <h1 className="text-4xl font-bold tracking-tighter lowercase">root@dashboard:~$ status</h1>
        <div className="flex gap-4">
          <Link href="/blogs">
            <Button variant="ghost" className="font-mono text-xs lowercase">view public</Button>
          </Link>
          <Link href="/admin/create">
            <Button className="font-mono text-xs lowercase rounded-none">new post</Button>
          </Link>
          <Button variant="ghost" onClick={handleLogout} className="font-mono text-xs lowercase text-destructive hover:text-destructive">
            logout
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="font-mono text-sm text-muted-foreground animate-pulse">Fetching blog records...</div>
      ) : (
        <div className="rounded-none border border-border/40 bg-card overflow-hidden">
          <PostTable
            posts={posts}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPublish={handlePublish}
          />
        </div>
      )}
    </main>
  );
}
