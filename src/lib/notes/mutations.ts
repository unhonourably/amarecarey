import { createServiceClient } from "@/lib/supabase/server";
import { createSlug, normalizeName } from "@/lib/utils";
import { getNoteByNormalizedName } from "./queries";
import type { NoteInput, PersonalNote, TipTapDoc } from "./types";

function emptyDoc(): TipTapDoc {
  return {
    type: "doc",
    content: [{ type: "paragraph" }],
  };
}

function sanitizeInput(input: NoteInput) {
  const first_name = input.first_name.trim().replace(/\s+/g, " ");
  const last_name = input.last_name.trim().replace(/\s+/g, " ");

  if (!first_name || !last_name) {
    throw new Error("First name and last name are required.");
  }

  const slug = createSlug(first_name, last_name);

  if (!slug) {
    throw new Error("Unable to generate a valid slug from the provided names.");
  }

  return {
    first_name,
    last_name,
    slug,
    content: input.content ?? emptyDoc(),
    published: Boolean(input.published),
  };
}

export type CreateNoteResult =
  | { ok: true; note: PersonalNote; previousSlug?: string }
  | {
      ok: false;
      conflict: true;
      existing: PersonalNote;
      message: string;
    };

export async function createNote(
  input: NoteInput,
  options?: { replaceId?: string }
): Promise<CreateNoteResult> {
  const payload = sanitizeInput(input);
  const existing = await getNoteByNormalizedName(
    payload.first_name,
    payload.last_name
  );

  if (existing && existing.id !== options?.replaceId) {
    return {
      ok: false,
      conflict: true,
      existing,
      message:
        "A note for this recipient already exists. Edit the existing note or replace it.",
    };
  }

  const supabase = createServiceClient();

  if (options?.replaceId) {
    const { data, error } = await supabase
      .from("personal_notes")
      .update({
        ...payload,
        updated_at: new Date().toISOString(),
      })
      .eq("id", options.replaceId)
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return { ok: true, note: data as PersonalNote };
  }

  const { data, error } = await supabase
    .from("personal_notes")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return { ok: true, note: data as PersonalNote };
}

export async function updateNote(
  id: string,
  input: Partial<NoteInput>
): Promise<CreateNoteResult> {
  const supabase = createServiceClient();
  const { data: current, error: currentError } = await supabase
    .from("personal_notes")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (currentError) {
    throw new Error(currentError.message);
  }

  if (!current) {
    throw new Error("Note not found.");
  }

  const nextFirst = input.first_name ?? current.first_name;
  const nextLast = input.last_name ?? current.last_name;
  const payload = sanitizeInput({
    first_name: nextFirst,
    last_name: nextLast,
    content: input.content ?? (current.content as TipTapDoc),
    published:
      typeof input.published === "boolean"
        ? input.published
        : current.published,
  });

  const duplicate = await getNoteByNormalizedName(
    payload.first_name,
    payload.last_name
  );

  if (duplicate && duplicate.id !== id) {
    return {
      ok: false,
      conflict: true,
      existing: duplicate,
      message:
        "Another note already uses this recipient name. Choose different names or edit that note.",
    };
  }

  const previousSlug = current.slug as string;

  const { data, error } = await supabase
    .from("personal_notes")
    .update({
      first_name: payload.first_name,
      last_name: payload.last_name,
      slug: payload.slug,
      content: payload.content,
      published: payload.published,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    ok: true,
    note: data as PersonalNote,
    previousSlug:
      previousSlug !== (data as PersonalNote).slug ? previousSlug : undefined,
  };
}

export async function setPublished(
  id: string,
  published: boolean
): Promise<PersonalNote> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("personal_notes")
    .update({
      published,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as PersonalNote;
}

export async function deleteNote(id: string): Promise<void> {
  const supabase = createServiceClient();
  const { error } = await supabase.from("personal_notes").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export function namesMatch(
  aFirst: string,
  aLast: string,
  bFirst: string,
  bLast: string
): boolean {
  return (
    normalizeName(aFirst) === normalizeName(bFirst) &&
    normalizeName(aLast) === normalizeName(bLast)
  );
}
