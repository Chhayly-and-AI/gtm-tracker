// src/components/nav.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/leads", label: "Pipeline", icon: "🎯" },
  { href: "/tasks", label: "Checklist", icon: "✅" },
  { href: "/notes", label: "Notes", icon: "📝" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col p-4 gap-1">
      <div className="flex items-center gap-2 mb-6 px-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg" />
        <span className="font-bold text-sm">GTM Tracker</span>
      </div>
      {links.map((l) => {
        const active = pathname === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              active
                ? "bg-gray-800 text-white font-medium"
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
            }`}
          >
            <span>{l.icon}</span>
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
