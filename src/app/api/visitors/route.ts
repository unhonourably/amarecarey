import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { VISITOR_COOKIE, VISITOR_COOKIE_MAX_AGE } from "@/lib/visitors/constants";
import { recordVisitor } from "@/lib/visitors/mutations";
import { getUniqueVisitorCount } from "@/lib/visitors/queries";

export async function GET() {
  try {
    const count = await getUniqueVisitorCount();
    return NextResponse.json({ count });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load visitor count.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const jar = await cookies();
    let visitorKey = jar.get(VISITOR_COOKIE)?.value;

    if (!visitorKey || visitorKey.length > 64) {
      visitorKey = randomUUID();
    }

    await recordVisitor(visitorKey);
    const count = await getUniqueVisitorCount();

    const response = NextResponse.json({ count });

    response.cookies.set({
      name: VISITOR_COOKIE,
      value: visitorKey,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: VISITOR_COOKIE_MAX_AGE,
    });

    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to record visit.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}