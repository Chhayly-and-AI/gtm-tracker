// src/app/api/tasks/route.ts
import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  const rows = await query("SELECT * FROM tasks ORDER BY phase, sort_order");
  const grouped = {
    0: rows.filter((t) => t.phase === 0),
    1: rows.filter((t) => t.phase === 1),
    2: rows.filter((t) => t.phase === 2),
    3: rows.filter((t) => t.phase === 3),
  };
  return NextResponse.json(grouped);
}

export async function POST(request: Request) {
  const { phase, title, sort_order } = await request.json();
  const rows = await query(
    "INSERT INTO tasks (phase, title, sort_order) VALUES ($1, $2, $3) RETURNING *",
    [phase, title, sort_order ?? 99]
  );
  return NextResponse.json(rows[0], { status: 201 });
}
