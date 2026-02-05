import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

type Category = {
  _id: string;
  name: string;
};

type Breakdown = {
  multiplier: number;
  keyIndicator: string;
  achievedPoints: number;
  totalScore: number;
};

type Multiplier = {
  title: string;
  description: string;
  value: number;
};

type AnalysisData = {
  coreScore: number;
  breakdown: Breakdown[];
  multiplierOnCoreScore: number;
  multipliers: Multiplier[];
  totalScore: number;
  competitors?: Array<{
    name: string;
    score: number;
  }>;
  localCompetition?: number;
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
  const { categoryId, segment } = useParams<{
    categoryId?: string;
    segment?: Segment;
  }>();

  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [activeSegment, setActiveSegment] = useState<Segment | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD SELECTED CATEGORIES ================= */
  useEffect(() => {
    const loadCategories = async () => {
      const res = await axios.get(
        "https://sim-quick-commerce-backend.onrender.com/api/step-two/categories"
      );

      const allCategories: Category[] = res.data || [];

      const rawSelections = localStorage.getItem(SELECTION_KEY);
      const selections = rawSelections ? JSON.parse(rawSelections) : {};

      const selected = allCategories.filter(
        (cat) => selections[cat._id]
      );

      setCategories(selected);

      // restore from URL
      if (categoryId) {
        const cat = selected.find((c) => c._id === categoryId);
        if (cat) setActiveCategory(cat);
      }

      if (segment) {
        setActiveSegment(segment);
      }
    };

    loadCategories();
  }, [categoryId, segment]);

  /* ================= LOAD ANALYSIS ================= */
  useEffect(() => {
    if (!activeCategory || !activeSegment) return;

    const loadAnalysis = async () => {
      try {
        setLoading(true);
        setAnalysisData(null);

        const res = await axios.get(
          `https://sim-quick-commerce-backend.onrender.com/api/analysis/${activeCategory.name}/${activeSegment}`
        );

        console.log("=== FULL API RESPONSE ===");
        console.log("Full Response:", res.data);
        console.log("Response Keys:", Object.keys(res.data));
        console.log("Analysis Object:", res.data.analysis);
        
        if (res.data.analysis) {
          console.log("Analysis Keys:", Object.keys(res.data.analysis));
          console.log("Core Score:", res.data.analysis.coreScore);
          console.log("Breakdown:", res.data.analysis.breakdown);
          console.log("Multipliers:", res.data.analysis.multipliers);
          console.log("Total Score:", res.data.analysis.totalScore);
        }
        
        // Try both possible data structures
        const data = res.data.analysis || res.data;
        setAnalysisData(data);
        
        console.log("=== DATA SET TO STATE ===");
        console.log("State Data:", data);
      } catch (err) {
        console.error("Analysis fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    loadAnalysis();
  }, [activeCategory, activeSegment]);

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* ================= LEFT PANEL ================= */}
      <div className="w-96 bg-white border-r p-6 space-y-6 overflow-y-auto">
        <h2 className="text-lg font-bold">Selected Products</h2>

        {categories.map((cat) => (
          <div key={cat._id} className="space-y-3 pb-4 border-b">
            {/* CATEGORY BUTTON */}
            <button
              onClick={() => {
                setActiveCategory(cat);
                setActiveSegment(null);
                setAnalysisData(null);
                navigate(`/analysis/category/${cat._id}`);
              }}
              className={`w-full text-left p-3 rounded-lg border font-semibold ${
                activeCategory?._id === cat._id
                  ? "bg-blue-100 border-blue-500"
                  : "bg-slate-50"
              }`}
            >
              📦 {cat.name}
            </button>

            {/* SEGMENT BUTTONS */}
            <div className="grid grid-cols-2 gap-2">
              {SEGMENTS.map((seg) => (
                <button
                  key={seg}
                  onClick={() => {
                    setActiveCategory(cat);
                    setActiveSegment(seg);
                    navigate(`/analysis/category/${cat._id}/${seg}`);
                  }}
                  className={`p-2 rounded-lg border text-xs font-semibold ${
                    activeSegment === seg && activeCategory?._id === cat._id
                      ? "bg-green-100 border-green-500"
                      : "bg-slate-50"
                  }`}
                >
                  {seg.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ================= RIGHT PANEL ================= */}
      <div className="flex-1 p-8 overflow-y-auto">
        {!activeCategory && (
          <div className="text-center text-slate-500 mt-20">
            👈 Select a category
          </div>
        )}

        {activeCategory && !activeSegment && (
          <div className="text-center text-slate-500 mt-20">
            👉 Select Premium / Standard / Basic / Discount
          </div>
        )}

        {loading && (
          <div className="text-center mt-20">Loading analysis...</div>
        )}

        {!loading && activeCategory && activeSegment && !analysisData && (
          <div className="text-center mt-20 text-red-500">
            No data received from API
          </div>
        )}

        {!loading && analysisData && activeCategory && activeSegment && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">
              {activeCategory.name} – {activeSegment?.toUpperCase()}
            </h2>

            {/* CORE SCORE */}
            {analysisData.coreScore !== undefined && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold mb-2">Core Score</h3>
                <p className="text-4xl font-bold text-blue-600">
                  {analysisData.coreScore}
                </p>
              </div>
            )}

            {/* BREAKDOWN */}
            {analysisData.breakdown && analysisData.breakdown.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold mb-4">Breakdown</h3>
                <table className="w-full border rounded">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-2 text-left">Multiplier</th>
                      <th className="p-2 text-left">Indicator</th>
                      <th className="p-2 text-left">Achieved</th>
                      <th className="p-2 text-left">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysisData.breakdown.map((b, i) => (
                      <tr key={i} className="border-t">
                        <td className="p-2">{b.multiplier ?? 'N/A'}</td>
                        <td className="p-2">{b.keyIndicator ?? 'N/A'}</td>
                        <td className="p-2">{b.achievedPoints ?? 'N/A'}</td>
                        <td className="p-2 font-semibold">{b.totalScore ?? 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* MULTIPLIERS */}
            {analysisData.multipliers && analysisData.multipliers.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold mb-4">
                  Multipliers {analysisData.multiplierOnCoreScore && `(×${analysisData.multiplierOnCoreScore})`}
                </h3>
                <div className="space-y-3">
                  {analysisData.multipliers.map((m, i) => (
                    <div key={i} className="bg-slate-50 p-4 rounded-lg border">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold">{m.title ?? 'Untitled'}</h4>
                          <p className="text-sm text-slate-600">{m.description ?? ''}</p>
                        </div>
                        <span className="text-xl font-bold text-green-600">×{m.value ?? 0}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TOTAL SCORE */}
            {analysisData.totalScore !== undefined && (
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 rounded-lg shadow-lg text-white">
                <h3 className="font-semibold text-xl mb-2">
                  Total Score
                </h3>
                <p className="text-6xl font-bold">
                  {analysisData.totalScore}
                </p>
              </div>
            )}

            {/* COMPETITORS */}
            {analysisData.competitors && analysisData.competitors.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold mb-4 text-lg">Competitors Comparison</h3>
                <div className="space-y-3">
                  {analysisData.competitors.map((comp, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border">
                      <div>
                        <p className="font-semibold text-slate-900">{comp.name}</p>
                        <p className="text-sm text-slate-500">Score: {comp.score.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">{comp.score.toFixed(0)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LOCAL COMPETITION */}
            {analysisData.localCompetition !== undefined && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold mb-2">Local Competition</h3>
                <p className="text-4xl font-bold text-orange-600">{analysisData.localCompetition}</p>
                <p className="text-sm text-slate-600 mt-2">Competitors in your area</p>
              </div>
            )}

            {/* MARKET DATA */}
            {analysisData.market && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold mb-4 text-lg">Market Analysis</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-slate-600">Market Share</p>
                    <p className="text-2xl font-bold text-blue-600">{analysisData.market.marketShare?.toFixed(2)}%</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <p className="text-sm text-slate-600">Total Market Size</p>
                    <p className="text-2xl font-bold text-purple-600">₹{(analysisData.market.totalMarketSize / 100000).toFixed(1)}L</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-sm text-slate-600">Your Sales</p>
                    <p className="text-2xl font-bold text-green-600">₹{(analysisData.market.yourSales / 100000).toFixed(1)}L</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <p className="text-sm text-slate-600">Direct Demand</p>
                    <p className="text-2xl font-bold text-yellow-600">₹{(analysisData.market.directDemand / 100000).toFixed(1)}L</p>
                  </div>
                  {analysisData.market.substituteDemand !== undefined && (
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <p className="text-sm text-slate-600">Substitute Demand</p>
                      <p className="text-2xl font-bold text-red-600">₹{(analysisData.market.substituteDemand / 100000).toFixed(1)}L</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
