/**
 * Generates a URL-friendly slug from a title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Freezes a slug so it doesn't change when the title changes
 * (useful for editing posts)
 */
export function freezeSlug(slug: string): string {
  // The slug is already frozen - we just return it as-is
  // In the database, the slug is immutable once created
  return slug;
}

/**
 * Validates a slug format
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug) && slug.length > 0;
}
