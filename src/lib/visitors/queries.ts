import { createServiceClient } from "@/lib/supabase/server";

export async function getUniqueVisitorCount(): Promise<number> {
  const supabase = createServiceClient();
  const { count, error } = await supabase
    .from("site_visitors")
    .select("*", { count: "exact", head: true });

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
}