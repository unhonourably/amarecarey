export type Comment = {
  id: string;
  note_id: string | null;
  body: string;
  display_name: string | null;
  is_anonymous: boolean;
  created_at: string;
};

export type CommentInput = {
  body: string;
  displayName?: string;
  anonymous: boolean;
  noteId?: string | null;
};

export type AdminComment = Comment & {
  note_slug: string | null;
  note_first_name: string | null;
  note_last_name: string | null;
};