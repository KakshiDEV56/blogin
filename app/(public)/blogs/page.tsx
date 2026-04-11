import { BlogList } from "@/components/blog/BlogList";
import { getServerSupabaseClient } from "@/lib/supabase/server";
import { SearchTrigger } from "@/components/search/SearchTrigger";

export const revalidate = 3600; // Revalidate every hour

export default async function BlogsPage() {
  const client = await getServerSupabaseClient();

  const { data: blogs = [] } = await client
    .from("blogs")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  return (
    <main className="max-w-6xl mx-auto px-6 py-20 min-h-screen">
      <div className="space-y-4 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter lowercase">
          Engineering & Thoughts
        </h1>
        <p className="text-muted-foreground text-xl md:text-2xl font-medium tracking-tight max-w-2xl leading-relaxed">
          A collection of articles on systems programming, NixOS infrastructure, and cybersecurity research.
        </p>
      </div>
      
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
        <BlogList blogs={blogs || []} />
      </div>
    </main>
  );
}
