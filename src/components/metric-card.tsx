// src/components/metric-card.tsx
interface MetricCardProps {
  label: string;
  value: number;
  target?: number;
  color: string; // tailwind bg class like "bg-blue-950"
  textColor: string; // like "text-blue-400"
}

export default function MetricCard({ label, value, target, color, textColor }: MetricCardProps) {
  const pct = target ? Math.round((value / target) * 100) : null;
  return (
    <div className={`p-4 rounded-xl ${color}`}>
      <p className="text-[10px] uppercase tracking-wide text-gray-400">{label}</p>
      <div className="flex items-end gap-2 mt-1">
        <span className={`text-2xl font-bold ${textColor}`}>{value}</span>
        {target && <span className="text-xs text-gray-500">/ {target}</span>}
      </div>
      {pct !== null && (
        <div className="mt-2">
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${pct >= 100 ? "bg-green-500" : pct >= 50 ? "bg-blue-500" : "bg-orange-500"}`}
              style={{ width: `${Math.min(100, pct)}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-500 mt-1">{pct}% of target</p>
        </div>
      )}
    </div>
  );
}
