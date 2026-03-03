import { useState } from "react";
import { Trophy, CheckCircle2, XCircle, Star } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ScoreView = "achieved" | "progress" | "charts";

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

const progressRows = [
  {
    target: "Achieved net profit",
    desc: "Key point indicators (KPIs)",
    min: "₹5.00 L",
    max: "₹10.00 Cr",
    currentTarget: "₹1.27 Cr / ₹7.00 Cr",
    points: "91.00",
  },
  {
    target: "Highest quality (quality segment)",
    min: "5",
    max: "1",
    currentTarget: "2.00 / 1.00",
    points: "56.00",
  },
  {
    target: "Market leader in quality segments",
    desc: "Measured in market share",
    min: "5",
    max: "1",
    currentTarget: "2.00 / 1.00",
    points: "56.00",
  },
  {
    target: "Education level of staff",
    min: "60.00%",
    max: "100.00%",
    currentTarget: "81.5% / 85.00%",
    points: "59.90",
  },
  {
    target: "Solvency",
    min: "50.00%",
    max: "100.00%",
    currentTarget: "28.5% / 80.00%",
    points: "21.30",
  },
];

const profitChartData = [
  { round: "R1", actual: 5500000, target: 70000000 },
  { round: "R2", actual: 7200000, target: 70000000 },
  { round: "R3", actual: 9000000, target: 70000000 },
  { round: "R4", actual: 10200000, target: 70000000 },
  { round: "R5", actual: 12700000, target: 70000000 },
];

const eduChartData = [
  { round: "R1", actual: 70, target: 85 },
  { round: "R2", actual: 73, target: 85 },
  { round: "R3", actual: 75, target: 85 },
  { round: "R4", actual: 78, target: 85 },
  { round: "R5", actual: 81.5, target: 85 },
];

const solvencyChartData = [
  { round: "R1", actual: 23.0, target: 80 },
  { round: "R2", actual: 23.2, target: 80 },
  { round: "R3", actual: 24.4, target: 80 },
  { round: "R4", actual: 26.0, target: 80 },
  { round: "R5", actual: 28.5, target: 80 },
];

const currencyTick = (v: number) => {
  if (v >= 1e7) return `${(v / 1e7).toFixed(0)}Cr`;
  return `${Math.round(v / 1e5)}L`;
};

const percentTick = (v: number) => `${v}`;

export default function ScoresTargetsTab() {
  const [view, setView] = useState<ScoreView>("progress");

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
        <button
          onClick={() => setView("achieved")}
          className={`px-4 py-2 rounded-xl font-semibold text-lg shadow-sm ${
            view === "achieved" ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600"
          }`}
        >
          Achieved Targets&nbsp;&nbsp;650.0
        </button>
        <button
          onClick={() => setView("progress")}
          className={`px-4 py-2 rounded-xl font-semibold text-lg shadow-sm ${
            view === "progress" ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600"
          }`}
        >
          Progress Targets&nbsp;&nbsp;284.2
        </button>
        <button
          onClick={() => setView("charts")}
          className={`px-4 py-2 rounded-xl font-semibold text-lg shadow-sm ${
            view === "charts" ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600"
          }`}
        >
          Target Charts
        </button>
      </div>

      {view === "achieved" && (
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
      )}

      {view === "progress" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-5">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-500 rounded" />
              <h3 className="text-3xl font-bold text-slate-900">Points for Progress Towards Targets</h3>
            </div>
            <span className="text-4xl font-bold text-blue-600">284.20</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm md:text-base">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600">
                  <th className="text-left py-3 font-semibold">Target</th>
                  <th className="text-right py-3 font-semibold">Min</th>
                  <th className="text-right py-3 font-semibold">Max</th>
                  <th className="text-right py-3 font-semibold">Current / Target</th>
                  <th className="text-right py-3 font-semibold">Points</th>
                </tr>
              </thead>
              <tbody>
                {progressRows.map((row) => (
                  <tr key={row.target} className="border-b border-slate-100">
                    <td className="py-3 pr-2">
                      <div className="font-bold text-2xl text-slate-900">{row.target}</div>
                      {row.desc && <div className="text-slate-500 text-lg">{row.desc}</div>}
                    </td>
                    <td className="py-3 text-right text-xl text-slate-500">{row.min}</td>
                    <td className="py-3 text-right text-xl text-slate-500">{row.max}</td>
                    <td className="py-3 text-right text-2xl font-semibold text-slate-900">{row.currentTarget}</td>
                    <td className="py-3 text-right text-3xl font-bold text-blue-600">{row.points}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-slate-300">
                  <td colSpan={4} className="py-3 text-right text-3xl font-bold text-slate-900">Points received this round</td>
                  <td className="py-3 text-right text-3xl font-bold text-blue-600">284.20</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {view === "charts" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-5">
            <h3 className="text-3xl font-bold text-slate-900">Achieved Net Profit</h3>
            <p className="text-slate-500 text-xl mb-3">Profit after interest and taxes — target ₹7 Cr</p>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={profitChartData}>
                <defs>
                  <linearGradient id="profitFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="round" tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickFormatter={currencyTick} domain={[0, 80000000]} />
                <Tooltip formatter={(value) => `₹${(Number(value) / 1e7).toFixed(2)} Cr`} />
                <Area type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} fill="url(#profitFill)" dot={{ r: 4, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-5">
              <h3 className="text-3xl font-bold text-slate-900">Education Level of Staff</h3>
              <p className="text-slate-500 text-xl mb-3">Max 100% — target 85%</p>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={eduChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="round" tick={{ fontSize: 12, fill: "#64748b" }} />
                  <YAxis domain={[55, 105]} tickFormatter={percentTick} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
                  <Line type="monotone" dataKey="target" stroke="#f59e0b" strokeWidth={2.5} strokeDasharray="6 4" dot={false} />
                  <Line type="monotone" dataKey="actual" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: "#8b5cf6", stroke: "#fff", strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-5">
              <h3 className="text-3xl font-bold text-slate-900">Solvency</h3>
              <p className="text-slate-500 text-xl mb-3">Owner's equity / total assets — target 80%</p>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={solvencyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="round" tick={{ fontSize: 12, fill: "#64748b" }} />
                  <YAxis domain={[20, 110]} tickFormatter={percentTick} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
                  <Line type="monotone" dataKey="target" stroke="#f59e0b" strokeWidth={2.5} strokeDasharray="6 4" dot={false} />
                  <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

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