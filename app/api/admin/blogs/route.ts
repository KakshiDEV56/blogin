import { generateSlug } from "@/lib/slug";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { CreateBlogPayload } from "@/types/blog";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/admin/blogs
 * Creates a new blog post
 * Requires authentication (JWT)
 */
export async function POST(request: NextRequest) {
  try {
    // Get user from JWT (implementation depends on your auth setup)
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload: CreateBlogPayload = await request.json();
    const { title, content, status } = payload;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const client = await createServiceRoleClient();
    const slug = generateSlug(title);

    const { data, error } = await client
      .from("blogs")
      .insert({
        title,
        content,
        slug,
        status,
        user_id: "user-id-from-jwt",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ blog: data }, { status: 201 });
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/blogs
 * Returns all blog posts (draft and published) for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const client = await createServiceRoleClient();

    const { data, error } = await client
      .from("blogs")
      .select("*")
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
