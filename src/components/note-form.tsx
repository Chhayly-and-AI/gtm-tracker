// src/components/note-form.tsx
"use client";
import { useState } from "react";

const PRESET_TAGS = ["lead", "learning", "idea", "follow-up", "meeting", "win"];

interface NoteFormProps { onSubmit: (content: string, tags: string[]) => void }

export default function NoteForm({ onSubmit }: NoteFormProps) {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  function toggleTag(tag: string) {
    setTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content.trim(), tags);
    setContent("");
    setTags([]);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-lg p-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a note..."
        rows={3}
        className="w-full bg-transparent text-sm text-gray-200 placeholder-gray-600 outline-none resize-none"
      />
      <div className="flex items-center justify-between mt-2">
        <div className="flex gap-1.5">
          {PRESET_TAGS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => toggleTag(t)}
              className={`text-[10px] px-2 py-1 rounded-full transition-colors cursor-pointer ${
                tags.includes(t) ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <button
          type="submit"
          disabled={!content.trim()}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white text-xs px-4 py-1.5 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>
    </form>
  );
}
