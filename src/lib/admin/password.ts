import { createServiceClient } from "@/lib/supabase/server";

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const trimmed = password.trim();
  if (!trimmed) return false;

  const supabase = createServiceClient();
  const { data, error } = await supabase.rpc("verify_admin_password", {
    input_password: trimmed,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data === true;
}
