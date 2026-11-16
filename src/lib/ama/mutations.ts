import { createServiceClient } from "@/lib/supabase/server";
import type { AmaQuestion, AmaQuestionInput } from "./types";

const MAX_QUESTION = 2000;
const MAX_CONTACT = 120;
const MAX_NAME = 80;

function normalizeOptional(value?: string): string | null {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) return null;
  if (trimmed.length > MAX_CONTACT) {
    throw new Error("Contact info is too long.");
  }
  return trimmed;
}

export async function createAmaQuestion(
  input: AmaQuestionInput
): Promise<AmaQuestion> {
  const question = input.question.trim();
  if (!question) {
    throw new Error("Question is required.");
  }
  if (question.length > MAX_QUESTION) {
    throw new Error("Question is too long.");
  }

  const contact_email = normalizeOptional(input.contactEmail);
  const contact_phone = normalizeOptional(input.contactPhone);
  const contact_handle = normalizeOptional(input.contactHandle);

  if (!contact_email && !contact_phone && !contact_handle) {
    throw new Error("Add at least one way to reach you.");
  }

  const anonymous = Boolean(input.anonymous);
  let display_name: string | null = null;

  if (!anonymous) {
    const name = input.displayName?.trim() ?? "";
    if (!name) {
      throw new Error("Add a name or choose anonymous.");
    }
    if (name.length > MAX_NAME) {
      throw new Error("Name is too long.");
    }
    display_name = name;
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("ama_questions")
    .insert({
      question,
      display_name,
      is_anonymous: anonymous,
      contact_email,
      contact_phone,
      contact_handle,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as AmaQuestion;
}