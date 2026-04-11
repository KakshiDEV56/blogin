import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomBytes } from "crypto";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
});

/**
 * Generate a presigned URL for S3 upload
 * Used by the frontend to upload images directly to S3
 */

export async function getPresignedUrl(
  filename: string,
  contentType: string
): Promise<{ url: string; filename: string }> {
  const key = `uploads/${Date.now()}-${randomBytes(8).toString("hex")}-${filename}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME || "",
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

  return {
    url,
    filename: key,
  };
}

/**
 * Generate a public S3 URL from a key
 */
export function getPublicS3Url(key: string): string {
  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com/${key}`;
}

/**
 * Delete an object from S3
 */
export async function deleteS3Object(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME || "",
    Key: key,
  });
  
  await s3Client.send(command);
}
