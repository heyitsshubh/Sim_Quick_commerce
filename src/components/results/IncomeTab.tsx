import { useEffect, useState } from "react";
import axios from "axios";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const yTick = (v: number) => {
  if (v === 0) return "0L";
  return `${Math.round(v / 1e7)}Cr`;
};

export default function IncomeTab() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://sim-quick-commerce-backend.onrender.com/api/income?round=R1")
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

  return (
    <>
      {/* ✅ Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 p-5 rounded-xl shadow-sm">
          <p className="text-slate-600 text-sm">Net Turnover</p>
          <h3 className="text-2xl font-bold mt-2 text-slate-900">
            ₹{data.cards.netTurnover} Cr
          </h3>
          <span className="text-green-600 text-sm font-medium">
            +{data.cards.netTurnoverChange}%
          </span>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-5 rounded-xl shadow-sm">
          <p className="text-slate-600 text-sm">Gross Margin</p>
          <h3 className="text-2xl font-bold mt-2 text-slate-900">
            {data.cards.grossMargin}%
          </h3>
          <span className="text-green-600 text-sm font-medium">
            +{data.cards.grossMarginChange}%
          </span>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-5 rounded-xl shadow-sm">
          <p className="text-slate-600 text-sm">Total Costs</p>
          <h3 className="text-2xl font-bold mt-2 text-slate-900">
            ₹{data.cards.totalCosts} L
          </h3>
          <span className="text-red-500 text-sm font-medium">
            {data.cards.totalCostsChange}%
          </span>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-xl shadow-sm">
          <p className="text-slate-600 text-sm">Retained Profit</p>
          <h3 className="text-2xl font-bold mt-2 text-slate-900">
            ₹{data.cards.retainedProfit} Cr
          </h3>
          <span className="text-green-600 text-sm font-medium">
            +{data.cards.retainedProfitChange}%
          </span>
        </div>
      </div>

      {/* ✅ Chart Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-sm font-bold text-slate-900">
          Revenue & Profitability Trend
        </h3>
        <p className="text-slate-500 text-sm mb-4">
          Across all completed rounds
        </p>

        <ResponsiveContainer width="100%" height={220}>
          <LineChart
            data={data.trendData}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="round" tick={{ fontSize: 11, fill: "#64748b" }} />
            <YAxis
              tick={{ fontSize: 11, fill: "#64748b" }}
              tickFormatter={yTick}
              domain={[0, 80000000]}
              ticks={[0, 20000000, 40000000, 60000000, 80000000]}
            />
            <Tooltip
              formatter={(value) =>
                `₹${(Number(value) / 1e7).toFixed(2)} Cr`
              }
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="profitability"
              stroke="#10b981"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ✅ Income Statement */}
      <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm p-4 md:p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 bg-blue-600 rounded" />
          <h3 className="text-xl font-bold text-slate-900">
            Income Statement — {data.incomeStatement.round}
          </h3>
        </div>

        <div className="space-y-1 text-sm md:text-lg">
          <div className="flex justify-between font-bold">
            <span>Net turnover</span>
            <span>₹{data.incomeStatement.netTurnover} Cr</span>
          </div>

          <div className="flex justify-between text-slate-600">
            <span>Cost of sales</span>
            <span className="text-red-500 font-semibold">
              ₹{data.incomeStatement.costOfSales} Cr
            </span>
          </div>

          <div className="flex justify-between bg-blue-50 border border-blue-200 rounded-xl px-4 py-2 font-bold text-blue-700">
            <span>Gross margin</span>
            <span>₹{data.incomeStatement.grossMargin} Cr</span>
          </div>

          <div className="h-px bg-slate-200 my-2" />

          {[
            "salesCosts",
            "locationCosts",
            "rentalCosts",
            "remuneration",
            "socialSecurity",
            "educationCosts",
            "otherCosts",
          ].map((key) => (
            <div
              key={key}
              className="flex justify-between text-slate-600"
            >
              <span className="pl-4">{key}</span>
              <span className="text-red-500 font-semibold">
                ₹{data.incomeStatement[key]} L
              </span>
            </div>
          ))}

          <div className="h-px bg-slate-200 my-2" />

          <div className="flex justify-between font-bold">
            <span>Sum of costs</span>
            <span className="text-red-500">
              ₹{data.incomeStatement.sumCosts} L
            </span>
          </div>

          <div className="flex justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 font-bold text-emerald-700">
            <span>Retained profit</span>
            <span>₹{data.incomeStatement.retainedProfit} Cr</span>
          </div>
        </div>
      </div>
    </>
  );
}