import { createServiceClient } from "@/lib/supabase/server";

export async function recordVisitor(visitorKey: string): Promise<boolean> {
  const key = visitorKey.trim();
  if (!key || key.length > 64) {
    throw new Error("Invalid visitor key.");
  }

  const supabase = createServiceClient();
  const now = new Date().toISOString();

  const { data: existing } = await supabase
    .from("site_visitors")
    .select("visitor_key")
    .eq("visitor_key", key)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("site_visitors")
      .update({ last_seen: now })
      .eq("visitor_key", key);

    if (error) {
      throw new Error(error.message);
    }

    return false;
  }

  const { error } = await supabase.from("site_visitors").insert({
    visitor_key: key,
    first_seen: now,
    last_seen: now,
  });

  if (error) {
    if (error.code === "23505") {
      const retry = await supabase
        .from("site_visitors")
        .update({ last_seen: now })
        .eq("visitor_key", key);
      if (retry.error) {
        throw new Error(retry.error.message);
      }
      return false;
    }
    throw new Error(error.message);
  }

  return true;
}