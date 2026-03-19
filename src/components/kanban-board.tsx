// src/components/kanban-board.tsx
"use client";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import LeadCard from "./lead-card";

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

const STATUSES = [
  { key: "new", label: "New", color: "border-gray-600" },
  { key: "replied", label: "Replied", color: "border-blue-600" },
  { key: "call_scheduled", label: "Call Scheduled", color: "border-purple-600" },
  { key: "onboarding", label: "Onboarding", color: "border-yellow-600" },
  { key: "active", label: "Active", color: "border-green-600" },
  { key: "paying", label: "Paying", color: "border-emerald-600" },
  { key: "churned", label: "Churned", color: "border-red-600" },
];

interface KanbanBoardProps {
  leads: Lead[];
  onStatusChange: (leadId: number, newStatus: string) => void;
  onUpdateLead: (leadId: number, data: Partial<Lead>) => void;
  onAddLead: (name: string) => void;
}

export default function KanbanBoard({ leads, onStatusChange, onUpdateLead, onAddLead }: KanbanBoardProps) {
  const [addingNew, setAddingNew] = useState(false);
  const [newName, setNewName] = useState("");

  const grouped: Record<string, Lead[]> = {};
  for (const s of STATUSES) grouped[s.key] = [];
  for (const lead of leads) {
    if (!grouped[lead.status]) grouped[lead.status] = [];
    grouped[lead.status].push(lead);
  }

  function handleDragEnd(result: DropResult) {
    if (!result.destination) return;
    const leadId = parseInt(result.draggableId, 10);
    const newStatus = result.destination.droppableId;
    if (result.source.droppableId !== newStatus) {
      onStatusChange(leadId, newStatus);
    }
  }

  function handleAddLead() {
    if (!newName.trim()) return;
    onAddLead(newName.trim());
    setNewName("");
    setAddingNew(false);
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-3 overflow-x-auto pb-4" style={{ minHeight: "calc(100vh - 10rem)" }}>
        {STATUSES.map((status) => (
          <div
            key={status.key}
            className={`flex-shrink-0 w-56 bg-gray-900 rounded-xl border-t-2 ${status.color}`}
          >
            <div className="p-3 flex items-center justify-between">
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                {status.label}
              </h3>
              <span className="text-xs text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded">
                {grouped[status.key].length}
              </span>
            </div>

            <Droppable droppableId={status.key}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`p-2 min-h-[100px] space-y-2 transition-colors ${
                    snapshot.isDraggingOver ? "bg-gray-800/50" : ""
                  }`}
                >
                  {grouped[status.key].map((lead, index) => (
                    <Draggable key={lead.id} draggableId={String(lead.id)} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={snapshot.isDragging ? "opacity-90 rotate-2" : ""}
                        >
                          <LeadCard lead={lead} onUpdate={onUpdateLead} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {status.key === "new" && (
              <div className="p-2 border-t border-gray-800">
                {addingNew ? (
                  <div className="space-y-2">
                    <input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Lead name..."
                      autoFocus
                      onKeyDown={(e) => e.key === "Enter" && handleAddLead()}
                      className="w-full bg-gray-800 text-sm text-gray-200 rounded px-2 py-1.5 outline-none border border-gray-700 focus:border-blue-500"
                    />
                    <div className="flex gap-1.5">
                      <button
                        onClick={handleAddLead}
                        className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1 rounded transition-colors cursor-pointer"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => { setAddingNew(false); setNewName(""); }}
                        className="text-gray-500 hover:text-gray-300 text-xs px-2 py-1 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setAddingNew(true)}
                    className="w-full text-xs text-gray-500 hover:text-gray-300 py-1.5 transition-colors cursor-pointer"
                  >
                    + Add Lead
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
