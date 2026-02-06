
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Lock, Unlock } from "lucide-react";
import axios from "axios";
import TopNav from "../components/TopNav";

type Category = {
  _id: string;
  name: string;
};

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
  const [loading, setLoading] = useState(false);
  const [currentRound] = useState(1);
  const maxRounds = 8;

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

  useEffect(() => {
    if (!activeCategory || !activeSegment) return;

    const loadAnalysis = async () => {
      try {
        setLoading(true);
        setAnalysisData(null);

        const res = await axios.get(
          `https://sim-quick-commerce-backend.onrender.com/api/analysis/${activeCategory.name}/${activeSegment}`
        );
        const data = res.data.analysis || res.data;
        setAnalysisData(data);
      } catch (err) {
        console.error("Analysis fetch failed", err);
      } finally {                  
        setLoading(false);              
      }
    };

    loadAnalysis();
  }, [activeCategory, activeSegment]);

  return (
    <div className="min-h-screen bg-slate-50">
             <div className="mx-auto w-full max-w-50xl flex items-center justify-center gap-2 overflow-x-auto whitespace-nowrap px-4 sm:px-6 py-4 border border-blue-100 rounded-xl bg-blue-50/60 shadow-sm">
      <TopNav />
    </div>
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-slate-900">Round {currentRound} of {maxRounds}</h1>
            <p className="text-slate-600 text-sm mt-1">Product Category Analysis</p>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            {Array.from({ length: maxRounds }, (_, i) => i + 1).map((round) => (
              <button
                key={round}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  round === currentRound
                    ? "bg-blue-600 text-white shadow-sm"
                    : round < currentRound
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {round <= currentRound ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                <span>Round {round}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-6">
    
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-4 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-700 mb-2">CATEGORIES</h3>
                <p className="text-xs text-slate-500 mb-4">Select a product category</p>
              </div>

              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => {
                      setActiveCategory(cat);
                      setActiveSegment(null);
                      setAnalysisData(null);
                      navigate(`/analysis/category/${cat._id}`);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeCategory?._id === cat._id
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    📦 {cat.name}
                  </button>
                ))}
              </div>

              <div className="border-t pt-4 mt-4">
                <h4 className="text-xs font-bold text-slate-700 mb-3">SEGMENTS</h4>
                <div className="grid grid-cols-2 gap-2">
                  {SEGMENTS.map((seg) => (
                    <button
                      key={seg}
                      onClick={() => {
                        if (activeCategory) {
                          setActiveSegment(seg);
                          navigate(`/analysis/category/${activeCategory._id}/${seg}`);
                        }
                      }}
                      disabled={!activeCategory}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        activeSegment === seg && activeCategory
                          ? "bg-green-600 text-white shadow-md"
                          : activeCategory
                          ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          : "bg-slate-50 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      {seg.charAt(0).toUpperCase() + seg.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-white rounded-lg shadow-lg border border-slate-200 p-8 overflow-y-auto">
            {!activeCategory && (
              <div className="text-center py-20">
                <div className="bg-slate-50 rounded-lg p-8 mx-auto max-w-md border border-slate-200">
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">Select a Category</h3>
                  <p className="text-slate-500">Choose a product category from the sidebar to begin your analysis</p>
                </div>
              </div>
            )}

            {activeCategory && !activeSegment && (
              <div className="text-center py-20">
                <div className="bg-slate-50 rounded-lg p-8 mx-auto max-w-md border border-slate-200">
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">Select a Segment</h3>
                  <p className="text-slate-500">Choose a market segment to view detailed analysis</p>
                </div>
              </div>
            )}

            {loading && (
              <div className="text-center py-20">
                <div className="bg-slate-50 rounded-lg p-8 mx-auto max-w-md border border-slate-200">
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">Loading Analysis</h3>
                  <p className="text-slate-500">Processing your data, please wait...</p>
                </div>
              </div>
            )}

            {!loading && analysisData && (
              <div className="space-y-6">
                <div className="bg-slate-800 rounded-lg p-6 text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-1">
                        {activeCategory?.name}
                      </h2>
                      <p className="text-slate-300 text-sm">{activeSegment ? activeSegment.charAt(0).toUpperCase() + activeSegment.slice(1) : ""} Segment Analysis</p>
                    </div>
                    <div className="bg-slate-700 rounded px-3 py-1">
                      <span className="text-xs font-medium text-slate-300">Comprehensive Report</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-8 bg-blue-600 rounded"></div>
                    <h3 className="text-xl font-semibold text-slate-900">Core Performance Score</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm text-blue-700 font-semibold uppercase tracking-wide">Score</p>
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-medium">CORE</span>
                      </div>
                      <p className="text-4xl font-bold text-blue-700 mb-3">
                        {analysisData.coreScore.toFixed(2)}
                      </p>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                          style={{width: `${Math.min(100, (analysisData.coreScore / 100) * 100)}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {analysisData.breakdown && analysisData.breakdown.length > 0 && (
                  <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-2 h-8 bg-emerald-600 rounded"></div>
                      <h3 className="text-xl font-semibold text-slate-900">Score Breakdown</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b-2 border-slate-200">
                            <th className="px-4 py-3 text-left font-semibold text-slate-700">Multiplier</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-700">Key Indicator</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-700">Achieved</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-700">Score</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analysisData.breakdown.map((b, i) => (
                            <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                              <td className="px-4 py-3 text-slate-700 font-medium">{b.multiplier}</td>
                              <td className="px-4 py-3 text-slate-600">{b.keyIndicator}</td>
                              <td className="px-4 py-3">
                                <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-sm font-medium">
                                  {b.achievedPoints}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="font-semibold text-slate-900">
                                  {b.totalScore ?? b.yourTotalScore ?? "—"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                {(analysisData.multipliers || analysisData.coreMultipliers) && (
                  <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-2 h-8 bg-purple-600 rounded"></div>
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900">Performance Multipliers</h3>
                        <p className="text-sm text-slate-600">Core Score Enhancement: <span className="font-semibold text-purple-600">{analysisData.multiplierOnCoreScore}x</span></p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {(analysisData.multipliers ?? analysisData.coreMultipliers)?.map((m, i) => (
                        <div key={i} className="border border-slate-200 p-4 rounded-lg hover:shadow-sm transition-shadow">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-semibold text-slate-900 mb-1">{m.title}</p>
                              <p className="text-sm text-slate-600">{m.description}</p>
                            </div>
                            <div className="ml-4">
                              <span className="bg-emerald-600 text-white px-3 py-1 rounded font-semibold">
                                ×{m.value ?? m.multiplier}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-slate-800 text-white p-8 rounded-lg">
                  <div className="text-center">
                    <p className="text-sm font-semibold text-slate-300 mb-2 uppercase tracking-wide">Total Score</p>
                    <p className="text-4xl font-bold mb-2">
                      {((analysisData.totalScore ?? analysisData.finalScore) ?? 0).toLocaleString('en-IN', {
                        maximumFractionDigits: 2
                      })}
                    </p>
                    <p className="text-sm text-slate-400">Final Performance Rating</p>
                  </div>
                </div>
                {analysisData.competitors && analysisData.competitors.length > 0 && (
                  <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-2 h-8 bg-red-600 rounded"></div>
                      <h3 className="text-xl font-semibold text-slate-900">Competitor Analysis</h3>
                    </div>
                    <div className="space-y-3">
                      {analysisData.competitors.map((comp, i) => (
                        <div key={i} className="flex justify-between items-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
                          <div className="flex items-center gap-3">
                            <span className="bg-slate-600 text-white text-sm font-semibold w-8 h-8 rounded-full flex items-center justify-center">
                              {i + 1}
                            </span>
                            <span className="font-semibold text-slate-900">{comp.name}</span>
                          </div>
                          <span className="text-lg font-bold text-slate-800">
                            {comp.score.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {analysisData.market && (
                  <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-2 h-8 bg-cyan-600 rounded"></div>
                      <h3 className="text-xl font-semibold text-slate-900">Market Analysis</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-700 font-semibold mb-1 uppercase tracking-wide">Market Share</p>
                        <p className="text-2xl font-bold text-blue-700">
                          {analysisData.market.marketShare?.toFixed(1)}%
                        </p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <p className="text-xs text-purple-700 font-semibold mb-1 uppercase tracking-wide">Market Size</p>
                        <p className="text-2xl font-bold text-purple-700">
                          ₹{(analysisData.market.totalMarketSize / 100000).toFixed(0)}L
                        </p>
                      </div>
                      <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                        <p className="text-xs text-emerald-700 font-semibold mb-1 uppercase tracking-wide">Your Sales</p>
                        <p className="text-2xl font-bold text-emerald-700">
                          ₹{(analysisData.market.yourSales / 100000).toFixed(0)}L
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-900 mb-3">Market Breakdown</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between p-3 bg-white rounded border border-slate-200">
                            <span className="text-sm font-medium text-slate-700">Total Market</span>
                            <span className="text-sm font-semibold text-slate-900">
                              {analysisData.market.totalMarketSize.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className="flex justify-between p-3 bg-white rounded border border-slate-200">
                            <span className="text-sm font-medium text-slate-700">Your Sales</span>
                            <span className="text-sm font-semibold text-emerald-700">
                              {analysisData.market.yourSales.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between p-3 bg-white rounded border border-slate-200">
                            <span className="text-sm font-medium text-slate-700">Direct Demand</span>
                            <span className="text-sm font-semibold text-slate-900">
                              {analysisData.market.directDemand.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className="flex justify-between p-3 bg-white rounded border border-slate-200">
                            <span className="text-sm font-medium text-slate-700">Substitute Demand</span>
                            <span className="text-sm font-semibold text-slate-900">
                              {analysisData.market.substituteDemand.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}