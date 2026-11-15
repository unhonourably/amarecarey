import { createServiceClient } from "@/lib/supabase/server";
import type { AdminComment, Comment } from "./types";

export async function listHomeComments(): Promise<Comment[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .is("note_id", null)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data as Comment[]) ?? [];
}

export async function listNoteComments(noteId: string): Promise<Comment[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("note_id", noteId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data as Comment[]) ?? [];
}

export async function listCommentsForAdmin(): Promise<AdminComment[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("comments")
    .select(
      `
      id,
      note_id,
      body,
      display_name,
      is_anonymous,
      created_at,
      personal_notes (
        slug,
        first_name,
        last_name
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => {
    const note = Array.isArray(row.personal_notes)
      ? row.personal_notes[0]
      : row.personal_notes;

    return {
      id: row.id,
      note_id: row.note_id,
      body: row.body,
      display_name: row.display_name,
      is_anonymous: row.is_anonymous,
      created_at: row.created_at,
      note_slug: note?.slug ?? null,
      note_first_name: note?.first_name ?? null,
      note_last_name: note?.last_name ?? null,
    } satisfies AdminComment;
  });
}