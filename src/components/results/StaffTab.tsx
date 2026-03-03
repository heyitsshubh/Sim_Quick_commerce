import { useEffect, useState } from "react";
import axios from "axios";
import { Users, TrendingUp, BookOpen, BarChart3 } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip
} from "recharts";

export default function StaffTab() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    axios
      .get("https://sim-quick-commerce-backend.onrender.com/api/staff?round=R1")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!data) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-sm font-semibold text-blue-700">
        External staff: 2× expensive, 30% less efficient.
      </div>

      {/* ✅ Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <Users className="w-5 h-5 text-blue-600 mb-2" />
          <p className="text-4xl font-bold text-blue-700">
            {data.summary.totalStaff}
          </p>
          <p className="text-sm font-semibold text-slate-600">Total Staff</p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <TrendingUp className="w-5 h-5 text-emerald-600 mb-2" />
          <p className="text-4xl font-bold text-emerald-700">
            {data.summary.motivation.toFixed(1)}%
          </p>
          <p className="text-sm font-semibold text-slate-600">Motivation</p>
        </div>

        <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
          <BookOpen className="w-5 h-5 text-violet-600 mb-2" />
          <p className="text-4xl font-bold text-violet-700">
            {data.summary.education.toFixed(1)}%
          </p>
          <p className="text-sm font-semibold text-slate-600">Education</p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <BarChart3 className="w-5 h-5 text-red-500 mb-2" />
          <p className="text-4xl font-bold text-red-600">
            {data.summary.workload.toFixed(1)}%
          </p>
          <p className="text-sm font-semibold text-slate-600">Workload</p>
        </div>
      </div>

      {/* ✅ Workforce Chart */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Workforce</h3>

        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data.workforceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="round" />
            <YAxis domain={[-40, 120]} />
            <Tooltip />
            <Bar dataKey="stayed" stackId="a" fill="#3b82f6" />
            <Bar dataKey="newStaff" stackId="a" fill="#10b981" />
            <Bar dataKey="external" stackId="a" fill="#22d3ee" />
            <Bar dataKey="leftStaff" fill="#f87171" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ✅ Key Indicators */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">
          Key Indicators
        </h3>

        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data.indicatorsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="round" />
            <YAxis domain={[0, 110]} />
            <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
            <Line type="monotone" dataKey="workload" stroke="#f87171" strokeWidth={2} />
            <Line type="monotone" dataKey="motivation" stroke="#10b981" strokeWidth={2} />
            <Line type="monotone" dataKey="education" stroke="#8b5cf6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}