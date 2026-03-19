// src/app/api/notes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get("tag");
  const q = request.nextUrl.searchParams.get("q");

  let sql = "SELECT * FROM notes WHERE 1=1";
  const params: unknown[] = [];
  let i = 1;

  if (tag) { sql += ` AND $${i++} = ANY(tags)`; params.push(tag); }
  if (q) { sql += ` AND content ILIKE $${i++}`; params.push(`%${q}%`); }
  sql += " ORDER BY created_at DESC";

  const rows = await query(sql, params);
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const { content, tags } = await request.json();
  const rows = await query(
    "INSERT INTO notes (content, tags) VALUES ($1, $2) RETURNING *",
    [content, tags || []]
  );
  return NextResponse.json(rows[0], { status: 201 });
}
