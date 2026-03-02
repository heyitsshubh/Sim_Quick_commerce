import { Users, TrendingUp, BookOpen, BarChart3 } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

const workforceData = [
  { round: "R1", stayed: 0, newStaff: 70, external: 4, leftStaff: -2 },
  { round: "R2", stayed: 75, newStaff: 8, external: 4, leftStaff: -3 },
  { round: "R3", stayed: 82, newStaff: 9, external: 4, leftStaff: -4 },
  { round: "R4", stayed: 90, newStaff: 9, external: 5, leftStaff: -4 },
  { round: "R5", stayed: 99, newStaff: 10, external: 5, leftStaff: -4 },
];

const indicatorsData = [
  { round: "R1", workload: 50, motivation: 100, education: 62 },
  { round: "R2", workload: 58, motivation: 95, education: 66 },
  { round: "R3", workload: 64, motivation: 90, education: 70 },
  { round: "R4", workload: 70, motivation: 85, education: 73 },
  { round: "R5", workload: 78, motivation: 80, education: 76 },
];

export default function StaffTab() {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-sm font-semibold text-blue-700">
        External staff: 2× expensive, 30% less efficient.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <Users className="w-5 h-5 text-blue-600 mb-2" />
          <p className="text-4xl font-bold text-blue-700">108</p>
          <p className="text-sm font-semibold text-slate-600">Total Staff</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <TrendingUp className="w-5 h-5 text-emerald-600 mb-2" />
          <p className="text-4xl font-bold text-emerald-700">80.0%</p>
          <p className="text-sm font-semibold text-slate-600">Motivation</p>
        </div>
        <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
          <BookOpen className="w-5 h-5 text-violet-600 mb-2" />
          <p className="text-4xl font-bold text-violet-700">81.5%</p>
          <p className="text-sm font-semibold text-slate-600">Education</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <BarChart3 className="w-5 h-5 text-red-500 mb-2" />
          <p className="text-4xl font-bold text-red-600">83.0%</p>
          <p className="text-sm font-semibold text-slate-600">Workload</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Workforce</h3>
        <div className="flex items-center gap-3 text-sm text-slate-600 mb-3">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" />Stayed</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />New</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />External</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-400" />Left</span>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={workforceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="round" tick={{ fontSize: 12, fill: "#64748b" }} />
            <YAxis domain={[-40, 120]} tick={{ fontSize: 11, fill: "#94a3b8" }} />
            <Tooltip />
            <Bar dataKey="stayed" stackId="a" fill="#3b82f6" />
            <Bar dataKey="newStaff" stackId="a" fill="#10b981" />
            <Bar dataKey="external" stackId="a" fill="#22d3ee" />
            <Bar dataKey="leftStaff" fill="#f87171" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Key Indicators</h3>
        <div className="flex items-center gap-3 text-sm text-slate-600 mb-3">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-400" />Workload</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />Motivation</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-violet-500" />Education</span>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={indicatorsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="round" tick={{ fontSize: 12, fill: "#64748b" }} />
            <YAxis domain={[0, 110]} tick={{ fontSize: 11, fill: "#94a3b8" }} />
            <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
            <Line type="monotone" dataKey="workload" stroke="#f87171" strokeWidth={2} dot={{ r: 3, fill: "#f87171" }} />
            <Line type="monotone" dataKey="motivation" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: "#10b981" }} />
            <Line type="monotone" dataKey="education" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3, fill: "#8b5cf6" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}