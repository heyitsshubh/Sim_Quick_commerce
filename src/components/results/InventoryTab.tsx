import { useMemo, useState } from "react";
import { Package, ShoppingCart, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { AreaChart, Area, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type InventoryView = "chart" | "table";

export default function InventoryTab() {
  const [view, setView] = useState<InventoryView>("chart");

  const weeklyData = useMemo(
    () =>
      Array.from({ length: 51 }, (_, index) => {
        const week = index + 1;
        const baseDemand = 9500;
        const seasonalA = 2300 * Math.sin((week / 52) * Math.PI * 2);
        const seasonalB = 900 * Math.sin((week / 13) * Math.PI * 2);
        const demand = Math.max(4500, Math.round(baseDemand + seasonalA + seasonalB));
        const sales = Math.round(demand * 0.905);
        const inventory = Math.round(Math.max(2000, 12000 - week * 85 + seasonalB));
        return {
          week: `W${week}`,
          demand,
          sales,
          inventory,
        };
      }),
    []
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <Package className="w-5 h-5 text-blue-600 mb-2" />
          <p className="text-4xl font-bold text-blue-700">4,78,736</p>
          <p className="text-sm font-semibold text-slate-600">Total Demand</p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <ShoppingCart className="w-5 h-5 text-emerald-600 mb-2" />
          <p className="text-4xl font-bold text-emerald-700">4,33,308</p>
          <p className="text-sm font-semibold text-slate-600">Total Sales</p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-2" />
          <p className="text-4xl font-bold text-emerald-700">90.5%</p>
          <p className="text-sm font-semibold text-slate-600">Fulfillment</p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <AlertTriangle className="w-5 h-5 text-emerald-600 mb-2" />
          <p className="text-4xl font-bold text-emerald-700">4/52</p>
          <p className="text-sm font-semibold text-slate-600">Stockouts</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-sm flex items-center gap-2">
        <Info className="w-4 h-4 text-amber-600" />
        <p className="text-amber-900">
          <span className="font-bold">Inventory management</span> is crucial. <span className="text-amber-700">Red rows = stockout weeks.</span>
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setView("chart")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold ${
            view === "chart" ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600"
          }`}
        >
          📊 Chart
        </button>
        <button
          onClick={() => setView("table")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold ${
            view === "table" ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600"
          }`}
        >
          📋 Table
        </button>
      </div>

      {view === "chart" ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <h3 className="text-3xl font-bold text-slate-900 mb-3">Demand vs Sales vs Inventory</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="demandArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="week" interval={1} tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <Tooltip formatter={(value) => Number(value).toLocaleString("en-IN")} />
              <Area type="monotone" dataKey="demand" stroke="#f59e0b" fill="url(#demandArea)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="max-h-80 overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 sticky top-0 z-10">
                <tr>
                  <th className="text-left px-3 py-2 font-semibold text-slate-700">Week</th>
                  <th className="text-right px-3 py-2 font-semibold text-slate-700">Demand</th>
                  <th className="text-right px-3 py-2 font-semibold text-slate-700">Sales</th>
                  <th className="text-right px-3 py-2 font-semibold text-slate-700">Inventory</th>
                </tr>
              </thead>
              <tbody>
                {weeklyData.map((row) => {
                  const isStockout = row.sales < row.demand * 0.85;
                  return (
                    <tr key={row.week} className={`border-t border-slate-100 ${isStockout ? "bg-red-50" : ""}`}>
                      <td className="px-3 py-2 font-medium text-slate-700">{row.week}</td>
                      <td className="px-3 py-2 text-right text-slate-700">{row.demand.toLocaleString("en-IN")}</td>
                      <td className="px-3 py-2 text-right text-slate-700">{row.sales.toLocaleString("en-IN")}</td>
                      <td className="px-3 py-2 text-right text-slate-700">{row.inventory.toLocaleString("en-IN")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}