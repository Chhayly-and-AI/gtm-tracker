// mcp/tools.ts
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 3 });

async function q(sql: string, params?: unknown[]) {
  const r = await pool.query(sql, params);
  return r.rows;
}

function getCurrentWeek(): number {
  const start = new Date(process.env.PLAN_START_DATE || "2026-03-25");
  const now = new Date();
  const weeks = Math.floor((now.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;
  return Math.max(1, Math.min(8, weeks));
}

export async function getStatus() {
  const week = getCurrentWeek();
  const [tasks, metrics, leads] = await Promise.all([
    q("SELECT phase, COUNT(*) as total, COUNT(*) FILTER (WHERE completed) as done FROM tasks GROUP BY phase ORDER BY phase"),
    q("SELECT metric_name, value FROM metrics WHERE week = $1", [week]),
    q("SELECT status, COUNT(*) as count FROM leads GROUP BY status"),
  ]);
  const totalTasks = tasks.reduce((s, t) => s + Number(t.total), 0);
  const totalDone = tasks.reduce((s, t) => s + Number(t.done), 0);
  return { week, completion: `${totalDone}/${totalTasks} (${totalTasks ? Math.round(totalDone/totalTasks*100) : 0}%)`, metrics: Object.fromEntries(metrics.map(m => [m.metric_name, m.value])), pipeline: Object.fromEntries(leads.map(l => [l.status, l.count])) };
}

export async function completeTask(taskId?: number, title?: string) {
  if (taskId) {
    const rows = await q("UPDATE tasks SET completed = true, completed_at = now() WHERE id = $1 RETURNING *", [taskId]);
    return rows[0] || { error: "Task not found" };
  }
  if (title) {
    const matches = await q("SELECT id, title FROM tasks WHERE title ILIKE $1 AND NOT completed", [`%${title}%`]);
    if (matches.length === 0) return { error: "No matching task found" };
    if (matches.length > 1) return { error: "Multiple matches", matches: matches.map(m => ({ id: m.id, title: m.title })) };
    const rows = await q("UPDATE tasks SET completed = true, completed_at = now() WHERE id = $1 RETURNING *", [matches[0].id]);
    return rows[0];
  }
  return { error: "Provide task_id or title" };
}

export async function logMetric(week: number, metricName: string, value: number) {
  const rows = await q("INSERT INTO metrics (week, metric_name, value) VALUES ($1, $2, $3) ON CONFLICT (week, metric_name) DO UPDATE SET value = $3, logged_at = now() RETURNING *", [week, metricName, value]);
  return rows[0];
}

export async function addLead(name: string, storeName?: string, source?: string, contact?: string, notes?: string) {
  const rows = await q("INSERT INTO leads (name, store_name, source, contact, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *", [name, storeName || null, source || null, contact || null, notes || null]);
  return rows[0];
}

export async function updateLead(leadId: number, status?: string, notes?: string) {
  const sets = ["updated_at = now()"];
  const vals: unknown[] = [];
  let i = 1;
  if (status) { sets.push(`status = $${i++}`); vals.push(status); }
  if (notes) { sets.push(`notes = $${i++}`); vals.push(notes); }
  if (vals.length === 0) return { error: "No fields to update" };
  vals.push(leadId);
  const rows = await q(`UPDATE leads SET ${sets.join(", ")} WHERE id = $${i} RETURNING *`, vals);
  return rows[0] || { error: "Lead not found" };
}

export async function listLeads(status?: string) {
  if (status) return q("SELECT * FROM leads WHERE status = $1 ORDER BY updated_at DESC", [status]);
  return q("SELECT * FROM leads ORDER BY updated_at DESC");
}

export async function addNote(content: string, tags?: string[]) {
  const rows = await q("INSERT INTO notes (content, tags) VALUES ($1, $2) RETURNING *", [content, tags || []]);
  return rows[0];
}

export async function searchNotes(queryStr?: string, tag?: string) {
  let sql = "SELECT * FROM notes WHERE 1=1";
  const params: unknown[] = [];
  let i = 1;
  if (tag) { sql += ` AND $${i++} = ANY(tags)`; params.push(tag); }
  if (queryStr) { sql += ` AND content ILIKE $${i++}`; params.push(`%${queryStr}%`); }
  sql += " ORDER BY created_at DESC LIMIT 20";
  return q(sql, params);
}

export async function getWeeklySummary(week?: number) {
  const w = week || getCurrentWeek();
  const [tasks, metrics, leads, notes] = await Promise.all([
    q("SELECT phase, COUNT(*) as total, COUNT(*) FILTER (WHERE completed) as done FROM tasks GROUP BY phase ORDER BY phase"),
    q("SELECT metric_name, value FROM metrics WHERE week = $1", [w]),
    q("SELECT status, COUNT(*) as count FROM leads GROUP BY status"),
    q("SELECT * FROM notes WHERE created_at >= (($1::text || ' weeks')::interval + $2::date) AND created_at < ((($1::text || ' weeks')::interval) + '1 week'::interval + $2::date) ORDER BY created_at DESC", [w - 1, process.env.PLAN_START_DATE || "2026-03-25"]),
  ]);
  return { week: w, tasks, metrics: Object.fromEntries(metrics.map(m => [m.metric_name, m.value])), pipeline: Object.fromEntries(leads.map(l => [l.status, l.count])), notes };
}
