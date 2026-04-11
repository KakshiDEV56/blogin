"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const supabase = createSupabaseClient();
      
      // Sign in with password
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error("Sign in error:", signInError);
        throw new Error(signInError.message);
      }

      if (!signInData.user) {
        throw new Error("No user returned from sign in");
      }

      // Verify session was created
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        throw new Error(sessionError.message);
      }

      if (!sessionData.session) {
        throw new Error("No session created");
      }

      console.log("✅ Login successful, session created");
      
      // Wait a bit for cookies to be set, then redirect
      await new Promise(resolve => setTimeout(resolve, 500));
      router.push("/admin/dashboard");
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      console.error("❌ Login error:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm space-y-12">
        <header className="space-y-4">
          <Link
            href="/"
            className="font-mono text-[10px] text-primary hover:underline uppercase tracking-widest"
          >
            ← return_to_base
          </Link>
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tighter lowercase">
              sudo login
            </h1>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
              access_token required for write operations
            </p>
          </div>
        </header>

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive font-mono text-xs lowercase">
            [error]: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                identity_provider
              </Label>
              <Input
                type="email"
                placeholder="user@kernel.local"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="rounded-none bg-muted/20 border-border/40 focus-visible:ring-primary h-12 lowercase"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                private_key
              </Label>
              <Input
                type="password"
                placeholder="************"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="rounded-none bg-muted/20 border-border/40 focus-visible:ring-primary h-12"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-none h-12 font-mono text-xs uppercase tracking-widest"
          >
            {isLoading ? "authenticating..." : "init session"}
          </Button>
        </form>

        <footer className="text-[10px] font-mono text-muted-foreground/40 uppercase text-center tracking-widest">
          unauthorized access strictly prohibited // 403 logging active
        </footer>
      </div>
    </main>
  );
}


