import React from "react";
import { Lock, Unlock } from "lucide-react";

interface RoundsStripProps {
  currentRound: number;
  maxRounds: number;
}

export default function RoundsStrip({ currentRound, maxRounds }: RoundsStripProps) {
  return (
    
    <div className="flex items-center gap-2 overflow-x-auto pb-2 ">
      {Array.from({ length: maxRounds }, (_, i) => i + 1).map((round) => (
        <div
          key={round}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
            round === currentRound
              ? "bg-blue-600 text-white"
              : round < currentRound
              ? "bg-green-100 text-green-700"
              : "bg-slate-100 text-slate-400"
          }`}
        >
          {round <= currentRound ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          Round {round}
        </div>
      ))}
    </div>
  );
}