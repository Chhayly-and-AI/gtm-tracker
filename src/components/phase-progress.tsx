// src/components/phase-progress.tsx
const PHASE_NAMES = ["Foundation", "Outreach", "Convert", "Validate"];

interface PhaseProgressProps {
  currentPhase: number;
  phases: { phase: number; total: number; done: number }[];
}

export default function PhaseProgress({ currentPhase, phases }: PhaseProgressProps) {
  return (
    <div className="flex items-center gap-2">
      {phases.map((p, i) => {
        const complete = p.done === p.total && p.total > 0;
        const active = i === currentPhase;
        return (
          <div key={i} className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                  complete
                    ? "bg-green-600 border-green-500 text-white"
                    : active
                    ? "bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/30"
                    : "bg-gray-800 border-gray-700 text-gray-500"
                }`}
              >
                {complete ? "✓" : i}
              </div>
              <span className={`text-[10px] mt-1 ${active ? "text-blue-400 font-medium" : "text-gray-600"}`}>
                {PHASE_NAMES[i]}
              </span>
            </div>
            {i < 3 && (
              <div className={`w-12 h-0.5 mb-4 ${complete ? "bg-green-600" : "bg-gray-800"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
