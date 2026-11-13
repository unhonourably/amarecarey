import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin/session";

export async function requireAdminApi() {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return null;
}

export async function requireAdminPage() {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    redirect("/canes/login");
  }
}
