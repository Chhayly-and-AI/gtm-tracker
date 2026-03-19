// src/app/api/leads/route.ts
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request: NextRequest) {
  const status = request.nextUrl.searchParams.get("status");
  if (status) {
    const rows = await query("SELECT * FROM leads WHERE status = $1 ORDER BY updated_at DESC", [status]);
    return NextResponse.json(rows);
  }
  const rows = await query("SELECT * FROM leads ORDER BY updated_at DESC");
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const { name, store_name, source, contact, status, notes } = await request.json();
  const rows = await query(
    `INSERT INTO leads (name, store_name, source, contact, status, notes)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [name, store_name || null, source || null, contact || null, status || "new", notes || null]
  );
  return NextResponse.json(rows[0], { status: 201 });
}
