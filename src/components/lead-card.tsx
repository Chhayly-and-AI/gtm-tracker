// src/components/lead-card.tsx
"use client";
import { useState } from "react";

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

const SOURCE_COLORS: Record<string, string> = {
  linkedin: "bg-blue-900 text-blue-300",
  upwork: "bg-green-900 text-green-300",
  referral: "bg-purple-900 text-purple-300",
  inbound: "bg-yellow-900 text-yellow-300",
  cold: "bg-gray-700 text-gray-300",
};

interface LeadCardProps {
  lead: Lead;
  onUpdate: (id: number, data: Partial<Lead>) => void;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function LeadCard({ lead, onUpdate }: LeadCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState({
    name: lead.name,
    store_name: lead.store_name || "",
    source: lead.source || "",
    contact: lead.contact || "",
    notes: lead.notes || "",
  });

  function handleSave() {
    onUpdate(lead.id, {
      name: editing.name,
      store_name: editing.store_name || null,
      source: editing.source || null,
      contact: editing.contact || null,
      notes: editing.notes || null,
    });
    setExpanded(false);
  }

  return (
    <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 hover:border-gray-600 transition-colors">
      <div
        className="cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <p className="text-sm font-medium text-gray-200 truncate">{lead.name}</p>
        {lead.store_name && (
          <p className="text-xs text-gray-400 truncate mt-0.5">{lead.store_name}</p>
        )}
        <div className="flex items-center gap-2 mt-2">
          {lead.source && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${SOURCE_COLORS[lead.source.toLowerCase()] || "bg-gray-700 text-gray-400"}`}>
              {lead.source}
            </span>
          )}
          <span className="text-[10px] text-gray-500 ml-auto">{timeAgo(lead.updated_at)}</span>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-700 space-y-2" onClick={(e) => e.stopPropagation()}>
          <input
            value={editing.name}
            onChange={(e) => setEditing({ ...editing, name: e.target.value })}
            placeholder="Name"
            className="w-full bg-gray-900 text-sm text-gray-200 rounded px-2 py-1.5 outline-none border border-gray-700 focus:border-blue-500"
          />
          <input
            value={editing.store_name}
            onChange={(e) => setEditing({ ...editing, store_name: e.target.value })}
            placeholder="Store name"
            className="w-full bg-gray-900 text-sm text-gray-200 rounded px-2 py-1.5 outline-none border border-gray-700 focus:border-blue-500"
          />
          <input
            value={editing.source}
            onChange={(e) => setEditing({ ...editing, source: e.target.value })}
            placeholder="Source"
            className="w-full bg-gray-900 text-sm text-gray-200 rounded px-2 py-1.5 outline-none border border-gray-700 focus:border-blue-500"
          />
          <input
            value={editing.contact}
            onChange={(e) => setEditing({ ...editing, contact: e.target.value })}
            placeholder="Contact"
            className="w-full bg-gray-900 text-sm text-gray-200 rounded px-2 py-1.5 outline-none border border-gray-700 focus:border-blue-500"
          />
          <textarea
            value={editing.notes}
            onChange={(e) => setEditing({ ...editing, notes: e.target.value })}
            placeholder="Notes"
            rows={2}
            className="w-full bg-gray-900 text-sm text-gray-200 rounded px-2 py-1.5 outline-none border border-gray-700 focus:border-blue-500 resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded transition-colors cursor-pointer"
            >
              Save
            </button>
            <button
              onClick={() => setExpanded(false)}
              className="bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs px-3 py-1.5 rounded transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
