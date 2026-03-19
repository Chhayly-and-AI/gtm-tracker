// src/app/tasks/page.tsx
"use client";
import { useEffect, useState, useCallback } from "react";
import TaskChecklist from "@/components/task-checklist";

interface Task {
  id: number;
  phase: number;
  title: string;
  completed: boolean;
  completed_at: string | null;
  sort_order: number;
}

type GroupedTasks = Record<string, Task[]>;

export default function TasksPage() {
  const [grouped, setGrouped] = useState<GroupedTasks | null>(null);

  const fetchTasks = useCallback(() => {
    fetch("/api/tasks")
      .then((r) => r.json())
      .then(setGrouped)
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  async function handleToggle(taskId: number, completed: boolean) {
    await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    });
    fetchTasks();
  }

  if (!grouped) {
    return (
      <div className="animate-pulse space-y-4 max-w-3xl">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 bg-gray-800 rounded-xl" />
        ))}
      </div>
    );
  }

  const allTasks = Object.values(grouped).flat();
  const totalDone = allTasks.filter((t) => t.completed).length;
  const totalCount = allTasks.length;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Checklist</h1>
        <span className="text-sm text-gray-500">
          {totalDone}/{totalCount} tasks complete
        </span>
      </div>

      {totalCount === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
          <p className="text-gray-500 text-sm">No tasks yet. Seed the database to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {[0, 1, 2, 3].map((phase) => (
            <TaskChecklist
              key={phase}
              phase={phase}
              tasks={grouped[phase] || []}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
