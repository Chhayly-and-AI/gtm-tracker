// src/app/api/summary/route.ts
import { NextResponse } from "next/server";
import { query } from "@/lib/db";

function getCurrentWeek(): number {
  const start = new Date(process.env.PLAN_START_DATE || "2026-03-25");
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1;
  return Math.max(1, Math.min(8, diffWeeks));
}

function getDaysRemaining(): number {
  const start = new Date(process.env.PLAN_START_DATE || "2026-03-25");
  const end = new Date(start.getTime() + 8 * 7 * 24 * 60 * 60 * 1000);
  const now = new Date();
  return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

export async function GET() {
  const currentWeek = getCurrentWeek();

  const [tasks, metrics, leadCounts, recentNotes] = await Promise.all([
    query("SELECT phase, COUNT(*) as total, COUNT(*) FILTER (WHERE completed) as done FROM tasks GROUP BY phase ORDER BY phase"),
    query("SELECT metric_name, value FROM metrics WHERE week = $1", [currentWeek]),
    query("SELECT status, COUNT(*) as count FROM leads GROUP BY status"),
    query("SELECT * FROM notes ORDER BY created_at DESC LIMIT 5"),
  ]);

  const phases = [0, 1, 2, 3].map((p) => {
    const row = tasks.find((t) => t.phase === p);
    return { phase: p, total: Number(row?.total || 0), done: Number(row?.done || 0) };
  });

  const currentPhase = phases.findIndex((p) => p.done < p.total);
  const totalTasks = phases.reduce((s, p) => s + p.total, 0);
  const totalDone = phases.reduce((s, p) => s + p.done, 0);

  const metricsMap: Record<string, number> = {};
  for (const m of metrics) metricsMap[m.metric_name as string] = Number(m.value);

  const pipelineMap: Record<string, number> = {};
  for (const l of leadCounts) pipelineMap[l.status as string] = Number(l.count);

  return NextResponse.json({
    currentPhase: currentPhase === -1 ? 3 : currentPhase,
    currentWeek,
    daysRemaining: getDaysRemaining(),
    completion: { total: totalTasks, done: totalDone, percent: totalTasks ? Math.round((totalDone / totalTasks) * 100) : 0 },
    phases,
    metrics: metricsMap,
    pipeline: pipelineMap,
    recentNotes,
  });
}
