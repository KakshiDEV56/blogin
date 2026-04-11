import { MarkdownRenderer } from "@/components/blog/MarkdownRenderer";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { getServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export const revalidate = 3600; // Revalidate every hour

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const client = await getServerSupabaseClient();
  const { slug } = params;

  const { data: blog, error } = await client
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !blog) {
    notFound();
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Main Content */}
        <article className="flex-1 min-w-0">
          <header className="mb-12 border-b border-border pb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-4 lowercase">
              {blog.title}
            </h1>
            <div className="flex items-center gap-4 text-sm font-mono text-muted-foreground">
              <time>
                {new Date(blog.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
              <span>•</span>
              <span className="uppercase tracking-widest text-[10px]">
                {blog.author_id ? "verified author" : "system"}
              </span>
            </div>
          </header>

          <div className="max-w-none">
            <MarkdownRenderer content={blog.content} />
          </div>
        </article>

        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="sticky top-24">
            <TableOfContents content={blog.content} />
          </div>
        </aside>
      </div>
    </main>
  );
}
