import { useEffect, useState } from "react";
import axios from "axios";
import { TrendingUp, TrendingDown, CreditCard } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const axisFmt = (v: number) => {
  if (v >= 1e7) return `${(v / 1e7).toFixed(0)}Cr`;
  return `${(v / 1e5).toFixed(0)}L`;
};

const fmt = (v: number) => {
  const abs = Math.abs(v);
  const sign = v < 0 ? "-" : "";
  if (abs >= 1e7) return `₹${sign}${(abs / 1e7).toFixed(2)} Cr`;
  if (abs >= 1e5) return `₹${sign}${(abs / 1e5).toFixed(2)} L`;
  return `₹${sign}${abs.toLocaleString("en-IN")}`;
};

export default function CashFlowTab() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://sim-quick-commerce-backend.onrender.com/api/cashflow?round=R1")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!data) return <div className="p-6">No Data Found</div>;

  return (
    <div className="space-y-5">
      {/* ✅ Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <TrendingUp className="w-5 h-5 text-emerald-600 mb-2" />
          <p className="text-3xl font-bold text-emerald-700">
            {fmt(data.summary.totalIncome)}
          </p>
          <p className="text-sm font-semibold text-slate-600">
            Total Income
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <TrendingDown className="w-5 h-5 text-red-500 mb-2" />
          <p className="text-3xl font-bold text-red-700">
            {fmt(data.summary.totalExpenses)}
          </p>
          <p className="text-sm font-semibold text-slate-600">
            Total Expenses
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <CreditCard className="w-5 h-5 text-red-500 mb-2" />
          <p
            className={`text-3xl font-bold ${
              data.summary.netCashFlow < 0
                ? "text-red-700"
                : "text-emerald-700"
            }`}
          >
            {fmt(data.summary.netCashFlow)}
          </p>
          <p className="text-sm font-semibold text-slate-600">
            Net Cash Flow
          </p>
        </div>
      </div>

      {/* ✅ Chart Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-2xl font-bold text-slate-900 mb-3">
          Cash Flow Trend
        </h3>

        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data.trend}>
            <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
            <XAxis
              dataKey="round"
              tick={{ fontSize: 12, fill: "#64748b" }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickFormatter={axisFmt}
              domain={[0, "dataMax"]}
            />
            <Tooltip formatter={(value) => fmt(Number(value))} />
            <Bar
              dataKey="value"
              fill="#10b981"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ✅ Net Cash Flow Highlight */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-blue-500 font-semibold text-sm">
            Income − Expenses
          </p>
          <p className="text-3xl font-black text-slate-900">
            Net Cash Flow
          </p>
        </div>
        <p
          className={`text-5xl font-bold ${
            data.summary.netCashFlow < 0
              ? "text-red-600"
              : "text-emerald-600"
          }`}
        >
          {fmt(data.summary.netCashFlow)}
        </p>
      </div>
    </div>
  );
}