import { getPresignedUrl } from "@/lib/s3";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/admin/upload
 * Returns a presigned S3 URL for direct upload
 * The client then uploads directly to S3
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { filename, contentType } = await request.json();

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: "Filename and contentType are required" },
        { status: 400 }
      );
    }

    const presignedUrl = await getPresignedUrl(filename, contentType);

    return NextResponse.json(presignedUrl);
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json(
      { error: "Failed to generate presigned URL" },
      { status: 500 }
    );
  }
}
