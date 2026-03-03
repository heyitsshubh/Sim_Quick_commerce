import { useEffect, useState } from "react";
import axios from "axios";
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

const currencyTick = (v: number) => {
  if (v >= 1e7) return `${(v / 1e7).toFixed(0)}Cr`;
  return `${Math.round(v / 1e5)}L`;
};

const percentTick = (v: number) => `${v}`;

export default function ScoresTargetsTab() {
  const [view, setView] = useState<ScoreView>("progress");
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    axios
      .get("https://sim-quick-commerce-backend.onrender.com/api/scores?round=R1")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!data) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-5">
      {/* ✅ Total Score Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 text-white border border-blue-500 shadow-sm">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-blue-200 text-lg font-bold uppercase tracking-wider">
              New Total Ranking Score
            </p>
            <p className="text-6xl font-bold mt-1">
              {data.totalScore.toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-8 h-8 text-amber-300" />
            <div className="text-right">
              <p className="text-blue-200 text-sm">Previous rounds</p>
              <p className="text-5xl font-bold">
                {data.previousScore.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setView("achieved")}
          className={`px-4 py-2 rounded-xl font-semibold text-lg shadow-sm ${
            view === "achieved"
              ? "bg-blue-600 text-white"
              : "bg-white border border-slate-200 text-slate-600"
          }`}
        >
          Achieved Targets&nbsp;&nbsp;{data.achievedTotal}
        </button>

        <button
          onClick={() => setView("progress")}
          className={`px-4 py-2 rounded-xl font-semibold text-lg shadow-sm ${
            view === "progress"
              ? "bg-blue-600 text-white"
              : "bg-white border border-slate-200 text-slate-600"
          }`}
        >
          Progress Targets&nbsp;&nbsp;{data.progressTotal}
        </button>

        <button
          onClick={() => setView("charts")}
          className={`px-4 py-2 rounded-xl font-semibold text-lg shadow-sm ${
            view === "charts"
              ? "bg-blue-600 text-white"
              : "bg-white border border-slate-200 text-slate-600"
          }`}
        >
          Target Charts
        </button>
      </div>

      {/* ✅ Achieved Table */}
      {view === "achieved" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-3xl font-bold">Points for Achieving Targets</h3>
            <span className="text-4xl font-bold text-emerald-600">
              {data.achievedTotal}
            </span>
          </div>

          <table className="w-full text-sm md:text-base">
            <tbody>
              {data.achievedRows.map((row: any) => (
                <tr key={row.target} className="border-b border-slate-100">
                  <td className="py-3">
                    <div className="font-bold text-xl">{row.target}</div>
                    {row.desc && (
                      <div className="text-slate-500">{row.desc}</div>
                    )}
                  </td>
                  <td className="text-right">{row.maxPoints}</td>
                  <td className="text-center">
                    {row.achieved ? (
                      <CheckCircle2 className="text-emerald-500 mx-auto" />
                    ) : (
                      <XCircle className="text-slate-300 mx-auto" />
                    )}
                  </td>
                  <td className="text-right font-bold">
                    {row.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ✅ Progress Table */}
      {view === "progress" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-3xl font-bold">
              Points for Progress Towards Targets
            </h3>
            <span className="text-4xl font-bold text-blue-600">
              {data.progressTotal}
            </span>
          </div>

          <table className="w-full text-sm md:text-base">
            <tbody>
              {data.progressRows.map((row: any) => (
                <tr key={row.target} className="border-b border-slate-100">
                  <td className="py-3">
                    <div className="font-bold text-xl">{row.target}</div>
                    {row.desc && (
                      <div className="text-slate-500">{row.desc}</div>
                    )}
                  </td>
                  <td className="text-right">{row.min}</td>
                  <td className="text-right">{row.max}</td>
                  <td className="text-right">{row.currentTarget}</td>
                  <td className="text-right font-bold text-blue-600">
                    {row.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ✅ Charts */}
      {view === "charts" && (
        <div className="space-y-4">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data.profitChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="round" />
              <YAxis tickFormatter={currencyTick} />
              <Tooltip formatter={(v) => `₹${(Number(v) / 1e7).toFixed(2)} Cr`} />
              <Area type="monotone" dataKey="actual" stroke="#10b981" fill="#10b98120" />
            </AreaChart>
          </ResponsiveContainer>

          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data.educationChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="round" />
              <YAxis tickFormatter={percentTick} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Line type="monotone" dataKey="actual" stroke="#8b5cf6" />
              <Line type="monotone" dataKey="target" stroke="#f59e0b" strokeDasharray="6 4" />
            </LineChart>
          </ResponsiveContainer>

          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data.solvencyChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="round" />
              <YAxis tickFormatter={percentTick} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Line type="monotone" dataKey="actual" stroke="#3b82f6" />
              <Line type="monotone" dataKey="target" stroke="#f59e0b" strokeDasharray="6 4" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ✅ Previous Score Footer */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-5 flex justify-between">
        <div className="flex items-center gap-2">
          <Star className="text-amber-500" />
          <span className="text-2xl font-bold">
            Points from previous rounds
          </span>
        </div>
        <span className="text-4xl font-bold">
          {data.previousScore.toLocaleString()}
        </span>
      </div>
    </div>
  );
}