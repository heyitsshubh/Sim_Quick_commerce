import { Building2, CreditCard, Landmark, ShieldCheck } from "lucide-react";
import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip } from "recharts";

const fundingData = [
  { name: "Equity", value: 58700000, color: "#3B82F6" },
  { name: "LT Debt", value: 10300000, color: "#8B5CF6" },
  { name: "ST Debt", value: 4128000, color: "#F59E0B" },
  { name: "Payable", value: 7395000, color: "#EF4444" },
  { name: "Tax", value: 3173000, color: "#64748B" },
];

const fmt = (v: number) => {
  if (Math.abs(v) >= 1e7) return `₹${(v / 1e7).toFixed(2)} Cr`;
  if (Math.abs(v) >= 1e5) return `₹${(v / 1e5).toFixed(2)} L`;
  return `₹${Math.round(v).toLocaleString("en-IN")}`;
};

const assets = [
  { label: "Plant & property", value: "₹22.50 L" },
  { label: "Intangible assets", value: "₹12.75 Cr" },
  { label: "Equipment", value: "₹29.50 L" },
  { label: "Inventories (wh)", value: "₹1.80 Cr" },
  { label: "Inventories (tr)", value: "₹26.00 L" },
  { label: "Trade receivables", value: "₹1.76 Cr" },
  { label: "Cash & equiv.", value: "₹3.55 Cr" },
];

const liabilities = [
  { label: "Share capital", value: "₹2.50 L" },
  { label: "Share premium", value: "₹1.23 Cr" },
  { label: "Retained earnings", value: "₹4.62 Cr" },
  { label: "LT borrowings", value: "₹1.03 Cr" },
  { label: "ST borrowings", value: "₹41.28 L" },
  { label: "Corporate taxes", value: "₹31.73 L" },
  { label: "Trade payable", value: "₹73.95 L" },
];

export default function BalanceSheetTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <Building2 className="w-5 h-5 text-blue-600 mb-2" />
          <p className="text-3xl font-bold text-blue-700">₹20.64 Cr</p>
          <p className="text-sm font-semibold text-slate-600">Total Assets</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <Landmark className="w-5 h-5 text-emerald-600 mb-2" />
          <p className="text-3xl font-bold text-emerald-700">₹5.87 Cr</p>
          <p className="text-sm font-semibold text-slate-600">Owner's Equity</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <CreditCard className="w-5 h-5 text-amber-600 mb-2" />
          <p className="text-3xl font-bold text-amber-700">₹2.50 Cr</p>
          <p className="text-sm font-semibold text-slate-600">Total Debt</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <ShieldCheck className="w-5 h-5 text-red-500 mb-2" />
          <p className="text-3xl font-bold text-red-600">28.5%</p>
          <p className="text-sm font-semibold text-slate-600">Solvency</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 md:p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 bg-blue-600 rounded" />
          <h3 className="text-2xl font-bold text-slate-900">Balance Sheet — Round 5</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-3 md:gap-4">
          <div>
            <p className="text-xl font-black text-slate-900 uppercase mb-2">Assets</p>
            <p className="text-slate-400 font-semibold mb-1">Fixed</p>
            <div className="space-y-1 text-sm mb-2">
              {assets.slice(0, 3).map((row) => (
                <div key={row.label} className="flex justify-between py-0.5">
                  <span className="text-slate-600">{row.label}</span>
                  <span className="font-bold text-slate-800">{row.value}</span>
                </div>
              ))}
            </div>

            <p className="text-slate-400 font-semibold mb-1">Current</p>
            <div className="space-y-1 text-sm mb-2">
              {assets.slice(3, 6).map((row) => (
                <div key={row.label} className="flex justify-between py-0.5">
                  <span className="text-slate-600">{row.label}</span>
                  <span className="font-bold text-slate-800">{row.value}</span>
                </div>
              ))}
            </div>

            <p className="text-slate-400 font-semibold mb-1">Cash</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between py-0.5">
                <span className="text-slate-600">{assets[6].label}</span>
                <span className="font-bold text-slate-800">{assets[6].value}</span>
              </div>
            </div>

            <div className="h-px bg-slate-200 my-2" />
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 flex justify-between font-bold text-xl text-blue-700">
              <span>Total</span>
              <span>₹20.64 Cr</span>
            </div>
          </div>

          <div>
            <p className="text-xl font-black text-slate-900 uppercase mb-2">Liabilities</p>
            <p className="text-slate-400 font-semibold mb-1">Equity</p>
            <div className="space-y-1 text-sm mb-2">
              {liabilities.slice(0, 3).map((row) => (
                <div key={row.label} className="flex justify-between py-0.5">
                  <span className="text-slate-600">{row.label}</span>
                  <span className="font-bold text-slate-800">{row.value}</span>
                </div>
              ))}
            </div>

            <p className="text-slate-400 font-semibold mb-1">Non-current</p>
            <div className="space-y-1 text-sm mb-2">
              <div className="flex justify-between py-0.5">
                <span className="text-slate-600">{liabilities[3].label}</span>
                <span className="font-bold text-slate-800">{liabilities[3].value}</span>
              </div>
            </div>

            <p className="text-slate-400 font-semibold mb-1">Current</p>
            <div className="space-y-1 text-sm">
              {liabilities.slice(4).map((row) => (
                <div key={row.label} className="flex justify-between py-0.5">
                  <span className="text-slate-600">{row.label}</span>
                  <span className="font-bold text-slate-800">{row.value}</span>
                </div>
              ))}
            </div>

            <div className="h-px bg-slate-200 my-2" />
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 flex justify-between font-bold text-xl text-blue-700">
              <span>Total</span>
              <span>₹8.37 Cr</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 md:p-5">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Funding Structure</h3>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={fundingData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="48%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={2}
            >
              {fundingData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => fmt(Number(value ?? 0))} />
          </PieChart>
        </ResponsiveContainer>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600 -mt-2 mb-3">
          {fundingData.map((entry) => (
            <span key={entry.name} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}
            </span>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
          <div className="flex items-center justify-between text-2xl font-bold text-blue-700">
            <span>Solvency</span>
            <span>28.5%</span>
          </div>
          <div className="mt-2 h-5 bg-blue-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: "28.5%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}