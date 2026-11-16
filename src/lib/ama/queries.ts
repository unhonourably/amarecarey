import { createServiceClient } from "@/lib/supabase/server";
import type { AmaQuestion } from "./types";

export async function listAmaQuestions(): Promise<AmaQuestion[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("ama_questions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as AmaQuestion[];
}

export async function getAmaQuestionCount(): Promise<number> {
  const supabase = createServiceClient();
  const { count, error } = await supabase
    .from("ama_questions")
    .select("*", { count: "exact", head: true });

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
}