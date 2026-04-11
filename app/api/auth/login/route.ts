import { getServerSupabaseClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

interface LoginPayload {
  email: string;
  password: string;
}

/**
 * POST /api/auth/login
 * Authenticates a user using Supabase Auth
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password }: LoginPayload = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const supabase = await getServerSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: data.user,
      session: data.session,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/auth/logout
 * Clears the authentication token
 */
export async function PUT(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("token");
  return response;
}
