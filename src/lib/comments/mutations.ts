import { createServiceClient } from "@/lib/supabase/server";
import type { Comment, CommentInput } from "./types";

const MAX_BODY_LENGTH = 2000;
const MAX_NAME_LENGTH = 80;

export async function createComment(input: CommentInput): Promise<Comment> {
  const body = input.body.trim();
  if (!body) {
    throw new Error("Message is required.");
  }
  if (body.length > MAX_BODY_LENGTH) {
    throw new Error("Message is too long.");
  }

  const anonymous = Boolean(input.anonymous);
  let displayName: string | null = null;

  if (!anonymous) {
    const name = input.displayName?.trim() ?? "";
    if (!name) {
      throw new Error("Name is required unless you stay anonymous.");
    }
    if (name.length > MAX_NAME_LENGTH) {
      throw new Error("Name is too long.");
    }
    displayName = name;
  }

  const supabase = createServiceClient();

  if (input.noteId) {
    const { data: note, error: noteError } = await supabase
      .from("personal_notes")
      .select("id, published")
      .eq("id", input.noteId)
      .maybeSingle();

    if (noteError) {
      throw new Error(noteError.message);
    }
    if (!note?.published) {
      throw new Error("Note not found.");
    }
  }

  const { data, error } = await supabase
    .from("comments")
    .insert({
      note_id: input.noteId ?? null,
      body,
      display_name: displayName,
      is_anonymous: anonymous,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Comment;
}