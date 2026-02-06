
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Lock, Unlock } from "lucide-react";
import axios from "axios";

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
          <div className="flex-1 bg-white rounded-lg shadow p-8 overflow-y-auto">
            {!activeCategory && (
              <div className="text-center py-12">
                <p className="text-slate-500 text-lg">👈 Select a category to begin</p>
              </div>
            )}

            {activeCategory && !activeSegment && (
              <div className="text-center py-12">
                <p className="text-slate-500 text-lg">👉 Select a segment to view analysis</p>
              </div>
            )}

            {loading && (
              <div className="text-center py-12">
                <p className="text-slate-600">Loading analysis data...</p>
              </div>
            )}

            {!loading && analysisData && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    {activeCategory?.name} - {activeSegment?.toUpperCase()}
                  </h2>
                  <p className="text-slate-600">Detailed Analysis Report</p>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Core Score</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-700 font-semibold mb-2">Score</p>
                      <p className="text-4xl font-bold text-blue-700">
                        {analysisData.coreScore.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {analysisData.breakdown && analysisData.breakdown.length > 0 && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Score Breakdown</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-100 border-b">
                          <tr>
                            <th className="px-4 py-2 text-left font-semibold">Multiplier</th>
                            <th className="px-4 py-2 text-left font-semibold">Key Indicator</th>
                            <th className="px-4 py-2 text-left font-semibold">Achieved</th>
                            <th className="px-4 py-2 text-left font-semibold">Score</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analysisData.breakdown.map((b, i) => (
                            <tr key={i} className="border-b hover:bg-slate-50">
                              <td className="px-4 py-2 text-slate-700">{b.multiplier}</td>
                              <td className="px-4 py-2 text-slate-700">{b.keyIndicator}</td>
                              <td className="px-4 py-2 text-slate-700">{b.achievedPoints}</td>
                              <td className="px-4 py-2 font-semibold text-blue-700">
                                {b.totalScore ?? b.yourTotalScore ?? "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                {(analysisData.multipliers || analysisData.coreMultipliers) && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">
                      Multiplier on Core Score ({analysisData.multiplierOnCoreScore}x)
                    </h3>
                    <div className="space-y-3">
                      {(analysisData.multipliers ?? analysisData.coreMultipliers)?.map((m, i) => (
                        <div key={i} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold text-slate-900">{m.title}</p>
                              <p className="text-sm text-slate-600 mt-1">{m.description}</p>
                            </div>
                            <p className="text-2xl font-bold text-green-600">
                              ×{m.value ?? m.multiplier}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg border border-blue-800">
                  <p className="text-sm font-semibold opacity-90 mb-2">TOTAL SCORE</p>
                  <p className="text-5xl font-bold">
                    {((analysisData.totalScore ?? analysisData.finalScore) ?? 0).toLocaleString('en-IN', {
                      maximumFractionDigits: 2
                    })}
                  </p>
                </div>
                {analysisData.competitors && analysisData.competitors.length > 0 && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Competitor Comparison</h3>
                    <div className="space-y-2">
                      {analysisData.competitors.map((comp, i) => (
                        <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border">
                          <span className="font-semibold text-slate-900">{comp.name}</span>
                          <span className="text-lg font-bold text-blue-600">
                            {comp.score.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {analysisData.market && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Market Analysis</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-700 font-semibold mb-1">Market Share</p>
                        <p className="text-2xl font-bold text-blue-700">
                          {analysisData.market.marketShare?.toFixed(1)}%
                        </p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <p className="text-xs text-purple-700 font-semibold mb-1">Market Size</p>
                        <p className="text-lg font-bold text-purple-700">
                          ₹{(analysisData.market.totalMarketSize / 100000).toFixed(0)}L
                        </p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <p className="text-xs text-green-700 font-semibold mb-1">Your Sales</p>
                        <p className="text-lg font-bold text-green-700">
                          ₹{(analysisData.market.yourSales / 100000).toFixed(0)}L
                        </p>
                      </div>
                    </div>

              <div className="border-t pt-6 mt-6">
                <h2 className="text-xl font-bold mb-4">Market size</h2>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>Total market</div>
                  <div className="text-right">{analysisData.market.totalMarketSize}</div>

                  <div>Your sales</div>
                  <div className="text-right">{analysisData.market.yourSales}</div>

                  <div>Direct demand</div>
                  <div className="text-right">{analysisData.market.directDemand}</div>

                  <div>Substitute demand</div>
                  <div className="text-right">{analysisData.market.substituteDemand}</div>
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