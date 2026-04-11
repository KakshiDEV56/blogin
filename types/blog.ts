export type BlogStatus = "draft" | "published";

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: BlogStatus;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface SearchResult {
  id: string;
  title: string;
  slug: string;
  snippet: string;
  rank: number;
}

export interface CreateBlogPayload {
  title: string;
  content: string;
  status: BlogStatus;
}

export interface UpdateBlogPayload {
  title?: string;
  content?: string;
  status?: BlogStatus;
}

export interface PresignedUrlResponse {
  url: string;
  filename: string;
}
