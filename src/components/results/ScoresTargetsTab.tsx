import { Trophy, CheckCircle2, XCircle, Star } from "lucide-react";

const achievedRows = [
  {
    target: "Achieved net profit",
    desc: "Key point indicators (KPIs)",
    maxPoints: "500.00",
    achieved: true,
    points: "500.00",
  },
  {
    target: "Highest quality (quality segment)",
    maxPoints: "75.00",
    achieved: true,
    points: "75.00",
  },
  {
    target: "Market leader in quality segments",
    desc: "Measured in market share",
    maxPoints: "75.00",
    achieved: true,
    points: "75.00",
  },
  {
    target: "Education level of staff",
    maxPoints: "62.50",
    achieved: false,
    points: "0.00",
  },
  {
    target: "Solvency",
    maxPoints: "60.00",
    achieved: false,
    points: "0.00",
  },
];

export default function ScoresTargetsTab() {
  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 text-white border border-blue-500 shadow-sm">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-blue-200 text-lg font-bold uppercase tracking-wider">New Total Ranking Score</p>
            <p className="text-6xl font-bold mt-1">7,334</p>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-8 h-8 text-amber-300" />
            <div className="text-right">
              <p className="text-blue-200 text-sm">Previous rounds</p>
              <p className="text-5xl font-bold">6,400</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-lg shadow-sm">Achieved Targets&nbsp;&nbsp;650.0</button>
        <button className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 font-semibold text-lg">Progress Targets&nbsp;&nbsp;284.2</button>
        <button className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 font-semibold text-lg">Target Charts</button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-emerald-500 rounded" />
            <h3 className="text-3xl font-bold text-slate-900">Points for Achieving Targets</h3>
          </div>
          <span className="text-4xl font-bold text-emerald-600">650.0</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600">
                <th className="text-left py-3 font-semibold">Target</th>
                <th className="text-right py-3 font-semibold">Points if achieved</th>
                <th className="text-center py-3 font-semibold">Achieved?</th>
                <th className="text-right py-3 font-semibold">Points</th>
              </tr>
            </thead>
            <tbody>
              {achievedRows.map((row) => (
                <tr key={row.target} className="border-b border-slate-100">
                  <td className="py-3 pr-2">
                    <div className="font-bold text-2xl text-slate-900">{row.target}</div>
                    {row.desc && <div className="text-slate-500 text-lg">{row.desc}</div>}
                  </td>
                  <td className="py-3 text-right text-2xl text-slate-600">{row.maxPoints}</td>
                  <td className="py-3 text-center">
                    {row.achieved ? (
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                    ) : (
                      <XCircle className="w-8 h-8 text-slate-300 mx-auto" />
                    )}
                  </td>
                  <td className={`py-3 text-right text-3xl font-bold ${row.achieved ? "text-emerald-600" : "text-slate-400"}`}>
                    {row.points}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-300">
                <td colSpan={3} className="py-3 text-right text-3xl font-bold text-slate-900">Points received this round</td>
                <td className="py-3 text-right text-3xl font-bold text-emerald-600">650.00</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-900">
          <Star className="w-7 h-7 text-amber-500" />
          <span className="text-3xl font-bold">Points from previous rounds</span>
        </div>
        <span className="text-5xl font-bold text-slate-700">6,400</span>
      </div>
    </div>
  );
}