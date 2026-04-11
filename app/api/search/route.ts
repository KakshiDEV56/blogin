import { buildTsQuery, highlightSnippet } from "@/lib/search";
import { getServerSupabaseClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/search?q=query
 * Performs full-text search on published blogs
 * Returns results with snippets
 */
export async function GET(request: NextRequest) {
  try {
    const searchQuery = request.nextUrl.searchParams.get("q");

    if (!searchQuery || searchQuery.trim().length === 0) {
      return NextResponse.json({ results: [] });
    }

    const client = await getServerSupabaseClient();
    const tsQuery = buildTsQuery(searchQuery);

    // Use PostgreSQL FTS (Full Text Search)
    const { data, error } = await client
      .from("blogs")
      .select("id, title, slug, content, created_at")
      .eq("status", "published")
      .textSearch("content", tsQuery)
      .limit(10);

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
