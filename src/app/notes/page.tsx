// src/app/notes/page.tsx
"use client";
import { useEffect, useState, useCallback } from "react";
import NoteForm from "@/components/note-form";
import NoteCard from "@/components/note-card";

interface Note {
  id: number;
  content: string;
  tags: string[];
  created_at: string;
}

const ALL_TAGS = ["lead", "learning", "idea", "follow-up", "meeting", "win"];

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[] | null>(null);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const fetchNotes = useCallback((q?: string, tag?: string | null) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (tag) params.set("tag", tag);
    const qs = params.toString();
    fetch(`/api/notes${qs ? `?${qs}` : ""}`)
      .then((r) => r.json())
      .then(setNotes)
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  function handleSearch(value: string) {
    setSearch(value);
    fetchNotes(value, activeTag);
  }

  function handleTagFilter(tag: string) {
    const newTag = activeTag === tag ? null : tag;
    setActiveTag(newTag);
    fetchNotes(search, newTag);
  }

  async function handleSubmit(content: string, tags: string[]) {
    await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, tags }),
    });
    fetchNotes(search, activeTag);
  }

  if (!notes) {
    return (
      <div className="animate-pulse space-y-4 max-w-3xl">
        <div className="h-32 bg-gray-800 rounded-xl" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-800 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-xl font-bold">Notes</h1>

      <NoteForm onSubmit={handleSubmit} />

      <div className="space-y-3">
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search notes..."
          className="w-full bg-gray-900 text-sm text-gray-200 placeholder-gray-600 rounded-lg px-4 py-2.5 outline-none border border-gray-800 focus:border-blue-500 transition-colors"
        />

        <div className="flex gap-1.5 flex-wrap">
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagFilter(tag)}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                activeTag === tag
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
          <p className="text-gray-500 text-sm">
            {search || activeTag ? "No notes match your filters." : "No notes yet. Add your first note above."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              content={note.content}
              tags={note.tags}
              createdAt={note.created_at}
            />
          ))}
        </div>
      )}
    </div>
  );
}
