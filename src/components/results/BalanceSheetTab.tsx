/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";
import { Building2, CreditCard, Landmark, ShieldCheck } from "lucide-react";
import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip } from "recharts";

const fmt = (v: number) => {
  if (Math.abs(v) >= 1e7) return `₹${(v / 1e7).toFixed(2)} Cr`;
  if (Math.abs(v) >= 1e5) return `₹${(v / 1e5).toFixed(2)} L`;
  return `₹${Math.round(v).toLocaleString("en-IN")}`;
};

export default function BalanceSheetTab() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://sim-quick-commerce-backend.onrender.com/api/balance?round=R1")
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
    <div className="space-y-4">
      {/* ✅ Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <Building2 className="w-5 h-5 text-blue-600 mb-2" />
          <p className="text-3xl font-bold text-blue-700">
            {fmt(data.summary.totalAssets)}
          </p>
          <p className="text-sm font-semibold text-slate-600">Total Assets</p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <Landmark className="w-5 h-5 text-emerald-600 mb-2" />
          <p className="text-3xl font-bold text-emerald-700">
            {fmt(data.summary.ownersEquity)}
          </p>
          <p className="text-sm font-semibold text-slate-600">Owner's Equity</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <CreditCard className="w-5 h-5 text-amber-600 mb-2" />
          <p className="text-3xl font-bold text-amber-700">
            {fmt(data.summary.totalDebt)}
          </p>
          <p className="text-sm font-semibold text-slate-600">Total Debt</p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <ShieldCheck className="w-5 h-5 text-red-500 mb-2" />
          <p className="text-3xl font-bold text-red-600">
            {data.summary.solvency}%
          </p>
          <p className="text-sm font-semibold text-slate-600">Solvency</p>
        </div>
      </div>

      {/* ✅ Balance Sheet Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 md:p-5">
        <h3 className="text-2xl font-bold text-slate-900 mb-4">
          Balance Sheet — {data.round}
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Assets */}
          <div>
            <p className="text-xl font-black uppercase mb-2">Assets</p>

            <p className="text-slate-400 font-semibold mb-1">Fixed</p>
            {data.assets.fixed.map((row: any) => (
              <div key={row.label} className="flex justify-between text-sm">
                <span>{row.label}</span>
                <span className="font-bold">{fmt(row.value)}</span>
              </div>
            ))}

            <p className="text-slate-400 font-semibold mt-3 mb-1">Current</p>
            {data.assets.current.map((row: any) => (
              <div key={row.label} className="flex justify-between text-sm">
                <span>{row.label}</span>
                <span className="font-bold">{fmt(row.value)}</span>
              </div>
            ))}

            <p className="text-slate-400 font-semibold mt-3 mb-1">Cash</p>
            <div className="flex justify-between text-sm">
              <span>{data.assets.cash.label}</span>
              <span className="font-bold">{fmt(data.assets.cash.value)}</span>
            </div>

            <div className="h-px bg-slate-200 my-2" />
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 flex justify-between font-bold text-blue-700">
              <span>Total</span>
              <span>{fmt(data.summary.totalAssets)}</span>
            </div>
          </div>

          {/* Liabilities */}
          <div>
            <p className="text-xl font-black uppercase mb-2">Liabilities</p>

            <p className="text-slate-400 font-semibold mb-1">Equity</p>
            {data.liabilities.equity.map((row: any) => (
              <div key={row.label} className="flex justify-between text-sm">
                <span>{row.label}</span>
                <span className="font-bold">{fmt(row.value)}</span>
              </div>
            ))}

            <p className="text-slate-400 font-semibold mt-3 mb-1">Non-current</p>
            {data.liabilities.nonCurrent.map((row: any) => (
              <div key={row.label} className="flex justify-between text-sm">
                <span>{row.label}</span>
                <span className="font-bold">{fmt(row.value)}</span>
              </div>
            ))}

            <p className="text-slate-400 font-semibold mt-3 mb-1">Current</p>
            {data.liabilities.current.map((row: any) => (
              <div key={row.label} className="flex justify-between text-sm">
                <span>{row.label}</span>
                <span className="font-bold">{fmt(row.value)}</span>
              </div>
            ))}

            <div className="h-px bg-slate-200 my-2" />
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 flex justify-between font-bold text-blue-700">
              <span>Total</span>
              <span>{fmt(data.summary.totalAssets)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Funding Pie Chart */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 md:p-5">
        <h3 className="text-2xl font-bold mb-2">Funding Structure</h3>

        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data.fundingStructure}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="48%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={2}
            >
              {data.fundingStructure.map((entry: any) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => fmt(Number(value))} />
          </PieChart>
        </ResponsiveContainer>

        <div className="flex flex-wrap gap-3 text-sm text-slate-600 mt-2">
          {data.fundingStructure.map((entry: any) => (
            <span key={entry.name} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              {entry.name}
            </span>
          ))}
        </div>

        {/* Solvency Bar */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mt-4">
          <div className="flex justify-between text-xl font-bold text-blue-700">
            <span>Solvency</span>
            <span>{data.summary.solvency}%</span>
          </div>
          <div className="mt-2 h-5 bg-blue-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600"
              style={{ width: `${data.summary.solvency}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}