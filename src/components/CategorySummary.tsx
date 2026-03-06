/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import {
  TrendingUp, Target, ShoppingCart, DollarSign,
  Loader2, 
} from "lucide-react";

type Segment = "premium" | "standard" | "basic" | "discount";
const SEGMENTS: Segment[] = ["premium", "standard", "basic", "discount"];

/* COLORS */
const SEGMENT_COLORS: Record<string, string> = {
  premium: "#8b5cf6",
  standard: "#2563eb",
  basic: "#10b981",
  discount: "#f59e0b",
};

export default function CategorySummary({ category, onSegmentClick }: any) {
  const [segmentData, setSegmentData] = useState<Record<string, any> | null>(null);
  const [positioning, setPositioning] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category?._id) return;

    const load = async () => {
      try {
        setLoading(true);

        const res = await axios.get(  
          `https://sim-quick-commerce-backend.onrender.com/api/category-analysis/${category._id}`
        );

        const a = res.data.analysis;

        /* SEGMENT MARKET DATA */
        const formatted: Record<string, any> = {};
        a.segments.forEach((s: any) => {
          formatted[s.name] = {
            totalScore: a.kpis.totalScore,
            multiplierOnCoreScore: a.kpis.avgMultiplier,
            market: {
              marketShare: s.share,
              yourSales: s.yourSales,
              totalMarketSize: s.totalDemand
            }
          };
        });
        setSegmentData(formatted);

        /* POSITIONING MATRIX DATA */
        const pos = a.positioning.map((p: any) => ({
          x: p.price,
          y: p.quality / 20, // convert 0-100 to stars 1-5
          z: Math.max(p.bubbleSize * 20, 60),
          segment: p.segment,
          name: p.segment
        }));

        setPositioning(pos);

      } catch (err) {
        console.error("Category analysis failed", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [category]);

  if (loading || !segmentData) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-slate-500 text-sm">Loading category analysis…</p>
      </div>
    );
  }

  /* KPI CALCULATION */
  let totalScore = 0, avgMultiplier = 0, avgShare = 0, totalSales = 0, totalDemand = 0, count = 0;
  SEGMENTS.forEach((seg) => {
    const d = segmentData[seg];
    if (!d) return;
    totalScore += d.totalScore;
    avgMultiplier += d.multiplierOnCoreScore;
    avgShare += d.market.marketShare;
    totalSales += d.market.yourSales;
    totalDemand += d.market.totalMarketSize;
    count++;
  });
  avgMultiplier /= count;
  avgShare /= count;

  return (
    <div className="space-y-6">

      {/* KPI ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryKpi label="Total Score" value={totalScore.toLocaleString()} sub="Across all segments" icon={<TrendingUp />} />
        <SummaryKpi label="Avg Multiplier" value={`×${avgMultiplier.toFixed(2)}`} sub="Decision impact" icon={<Target />} />
        <SummaryKpi label="Avg Market Share" value={`${avgShare.toFixed(1)}%`} sub="Your position" icon={<ShoppingCart />} />
        <SummaryKpi label="Total Sales" value={totalSales.toLocaleString()} sub={`of ${totalDemand.toLocaleString()} demand`} icon={<DollarSign />} />
      </div>

      {/* MARKET CIRCLES */}
      <div className="bg-white border rounded-2xl p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {SEGMENTS.map((seg) => {
            const d = segmentData[seg];
            if (!d) return null;
            const share = d.market.marketShare;
            const sales = d.market.yourSales;
            const demand = d.market.totalMarketSize;

            const r = 50;
            const circ = 2 * Math.PI * r;
            const dash = (share / 100) * circ;

            return (
              <button key={seg} onClick={() => onSegmentClick(seg)}
                className="flex flex-col items-center bg-slate-50 border rounded-2xl p-5 hover:shadow-lg">

                <div className="relative w-28 h-28 mb-3">
                  <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                    <circle cx="60" cy="60" r={r} fill="none" stroke="#e2e8f0" strokeWidth="8" />
                    <circle cx="60" cy="60" r={r} fill="none"
                      stroke={SEGMENT_COLORS[seg]}
                      strokeWidth="8"
                      strokeDasharray={`${dash} ${circ - dash}`}
                      strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-bold">
                    {share.toFixed(1)}%
                  </div>
                </div>

                <h4 className="font-bold capitalize">{seg}</h4>
                <p className="text-xs">Sales: {sales.toLocaleString()}</p>
                <p className="text-xs text-slate-500">Demand: {demand.toLocaleString()}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 🧠 POSITIONING MATRIX */}
      <div className="bg-white border rounded-2xl p-6">
        <h3 className="font-bold mb-4">Positioning Matrix</h3>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="x" name="Price" label={{ value: "Price", position: "bottom" }} />
              <YAxis type="number" dataKey="y" name="Quality" domain={[0,5]} tickFormatter={(v)=>"★".repeat(v)} />
              <ZAxis type="number" dataKey="z" range={[60, 400]} />
              <Tooltip />

              <Scatter data={positioning}>
                {positioning.map((entry, index) => (
                  <Cell key={index} fill={SEGMENT_COLORS[entry.segment]} />
                ))}
              </Scatter>

            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}

/* KPI CARD */
function SummaryKpi({ label, value, sub, icon }: any) {
  return (
    <div className="bg-white border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">{icon}<p className="text-xs font-semibold">{label}</p></div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-slate-500">{sub}</p>
    </div>
  );
}
