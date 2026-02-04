import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

type Category = {
  _id: string;
  name: string;
};

const SEGMENTS = ["Premium", "Standard", "Basic", "Discount"];
const SELECTION_KEY = "step2_selections";

export default function AnalysisPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  // categoryId -> segment
  const [segmentsByCategory, setSegmentsByCategory] = useState<Record<string, string>>({});

  /* ================= LOAD SELECTED PRODUCT CATEGORIES ================= */
  useEffect(() => {
    const load = async () => {
      const res = await axios.get(
        "https://sim-quick-commerce-backend.onrender.com/api/step-two/categories"
      );

      const allCategories: Category[] = res.data || [];

      const rawSelections = localStorage.getItem(SELECTION_KEY);
      const selections = rawSelections ? JSON.parse(rawSelections) : {};

      const selectedCategories = allCategories.filter(
        (cat) => selections[cat._id]
      );

      setCategories(selectedCategories);
    };

    load();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <div className="w-96 bg-white border-r p-6 space-y-6 overflow-y-auto">
        <div>
          <h2 className="text-lg font-bold">Selected Products</h2>
          <p className="text-xs text-slate-500 mt-1">
            Select a segment for each category
          </p>
        </div>

        {categories.map((cat) => (
          <div key={cat._id} className="space-y-3 pb-4 border-b last:border-b-0">
            <button 
              onClick={() => {
                setActiveCategory(cat);
                navigate(`/analysis/category/${cat._id}`);
              }}
              className={`w-full text-left p-3 rounded-lg border font-semibold transition ${
                activeCategory?._id === cat._id
                  ? "bg-blue-100 border-blue-500 text-blue-900"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-900"
              }`}
            >
              📦 {cat.name}
            </button>

            <div className="grid grid-cols-2 gap-2">
              {SEGMENTS.map((segment) => (
                <button
                  key={segment}
                  onClick={() => {
                    setSegmentsByCategory({
                      ...segmentsByCategory,
                      [cat._id]: segment
                    });
                    navigate(`/analysis/${segment.toLowerCase()}`);
                  }}
                  className={`p-2 rounded-lg border text-xs font-semibold transition ${
                    segmentsByCategory[cat._id] === segment
                      ? "bg-green-100 border-green-500 text-green-700"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-600"
                  }`}
                >
                  {segment}
                </button>
              ))}
            </div>

            {segmentsByCategory[cat._id] && (
              <div className="text-xs text-slate-600">
                ✅ {segmentsByCategory[cat._id]}
              </div>
            )}
          </div>
        ))}
      </div>

   
    </div>
  );
}
