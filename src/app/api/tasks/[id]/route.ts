// src/app/api/tasks/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

interface Params { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const sets: string[] = [];
  const values: unknown[] = [];
  let i = 1;

  if (body.title !== undefined) { sets.push(`title = $${i++}`); values.push(body.title); }
  if (body.completed !== undefined) {
    sets.push(`completed = $${i++}`); values.push(body.completed);
    sets.push(`completed_at = $${i++}`); values.push(body.completed ? new Date().toISOString() : null);
  }

  if (sets.length === 0) return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  values.push(id);
  const rows = await query(`UPDATE tasks SET ${sets.join(", ")} WHERE id = $${i} RETURNING *`, values);
  if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const { id } = await params;
  await query("DELETE FROM tasks WHERE id = $1", [id]);
  return NextResponse.json({ deleted: true });
}
