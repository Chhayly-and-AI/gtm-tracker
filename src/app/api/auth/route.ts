import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const PASSWORD = process.env.GTM_PASSWORD || "gtm2026";

export async function POST(request: Request) {
  const body = await request.json();

  if (body.password !== PASSWORD) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set("gtm-auth", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });

  return NextResponse.json({ success: true });
}
