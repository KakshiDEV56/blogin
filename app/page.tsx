import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 md:p-24">
      <div className="max-w-3xl w-full space-y-24">
        <header className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="rounded-none border-primary text-primary font-mono text-[10px] uppercase tracking-[0.2em] px-2 py-0.5">
              v1.0.4-stable
            </Badge>
            <div className="h-px flex-1 bg-border/40" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-7xl md:text-9xl font-bold tracking-tighter lowercase leading-none">
              blogin<span className="text-primary">.</span>
            </h1>
            <p className="text-muted-foreground text-xl md:text-2xl font-medium tracking-tight max-w-xl leading-relaxed">
              a systems programmer&apos;s notebook. high-performance infrastructure, networking, and low-level code.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link href="/blogs">
              <Button size="lg" className="rounded-none px-8 font-mono lowercase tracking-tight">
                cat /var/log/posts
              </Button>
            </Link>
            <Link href="/admin/login">
              <Button size="lg" variant="outline" className="rounded-none px-8 font-mono lowercase tracking-tight border-border/40 hover:bg-muted">
                su admin
              </Button>
            </Link>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border/40 border border-border/40">
          {[
            { title: "kernel", desc: "built with nextjs 14 and react 18.2. enforced memory safety and performance.", icon: "01" },
            { title: "storage", desc: "distributed aws s3 bucket management for media assets and binary blobs.", icon: "02" },
            { title: "search", desc: "full-text pg_trgm indexing powered by supabase for sub-millisecond lookups.", icon: "03" },
            { title: "editor", desc: "split-pane markdown environment with live syntax highlighting and latex support.", icon: "04" },
          ].map((feature) => (
            <div key={feature.title} className="bg-background p-8 space-y-4 group hover:bg-primary/5 transition-colors">
              <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest flex justify-between">
                <span>feature_{feature.icon}</span>
                <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">→ running</span>
              </div>
              <h3 className="text-xl font-bold lowercase tracking-tight">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </section>

        <footer className="pt-24 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em]">
          <div className="order-2 md:order-1">
            ESTABLISHED 2024 // KERNEL_VER 6.8.0-GENERIC
          </div>
          <div className="flex gap-12 order-1 md:order-2 grayscale hover:grayscale-0 transition-all">
            <a href="https://github.com/KakshiDEV56/blogin" className="hover:text-primary transition-colors">github</a>
          </div>
        </footer>
      </div>
    </main>
  );
}
