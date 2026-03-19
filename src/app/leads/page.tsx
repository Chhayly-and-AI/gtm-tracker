// src/app/leads/page.tsx
"use client";
import { useEffect, useState, useCallback } from "react";
import KanbanBoard from "@/components/kanban-board";

interface Lead {
  id: number;
  name: string;
  store_name: string | null;
  source: string | null;
  contact: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[] | null>(null);

  const fetchLeads = useCallback(() => {
    fetch("/api/leads")
      .then((r) => r.json())
      .then(setLeads)
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  async function handleStatusChange(leadId: number, newStatus: string) {
    await fetch(`/api/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchLeads();
  }

  async function handleUpdateLead(leadId: number, data: Partial<Lead>) {
    await fetch(`/api/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    fetchLeads();
  }

  async function handleAddLead(name: string) {
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    fetchLeads();
  }

  if (!leads) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-32 bg-gray-800 rounded" />
        <div className="flex gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-56 h-64 bg-gray-800 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Pipeline</h1>
        <span className="text-sm text-gray-500">{leads.length} leads</span>
      </div>

      <KanbanBoard
        leads={leads}
        onStatusChange={handleStatusChange}
        onUpdateLead={handleUpdateLead}
        onAddLead={handleAddLead}
      />
    </div>
  );
}
