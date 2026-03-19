// src/app/page.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import PhaseProgress from "@/components/phase-progress";
import Countdown from "@/components/countdown";
import MetricCard from "@/components/metric-card";
import NoteCard from "@/components/note-card";

interface Summary {
  currentPhase: number;
  currentWeek: number;
  daysRemaining: number;
  completion: { total: number; done: number; percent: number };
  phases: { phase: number; total: number; done: number }[];
  metrics: Record<string, number>;
  pipeline: Record<string, number>;
  recentNotes: { id: number; content: string; tags: string[]; created_at: string }[];
}

const METRIC_CONFIG = [
  { key: "dms_sent", label: "DMs Sent", target: 15, color: "bg-blue-950", textColor: "text-blue-400" },
  { key: "replies", label: "Replies", color: "bg-green-950", textColor: "text-green-400" },
  { key: "conversations", label: "Conversations", color: "bg-purple-950", textColor: "text-purple-400" },
  { key: "posts", label: "LinkedIn Posts", target: 2, color: "bg-yellow-950", textColor: "text-yellow-400" },
  { key: "upwork_proposals", label: "Upwork Proposals", color: "bg-orange-950", textColor: "text-orange-400" },
  { key: "inbound_leads", label: "Inbound Leads", color: "bg-emerald-950", textColor: "text-emerald-400" },
];

const STATUS_COLORS: Record<string, string> = {
  new: "bg-gray-700", replied: "bg-blue-700", call_scheduled: "bg-purple-700",
  onboarding: "bg-yellow-700", active: "bg-green-700", paying: "bg-emerald-700", churned: "bg-red-700",
};

export default function Dashboard() {
  const [data, setData] = useState<Summary | null>(null);

  useEffect(() => {
    fetch("/api/summary").then((r) => r.json()).then(setData).catch(() => {});
  }, []);

  if (!data) return <div className="animate-pulse space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-24 bg-gray-800 rounded-xl" />)}</div>;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <span className="text-sm text-gray-500">Week {data.currentWeek} of 8</span>
      </div>

      <div className="flex items-center justify-between gap-6">
        <PhaseProgress currentPhase={data.currentPhase} phases={data.phases} />
        <Countdown daysRemaining={data.daysRemaining} />
      </div>

      <div>
        <h2 className="text-sm font-medium text-gray-400 mb-3">This Week&apos;s Scorecard</h2>
        <div className="grid grid-cols-3 gap-3">
          {METRIC_CONFIG.map((m) => (
            <MetricCard key={m.key} label={m.label} value={data.metrics[m.key] || 0} target={m.target} color={m.color} textColor={m.textColor} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="text-sm font-medium text-gray-400 mb-3">Pipeline</h2>
          {Object.keys(data.pipeline).length === 0 ? (
            <p className="text-sm text-gray-600">No leads yet. <Link href="/leads" className="text-blue-400 hover:underline">Add your first lead</Link></p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {Object.entries(data.pipeline).map(([status, count]) => (
                <span key={status} className={`text-xs px-3 py-1.5 rounded-full text-white ${STATUS_COLORS[status] || "bg-gray-700"}`}>
                  {status.replace("_", " ")}: {count}
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-sm font-medium text-gray-400 mb-3">Recent Notes</h2>
          {data.recentNotes.length === 0 ? (
            <p className="text-sm text-gray-600">No notes yet. <Link href="/notes" className="text-blue-400 hover:underline">Add a note</Link></p>
          ) : (
            <div className="space-y-2">
              {data.recentNotes.map((n) => (
                <NoteCard key={n.id} content={n.content} tags={n.tags} createdAt={n.created_at} compact />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <Link href="/leads" className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-lg transition-colors">Add Lead</Link>
        <Link href="/notes" className="bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm px-4 py-2 rounded-lg transition-colors">Add Note</Link>
        <Link href="/tasks" className="bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm px-4 py-2 rounded-lg transition-colors">View Checklist</Link>
      </div>
    </div>
  );
}
