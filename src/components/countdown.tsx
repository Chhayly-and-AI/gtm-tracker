// src/components/countdown.tsx
interface CountdownProps { daysRemaining: number }

export default function Countdown({ daysRemaining }: CountdownProps) {
  const weeks = Math.floor(daysRemaining / 7);
  const days = daysRemaining % 7;
  const urgency = daysRemaining <= 14 ? "text-red-400" : daysRemaining <= 28 ? "text-yellow-400" : "text-green-400";
  return (
    <div className="flex items-center gap-3 bg-gray-900 rounded-xl p-4 border border-gray-800">
      <span className={`text-3xl font-bold ${urgency}`}>{daysRemaining}</span>
      <div>
        <p className="text-sm text-gray-300">days remaining</p>
        <p className="text-xs text-gray-500">{weeks}w {days}d until validation deadline</p>
      </div>
    </div>
  );
}
