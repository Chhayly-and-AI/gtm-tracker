// src/app/api/metrics/route.ts
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request: NextRequest) {
  const week = request.nextUrl.searchParams.get("week");
  if (week) {
    const rows = await query("SELECT * FROM metrics WHERE week = $1 ORDER BY metric_name", [week]);
    return NextResponse.json(rows);
  }
  const rows = await query("SELECT * FROM metrics ORDER BY week, metric_name");
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const { week, metric_name, value } = await request.json();
  const rows = await query(
    `INSERT INTO metrics (week, metric_name, value)
     VALUES ($1, $2, $3)
     ON CONFLICT (week, metric_name) DO UPDATE SET value = $3, logged_at = now()
     RETURNING *`,
    [week, metric_name, value]
  );
  return NextResponse.json(rows[0], { status: 201 });
}
