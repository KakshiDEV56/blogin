import { getServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/blogs
 * Returns a list of published blog posts
 */
export async function GET() {
  try {
    const client = await getServerSupabaseClient();

    const { data, error } = await client
      .from("blogs")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ blogs: data || [] });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}
