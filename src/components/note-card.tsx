// src/components/note-card.tsx
interface NoteCardProps {
  content: string;
  tags: string[];
  createdAt: string;
  compact?: boolean;
}

const TAG_COLORS: Record<string, string> = {
  lead: "bg-blue-900 text-blue-300",
  learning: "bg-purple-900 text-purple-300",
  idea: "bg-yellow-900 text-yellow-300",
  "follow-up": "bg-orange-900 text-orange-300",
  meeting: "bg-green-900 text-green-300",
  win: "bg-emerald-900 text-emerald-300",
};

export default function NoteCard({ content, tags, createdAt, compact }: NoteCardProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-3">
      <p className={`text-sm text-gray-200 ${compact ? "line-clamp-2" : ""}`}>{content}</p>
      <div className="flex items-center gap-2 mt-2">
        {tags.map((t) => (
          <span key={t} className={`text-[10px] px-2 py-0.5 rounded-full ${TAG_COLORS[t] || "bg-gray-800 text-gray-400"}`}>
            {t}
          </span>
        ))}
        <span className="text-[10px] text-gray-600 ml-auto">
          {new Date(createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
