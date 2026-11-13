import { createServiceClient } from "@/lib/supabase/server";
import { normalizeName } from "@/lib/utils";
import type {
  LookupResult,
  NoteStats,
  PersonalNote,
  PersonalNoteSummary,
} from "./types";

export async function lookupPublishedNote(
  firstName: string,
  lastName: string
): Promise<LookupResult> {
  const first = normalizeName(firstName);
  const last = normalizeName(lastName);

  if (!first || !last) {
    return { found: false };
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("personal_notes")
    .select("slug")
    .eq("published", true)
    .eq("first_name_norm", first)
    .eq("last_name_norm", last)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return { found: false };
  }

  return { found: true, slug: data.slug };
}

export async function getPublishedNoteBySlug(
  slug: string
): Promise<PersonalNote | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("personal_notes")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as PersonalNote | null) ?? null;
}

export async function getNoteById(id: string): Promise<PersonalNote | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("personal_notes")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as PersonalNote | null) ?? null;
}

export async function getNoteByNormalizedName(
  firstName: string,
  lastName: string
): Promise<PersonalNote | null> {
  const first = normalizeName(firstName);
  const last = normalizeName(lastName);
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("personal_notes")
    .select("*")
    .eq("first_name_norm", first)
    .eq("last_name_norm", last)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as PersonalNote | null) ?? null;
}

export async function listNotes(
  search?: string
): Promise<PersonalNoteSummary[]> {
  const supabase = createServiceClient();
  let query = supabase
    .from("personal_notes")
    .select(
      "id, first_name, last_name, slug, published, created_at, updated_at"
    )
    .order("updated_at", { ascending: false });

  const term = search?.trim().replace(/[%_,]/g, "");
  if (term) {
    query = query.or(
      `first_name.ilike.%${term}%,last_name.ilike.%${term}%,slug.ilike.%${term}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data as PersonalNoteSummary[]) ?? [];
}

export async function getNoteStats(): Promise<NoteStats> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("personal_notes")
    .select("published");

  if (error) {
    throw new Error(error.message);
  }

  const notes = data ?? [];
  const published = notes.filter((note) => note.published).length;

  return {
    total: notes.length,
    published,
    drafts: notes.length - published,
  };
}
