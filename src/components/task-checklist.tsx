// src/components/task-checklist.tsx
"use client";
import { useState } from "react";

interface Task {
  id: number;
  phase: number;
  title: string;
  completed: boolean;
  completed_at: string | null;
  sort_order: number;
}

const PHASE_NAMES: Record<number, string> = {
  0: "Foundation",
  1: "Outreach",
  2: "Convert",
  3: "Validate",
};

interface TaskChecklistProps {
  phase: number;
  tasks: Task[];
  onToggle: (taskId: number, completed: boolean) => void;
}

export default function TaskChecklist({ phase, tasks, onToggle }: TaskChecklistProps) {
  const [open, setOpen] = useState(true);
  const doneCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const pct = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;
  const allDone = totalCount > 0 && doneCount === totalCount;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">{PHASE_NAMES[phase] || `Phase ${phase}`}</span>
          <span className={`text-xs px-2.5 py-0.5 rounded-full ${
            allDone ? "bg-green-900 text-green-300" : "bg-gray-800 text-gray-400"
          }`}>
            {doneCount}/{totalCount} — {pct}%
          </span>
        </div>
        <span className="text-gray-500 text-sm">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="border-t border-gray-800">
          {allDone && (
            <div className="bg-green-950 border-b border-green-900 px-4 py-2.5 text-sm text-green-300 font-medium">
              Phase complete!
            </div>
          )}
          <ul className="divide-y divide-gray-800/50">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800/30 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggle(task.id, !task.completed)}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer accent-blue-500"
                />
                <span
                  className={`text-sm transition-all ${
                    task.completed ? "text-gray-500 line-through" : "text-gray-200"
                  }`}
                >
                  {task.title}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
