import type { Comment } from "@/lib/comments/types";
import { formatDateCentral } from "@/lib/utils";

type CommentListProps = {
  comments: Comment[];
};

export function CommentList({ comments }: CommentListProps) {
  if (!comments.length) {
    return null;
  }

  return (
    <ul className="space-y-5 border-t border-ink-600/80 pt-6">
      {comments.map((comment) => (
        <li
          key={comment.id}
          className="border-b border-ink-600/60 pb-5 text-center last:border-0 last:pb-0"
        >
          <p className="text-[0.65rem] tracking-[0.12em] uppercase text-ink-500">
            {comment.is_anonymous
              ? "anonymous"
              : comment.display_name || "anonymous"}
            <span className="mx-2 text-ink-600">·</span>
            <time dateTime={comment.created_at}>
              {formatDateCentral(comment.created_at)}
            </time>
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink-300">
            {comment.body}
          </p>
        </li>
      ))}
    </ul>
  );
}