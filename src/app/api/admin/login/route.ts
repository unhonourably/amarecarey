import { NextResponse } from "next/server";
import { verifyAdminPassword } from "@/lib/admin/password";
import {
  ADMIN_COOKIE,
  createSessionValue,
  sessionCookieOptions,
} from "@/lib/admin/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const password = typeof body.password === "string" ? body.password : "";

    if (!password.trim()) {
      return NextResponse.json(
        { error: "Password is required." },
        { status: 400 }
      );
    }

    const valid = await verifyAdminPassword(password);
    if (!valid) {
      return NextResponse.json(
        { error: "Incorrect password." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(
      ADMIN_COOKIE,
      createSessionValue(),
      sessionCookieOptions()
    );
    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Login failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
