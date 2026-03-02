import { TrendingUp, TrendingDown, CreditCard } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const trendData = [
  { round: "R1", value: 6000000 },
  { round: "R2", value: 7600000 },
  { round: "R3", value: 9300000 },
  { round: "R4", value: 10300000 },
  { round: "R5", value: 12000000 },
];

const axisFmt = (v: number) => {
  if (v >= 1e7) return `${(v / 1e7).toFixed(0)}Cr`;
  return `${(v / 1e5).toFixed(0)}L`;
};

export default function CashFlowTab() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <TrendingUp className="w-5 h-5 text-emerald-600 mb-2" />
          <p className="text-3xl font-bold text-emerald-700">₹6.27 Cr</p>
          <p className="text-sm font-semibold text-slate-600">Total Income</p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <TrendingDown className="w-5 h-5 text-red-500 mb-2" />
          <p className="text-3xl font-bold text-red-700">₹7.37 Cr</p>
          <p className="text-sm font-semibold text-slate-600">Total Expenses</p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-4 md:col-span-1">
          <CreditCard className="w-5 h-5 text-red-500 mb-2" />
          <p className="text-3xl font-bold text-red-700">₹-1.10 Cr</p>
          <p className="text-sm font-semibold text-slate-600">Net Cash Flow</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-2xl font-bold text-slate-900 mb-3">Cash Flow Trend</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={trendData}>
            <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
            <XAxis dataKey="round" tick={{ fontSize: 12, fill: "#64748b" }} />
            <YAxis
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickFormatter={axisFmt}
              domain={[0, 13000000]}
            />
            <Tooltip formatter={(value) => `₹${(Number(value) / 1e7).toFixed(2)} Cr`} />
            <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-blue-500 font-semibold text-sm">Income − Expenses</p>
          <p className="text-3xl font-black text-slate-900">Net Cash Flow</p>
        </div>
        <p className="text-5xl font-bold text-red-600">₹-1.10 Cr</p>
      </div>
    </div>
  );
}