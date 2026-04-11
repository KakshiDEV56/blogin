import { getServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/blogs/[id]
 * Returns a single blog post by ID
 */
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await getServerSupabaseClient();
    const { id } = params;

    const { data, error } = await client
      .from("blogs")
      .select("*")
      .eq("id", id)
      .eq("status", "published")
      .single();

    if (error) throw error;
    if (!data) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ blog: data });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog" },
      { status: 500 }
    );
  }
}
