/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { Star, Lock } from "lucide-react";

const palette = [
  "bg-gray-400",
  "bg-blue-400",
  "bg-green-400",
  "bg-yellow-400",
  "bg-orange-400",
  "bg-purple-400",
  "bg-pink-400"
];

export default function QualitySelector({
  value,
  onChange,
  config
}: any) {
  const maxBaseQuality = config?.maxBaseQuality ?? 5;
  const qualityLevels = useMemo(() => {
    if (!config?.qualityMultipliers) return [];
    return Object.keys(config.qualityMultipliers)
      .map((k, idx) => {
        const lvl = Number(k);
        return {
          level: lvl,
          label: `Level ${k}`,
          color: palette[idx % palette.length],
          locked: lvl > maxBaseQuality
        };
      })
      .sort((a, b) => a.level - b.level);
  }, [config, maxBaseQuality]);
  if (!config || !config.qualityMultipliers) {
    return <div className="text-sm text-gray-500">Loading quality levels…</div>;
  }

  const safeValue = value ?? qualityLevels[0]?.level ?? 1;
  const selectedQuality =
    qualityLevels.find(l => l.level === safeValue) || qualityLevels[0];
  
  const currentMultiplier = config.qualityMultipliers[safeValue.toString()] || 1;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border">
        <h3 className="text-xl font-bold mb-4">Select Quality Level (Applies to All Categories)</h3>

        <div className="grid grid-cols-7 gap-3">
          {qualityLevels.map(q => (
            <button
              key={q.level}
              disabled={q.locked}
              onClick={() => !q.locked && onChange(q.level)}
              className={`transition ${
                q.locked ? "opacity-40 cursor-not-allowed" : "hover:scale-105"
              }`}
            >
              <div
                className={`p-4 rounded-xl border ${
                  safeValue === q.level && !q.locked
                    ? `${q.color} text-white border-white shadow-lg`
                    : q.locked
                    ? "bg-gray-100 border-gray-300"
                    : "bg-white border-gray-300"
                }`}
              >
                {q.locked ? (
                  <Lock className="w-8 h-8 mx-auto text-gray-500" />
                ) : (
                  <div className="text-center font-bold text-lg">{q.level}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className={`${selectedQuality.color} p-6 rounded-2xl text-white`}>
        <div className="flex items-center gap-3 mb-3">
          <Star className="w-10 h-10 fill-current" />
          <div>
            <p className="text-sm opacity-90">Selected Quality</p>
            <p className="text-3xl font-bold">{selectedQuality.label}</p>
          </div>
        </div>
        <p className="text-lg">
          Demand Multiplier: {currentMultiplier}x
        </p>
        <p className="text-sm mt-2 opacity-90">
          This quality level will be applied to all selected product categories
        </p>
      </div>
      {qualityLevels.some(q => q.locked) && (
        <div className="bg-purple-50 border p-5 rounded-2xl">
          <p className="font-bold text-purple-900">Premium Levels Locked</p>
          <p className="text-sm text-purple-700">
            Unlock Level 6 & 7 through R&D and feature investments.
          </p>
        </div>
      )}
    </div>
  );
}