/* eslint-disable @typescript-eslint/no-explicit-any */
/* Full updated AnalysisPage with dashboard UI */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import TopNav from "../components/TopNav";

// ---------------- TYPES ----------------

type Category = { _id: string; name: string };

type Breakdown = {
  multiplier: number;
  keyIndicator: string;
  achievedPoints: number;
  yourTotalScore?: number;
  totalScore?: number;
};

type Multiplier = {
  title: string;
  description: string;
  multiplier?: number;
  value?: number;
};

type AnalysisData = {
  coreScore: number;
  breakdown: Breakdown[];
  multiplierOnCoreScore: number;
  multipliers?: Multiplier[];
  coreMultipliers?: Multiplier[];
  totalScore?: number;
  finalScore?: number;
  competitors?: { name: string; score: number }[];
  market?: {
    marketShare: number;
    totalMarketSize: number;
    yourSales: number;
    directDemand: number;
    substituteDemand: number;
  };
};

type Segment = "premium" | "standard" | "basic" | "discount";
const SEGMENTS: Segment[] = ["premium", "standard", "basic", "discount"];
const SELECTION_KEY = "step2_selections";

export default function AnalysisPage() {
  const navigate = useNavigate();
  const { categoryId, segment } = useParams<{ categoryId?: string; segment?: Segment }>();

  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [activeSegment, setActiveSegment] = useState<Segment | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  // ---------------- LOAD CATEGORIES ----------------
  useEffect(() => {
    const loadCategories = async () => {
      const res = await axios.get(
        "https://sim-quick-commerce-backend.onrender.com/api/step-two/categories"
      );
      const all: Category[] = res.data || [];
      const raw = localStorage.getItem(SELECTION_KEY);
      const selections = raw ? JSON.parse(raw) : {};
      const selected = all.filter((c) => selections[c._id]);
      setCategories(selected);

      if (categoryId) {
        const found = selected.find((c) => c._id === categoryId);
        if (found) setActiveCategory(found);
      }
      if (segment) setActiveSegment(segment);
    };
    loadCategories();
  }, [categoryId, segment]);

  // ---------------- LOAD ANALYSIS ----------------
  useEffect(() => {
    if (!activeCategory || !activeSegment) return;

    const loadAnalysis = async () => {
      try {
        const res = await axios.get(
          `https://sim-quick-commerce-backend.onrender.com/api/analysis/${activeCategory.name}/${activeSegment}`
        );
        setAnalysisData(res.data.analysis || res.data);
      } catch (error) {
        console.error("Failed to load analysis:", error);
      }
    };
    loadAnalysis();
  }, [activeCategory, activeSegment]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto py-4">
        <TopNav />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 flex gap-6">
        {/* LEFT SIDEBAR */}
        <div className="w-64 bg-white border rounded-xl p-4 space-y-4">
          <h3 className="font-bold text-sm">CATEGORIES</h3>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => {
                setActiveCategory(cat);
                setActiveSegment(null);
                navigate(`/analysis/category/${cat._id}`);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg ${activeCategory?._id === cat._id ? "bg-blue-600 text-white" : "hover:bg-slate-100"}`}
            >
              {cat.name}
            </button>
          ))}

          <div className="border-t pt-4">
            <h4 className="text-xs font-bold mb-2">SEGMENTS</h4>
            <div className="grid grid-cols-2 gap-2">
              {SEGMENTS.map((seg) => (
                <button
                  key={seg}
                  disabled={!activeCategory}
                  onClick={() => {
                    setActiveSegment(seg);
                    navigate(`/analysis/category/${activeCategory?._id}/${seg}`);
                  }}
                  className={`px-2 py-2 rounded ${activeSegment === seg ? "bg-green-600 text-white" : "bg-slate-100"}`}
                >
                  {seg}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 space-y-6">
          {!analysisData && <div>Select category & segment</div>}

          {analysisData && (
            <>
              {/* KPI ROW */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card label="Core Score" value={analysisData.coreScore.toFixed(1)} color="blue" />
                <Card label="Multiplier" value={`×${analysisData.multiplierOnCoreScore.toFixed(2)}`} color="emerald" />
                <Card label="Total Score" value={(analysisData.totalScore ?? analysisData.finalScore)?.toLocaleString() || "0"} color="amber" />
                <Card label="Market Share" value={`${analysisData.market?.marketShare?.toFixed(1) || 0}%`} color="violet" />
              </div>

              {/* BREAKDOWN BARS */}
              <div className="bg-white border rounded-2xl p-6">
                <h3 className="font-bold mb-4">Core Score Breakdown</h3>
                <div className="space-y-4">
                  {analysisData.breakdown.map((b, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{b.keyIndicator}</span>
                        <span className="font-bold">{b.totalScore ?? b.yourTotalScore ?? 0}</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full">
                        <div
                          className="h-3 bg-blue-500 rounded-full"
                          style={{ width: `${Math.min(b.achievedPoints, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* MULTIPLIERS */}

<div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
  <div className="flex items-center justify-between mb-4">
    <div>
      <h3 className="text-lg font-semibold text-slate-900">Multipliers on Core Score</h3>
      <p className="text-xs text-slate-500">Every decision affects demand — grouped by category</p>
    </div>
    <span className="text-emerald-600 font-bold text-lg">×{analysisData.multiplierOnCoreScore}</span>
  </div>

  <div className="grid md:grid-cols-2 gap-3">
    {(analysisData.multipliers ?? analysisData.coreMultipliers)?.map((m, i) => {
      const val = m.value ?? m.multiplier ?? 1;
      const positive = val >= 1;
      return (
        <div
          key={i}
          className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all
          ${positive ? 'border-blue-200 bg-blue-50/40' : 'border-red-200 bg-red-50/40'}`}
        >
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{m.title}</p>
            <p className="text-xs text-slate-500 line-clamp-2">{m.description}</p>
          </div>

          <span
            className={`ml-3 text-sm font-bold px-3 py-1 rounded-lg whitespace-nowrap
            ${positive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}
          >
            ×{val.toFixed(2)}
          </span>
        </div>
      );
    })}
  </div>

  <div className="mt-5 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
    <div>
      <p className="text-xs text-blue-600 font-medium">Core × Multiplier</p>
      <p className="text-sm font-semibold text-slate-900">Your Total Score</p>
    </div>
    <span className="text-2xl font-bold text-blue-600">
      {(analysisData.totalScore ?? analysisData.finalScore ?? 0).toLocaleString('en-IN')}
    </span>
  </div>
</div>


{/* COMPETITORS + MARKET SHARE */}
{analysisData && (
  <div className="grid lg:grid-cols-5 gap-4">

    {/* Competitive Landscape */}
    <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
      <h2 className="text-lg font-bold text-slate-900 mb-1">Competitive Landscape</h2>
      <p className="text-xs text-slate-500 mb-4">Score comparison — all companies in this segment</p>

      <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 mb-4 text-xs text-amber-700">
        Competitor names hidden — invest in Market Analysis to reveal.
      </div>

      <div className="space-y-3">
        {analysisData.competitors?.map((c, i) => {
          const max = Math.max(...analysisData.competitors!.map(x => x.score));
          const pct = (c.score / max) * 100;
          const isYou = c.name.toLowerCase().includes("you");

          return (
            <div key={i}>
              <div className="flex justify-between text-sm mb-1">
                <span className={isYou ? "font-semibold text-blue-600" : "text-slate-600"}>
                  {c.name}
                </span>
                <span className={isYou ? "font-bold text-blue-600" : "font-semibold"}>
                  {c.score.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
              </div>

              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${isYou ? 'bg-blue-500' : 'bg-slate-300'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t text-sm flex justify-between font-semibold">
        <span>Total segment score</span>
        <span>
          {analysisData.competitors?.reduce((a, b) => a + b.score, 0).toLocaleString('en-IN')}
        </span>
      </div>
    </div>

    {/* Market Share Donut */}
    <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm p-5 flex flex-col">
      <h2 className="text-lg font-bold text-slate-900 mb-1">Market Share</h2>
      <p className="text-xs text-slate-500 mb-4">Your position within the segment</p>

      {analysisData.market && (
        <>
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="48" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="10"
                  strokeDasharray={`${analysisData.market.marketShare * 3.016} ${301.6 - analysisData.market.marketShare * 3.016}`}
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-blue-600">
                  {analysisData.market.marketShare.toFixed(1)}%
                </span>
                <span className="text-xs text-slate-400">share</span>
              </div>
            </div>
          </div>

          <div className="divide-y mt-4 text-sm">
            <div className="flex justify-between py-2">
              <span>Total segment size</span>
              <span className="font-semibold">{analysisData.market.totalMarketSize.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Your sales</span>
              <span className="font-semibold text-blue-600">{analysisData.market.yourSales.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Direct demand</span>
              <span className="font-semibold">{analysisData.market.directDemand.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </>
      )}
    </div>
  </div>
)}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Card({ label, value, color }: any) {
  return (
    <div className={`p-4 rounded-xl border bg-${color}-50 border-${color}-200`}>
      <p className="text-xs font-semibold">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}