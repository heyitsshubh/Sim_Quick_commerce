import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const trendData = [
  { round: "R1", revenue: 40000000, profitability: 13000000 },
  { round: "R2", revenue: 46000000, profitability: 15000000 },
  { round: "R3", revenue: 53000000, profitability: 17000000 },
  { round: "R4", revenue: 57000000, profitability: 19000000 },
  { round: "R5", revenue: 63000000, profitability: 22000000 },
];

const yTick = (v: number) => {
  if (v === 0) return "0L";
  return `${Math.round(v / 1e7)}Cr`;
};

export default function IncomeTab() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 p-5 rounded-xl shadow-sm">
          <p className="text-slate-600 text-sm">Net Turnover</p>
          <h3 className="text-2xl font-bold mt-2 text-slate-900">₹6.27 Cr</h3>
          <span className="text-green-600 text-sm font-medium">+11.6%</span>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-5 rounded-xl shadow-sm">
          <p className="text-slate-600 text-sm">Gross Margin</p>
          <h3 className="text-2xl font-bold mt-2 text-slate-900">34.5%</h3>
          <span className="text-green-600 text-sm font-medium">+10.5%</span>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-5 rounded-xl shadow-sm">
          <p className="text-slate-600 text-sm">Total Costs</p>
          <h3 className="text-2xl font-bold mt-2 text-slate-900">₹89.49 L</h3>
          <span className="text-red-500 text-sm font-medium">-6.3%</span>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-xl shadow-sm">
          <p className="text-slate-600 text-sm">Retained Profit</p>
          <h3 className="text-2xl font-bold mt-2 text-slate-900">₹1.27 Cr</h3>
          <span className="text-green-600 text-sm font-medium">+18.6%</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-sm font-bold text-slate-900">Revenue & Profitability Trend</h3>
        <p className="text-slate-500 text-sm mb-4">Across all completed rounds</p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={trendData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="round" tick={{ fontSize: 11, fill: "#64748b" }} />
            <YAxis
              tick={{ fontSize: 11, fill: "#64748b" }}
              tickFormatter={yTick}
              domain={[0, 80000000]}
              ticks={[0, 20000000, 40000000, 60000000, 80000000]}
            />
            <Tooltip formatter={(value) => `₹${(Number(value) / 1e7).toFixed(2)} Cr`} />
            <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="profitability" stroke="#10b981" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm p-4 md:p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 bg-blue-600 rounded" />
          <h3 className="text-xl font-bold text-slate-900">Income Statement — Round 5</h3>
        </div>

        <div className="space-y-1 text-sm md:text-lg">
          <div className="flex items-center justify-between py-1.5 font-bold text-slate-900">
            <span>Net turnover</span>
            <span>₹6.27 Cr</span>
          </div>

          <div className="flex items-center justify-between py-1.5 text-slate-600">
            <span>Cost of sales</span>
            <span className="font-semibold text-red-500">₹4.11 Cr</span>
          </div>

          <div className="flex items-center justify-between py-2 px-4 rounded-xl border border-blue-200 bg-blue-50 font-bold text-blue-700">
            <span>Gross margin</span>
            <span>₹2.16 Cr</span>
          </div>

          <div className="h-px bg-slate-200 my-2" />

          <div className="space-y-1">
            <div className="flex items-center justify-between py-1.5 text-slate-600"><span className="pl-4">Sales costs</span><span className="font-semibold text-red-500">₹17.37 L</span></div>
            <div className="flex items-center justify-between py-1.5 text-slate-600"><span className="pl-4">Location costs</span><span className="font-semibold text-red-500">₹9.00 L</span></div>
            <div className="flex items-center justify-between py-1.5 text-slate-600"><span className="pl-4">Rental costs</span><span className="font-semibold text-red-500">₹4.75 L</span></div>
            <div className="flex items-center justify-between py-1.5 text-slate-600"><span className="pl-4">Remuneration</span><span className="font-semibold text-red-500">₹30.80 L</span></div>
            <div className="flex items-center justify-between py-1.5 text-slate-600"><span className="pl-4">Social security</span><span className="font-semibold text-red-500">₹6.47 L</span></div>
            <div className="flex items-center justify-between py-1.5 text-slate-600"><span className="pl-4">Education costs</span><span className="font-semibold text-red-500">₹3.60 L</span></div>
            <div className="flex items-center justify-between py-1.5 text-slate-600"><span className="pl-4">Other costs</span><span className="font-semibold text-red-500">₹17.50 L</span></div>
          </div>

          <div className="h-px bg-slate-200 my-2" />

          <div className="flex items-center justify-between py-1.5 font-bold text-slate-900">
            <span>Sum of costs</span>
            <span className="text-red-500">₹89.49 L</span>
          </div>

          <div className="flex items-center justify-between py-2 px-4 rounded-xl border border-emerald-200 bg-emerald-50 font-bold text-emerald-700">
            <span>Retained profit</span>
            <span>₹1.27 Cr</span>
          </div>
        </div>
      </div>
    </>
  );
}