"use client";

import { Badge } from "@/components/ui/badge";
import { Blog } from "@/types/blog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface PostTableProps {
  posts: Blog[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
}

export function PostTable({
  posts,
  onEdit,
  onDelete,
  onPublish,
}: PostTableProps) {
  return (
    <Table className="font-mono text-xs">
      <TableHeader className="bg-muted/50 uppercase tracking-widest text-[10px]">
        <TableRow>
          <TableHead className="w-[45%]">filename_prefix</TableHead>
          <TableHead>status</TableHead>
          <TableHead>created_at</TableHead>
          <TableHead className="text-right">ops</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={4}
              className="h-24 text-center text-muted-foreground"
            >
              NO RECORDS FOUND IN DATABASE
            </TableCell>
          </TableRow>
        ) : (
          posts.map((post) => (
            <TableRow
              key={post.id}
              className="hover:bg-primary/5 transition-colors group"
            >
              <TableCell className="font-bold lowercase">
                {post.slug}.md
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    post.status === "published" ? "default" : "outline"
                  }
                  className="rounded-none text-[9px] uppercase px-1 py-0"
                >
                  {post.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {format(new Date(post.created_at), "yyyy-MM-dd HH:mm")}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => onEdit(post.id)}
                  className="h-auto p-0 text-primary hover:text-primary/80 lowercase"
                >
                  edit
                </Button>
                {post.status === "draft" && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => onPublish(post.id)}
                    className="h-auto p-0 text-blue-400 hover:text-blue-300 lowercase"
                  >
                    push
                  </Button>
                )}
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => onDelete(post.id)}
                  className="h-auto p-0 text-destructive hover:text-destructive/80 lowercase"
                >
                  rm
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
