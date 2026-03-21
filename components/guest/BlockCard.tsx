"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CommentForm from "./CommentForm";
import type { Comment } from "@/lib/supabase";

export default function BlockCard({
  section,
  content,
  scriptId,
  comments,
  onCommentAdded,
}: {
  section: string;
  content: string;
  scriptId: string;
  comments: Comment[];
  onCommentAdded: () => void;
}) {
  return (
    <div className="bg-bg-card border border-border rounded-xl p-5 sm:p-6">
      <div className="prose-script text-text-pri">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>

      {/* Comments for this section */}
      {comments.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="bg-bg-alt rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-primary">
                  {c.author_name}
                </span>
                <span className="text-xs text-text-ter">
                  {new Date(c.created_at).toLocaleDateString("es-MX")}
                </span>
              </div>
              <p className="text-sm text-text-pri leading-relaxed">
                {c.content}
              </p>
            </div>
          ))}
        </div>
      )}

      <CommentForm
        scriptId={scriptId}
        section={section}
        onCommentAdded={onCommentAdded}
      />
    </div>
  );
}
