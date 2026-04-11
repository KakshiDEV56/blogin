import { Blog } from "@/types/blog";
import Link from "next/link";

interface BlogCardProps {
  blog: Blog;
}

export function BlogCard({ blog }: BlogCardProps) {
  const date = new Date(blog.created_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const excerpt = blog.content
    .replace(/[#*`]/g, "") // Remove markdown chars for excerpt
    .split("\n")
    .filter(line => line.trim())
    .slice(0, 2)
    .join(" ")
    .substring(0, 140)
    .concat("...");

  return (
    <Link href={`/blogs/${blog.slug}`} className="group block h-full">
      <div className="relative h-full bg-card border border-border/40 rounded-xl p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_20px_rgba(34,197,94,0.05)] flex flex-col gap-4">
        <div className="space-y-3">
          <time className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em]">
            {date}
          </time>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight lowercase line-clamp-2 transition-colors duration-300 group-hover:text-primary decoration-primary/30 decoration-2 underline-offset-4 group-hover:underline leading-tight">
            {blog.title}
          </h2>
          <p className="text-muted-foreground text-[13px] leading-relaxed line-clamp-2 opacity-80 group-hover:opacity-100 transition-opacity">
            {excerpt}
          </p>
        </div>

        <div className="mt-auto flex flex-wrap gap-1.5">
          {["#RUST", "#NETWORKING", "#HTTP"].map((tag) => (
            <span key={tag} className="font-mono text-[9px] text-muted-foreground/60 uppercase tracking-widest bg-muted/50 px-2 py-0.5 rounded-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
