// src/app/api/notes/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

interface Params { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const sets: string[] = ["updated_at = now()"];
  const values: unknown[] = [];
  let i = 1;

  if (body.content !== undefined) { sets.push(`content = $${i++}`); values.push(body.content); }
  if (body.tags !== undefined) { sets.push(`tags = $${i++}`); values.push(body.tags); }
  if (values.length === 0) return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  values.push(id);
  const rows = await query(`UPDATE notes SET ${sets.join(", ")} WHERE id = $${i} RETURNING *`, values);
  if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const { id } = await params;
  await query("DELETE FROM notes WHERE id = $1", [id]);
  return NextResponse.json({ deleted: true });
}
