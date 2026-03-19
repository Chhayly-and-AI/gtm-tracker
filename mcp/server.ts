// mcp/server.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as tools from "./tools.js";

const server = new McpServer({ name: "gtm-tracker", version: "1.0.0" });

server.tool("get_status", "Get current phase, task completion %, and this week's scorecard", {}, async () => {
  const result = await tools.getStatus();
  return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
});

server.tool("complete_task", "Mark a task as done by ID or fuzzy title match", {
  task_id: z.number().optional().describe("Task ID"),
  title: z.string().optional().describe("Fuzzy match on task title"),
}, async ({ task_id, title }) => {
  const result = await tools.completeTask(task_id, title);
  return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
});

server.tool("log_metric", "Log a weekly scorecard number (upserts)", {
  week: z.number().min(1).max(8).describe("Week number (1-8)"),
  metric_name: z.enum(["dms_sent", "replies", "conversations", "posts", "upwork_proposals", "inbound_leads"]),
  value: z.number().describe("Metric value"),
}, async ({ week, metric_name, value }) => {
  const result = await tools.logMetric(week, metric_name, value);
  return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
});

server.tool("add_lead", "Add a new lead to the pipeline", {
  name: z.string().describe("Contact name"),
  store_name: z.string().optional().describe("Store/business name"),
  source: z.string().optional().describe("Where you found them"),
  contact: z.string().optional().describe("Email or LinkedIn URL"),
  notes: z.string().optional().describe("Notes about the lead"),
}, async ({ name, store_name, source, contact, notes }) => {
  const result = await tools.addLead(name, store_name, source, contact, notes);
  return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
});

server.tool("update_lead", "Update a lead's status or notes", {
  lead_id: z.number().describe("Lead ID"),
  status: z.enum(["new", "replied", "call_scheduled", "onboarding", "active", "paying", "churned"]).optional(),
  notes: z.string().optional(),
}, async ({ lead_id, status, notes }) => {
  const result = await tools.updateLead(lead_id, status, notes);
  return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
});

server.tool("list_leads", "List all leads, optionally filtered by status", {
  status: z.enum(["new", "replied", "call_scheduled", "onboarding", "active", "paying", "churned"]).optional(),
}, async ({ status }) => {
  const result = await tools.listLeads(status);
  return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
});

server.tool("add_note", "Add a freeform note with optional tags", {
  content: z.string().describe("Note text"),
  tags: z.array(z.string()).optional().describe("Tags: lead, learning, idea, follow-up, meeting, win"),
}, async ({ content, tags }) => {
  const result = await tools.addNote(content, tags);
  return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
});

server.tool("search_notes", "Search notes by keyword or tag", {
  query: z.string().optional().describe("Search text"),
  tag: z.string().optional().describe("Filter by tag"),
}, async ({ query, tag }) => {
  const result = await tools.searchNotes(query, tag);
  return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
});

server.tool("get_weekly_summary", "Full summary for a specific week with metrics, pipeline, and notes", {
  week: z.number().min(1).max(8).optional().describe("Week number (defaults to current)"),
}, async ({ week }) => {
  const result = await tools.getWeeklySummary(week);
  return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
