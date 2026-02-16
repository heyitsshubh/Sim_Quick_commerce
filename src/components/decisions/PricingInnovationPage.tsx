/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";
import FeatureCatalog from "../FeatureCatalog";
import RDInvestmentSlider from "../RDInvestmentSlider";
import QualitySelector from "../QualitySelector";
import ProductCategoriesSection from "./ProductCategoriesSection";

export default function PricingInnovationPage({ round, onComplete }: any) {
  const [categories, setCategories] = useState<any[]>([]);
  const [features, setFeatures] = useState<any[]>([]);
  const [config, setConfig] = useState<any>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [rdInvestment, setRdInvestment] = useState(0);
  const [marginMultiplier, setMarginMultiplier] = useState(1.2);
  const [globalQualityLevel, setGlobalQualityLevel] = useState(3);
  const [saving, setSaving] = useState(false);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    axios
      .get("https://sim-quick-commerce-backend.onrender.com/api/pricing/categories")
      .then(res => {
        setCategories(
          res.data.map((c: any) => ({
            categoryId: c._id,
            name: c.name,
            basePrice: c.basePrice || 200,
            baseMonthlyDemand: c.baseMonthlyDemand,
          }))
        );
      });

    axios
      .get("https://sim-quick-commerce-backend.onrender.com/api/pricing/config")
      .then(res => {
        setFeatures(res.data.features);
        setConfig(res.data.config);
      });
  }, []);

  const pricingCategories = categories.filter(c =>
    selectedCategories.includes(c.name.toLowerCase())
  );

  /* ================= SAVE ================= */
const handleSave = async () => {
  setSaving(true);
const pricingCategoriesData = pricingCategories.map(cat => {
  const qualityMultiplier =
    config?.qualityMultipliers?.[globalQualityLevel] ?? 1;

  const safeMargin =
    typeof marginMultiplier === "number"
      ? marginMultiplier
      : 1;

  const baseMonthlyDemand =
    typeof cat.baseMonthlyDemand === "number"
      ? cat.baseMonthlyDemand
      : 0;

  // ✅ YOUR REQUIRED FORMULAS
  const qualityPrice =
    baseMonthlyDemand * qualityMultiplier;

  const finalSellingPrice =
    baseMonthlyDemand * safeMargin;

  const monthlyRevenue =
    finalSellingPrice * baseMonthlyDemand;

  return {
    categoryId: cat.categoryId,
    name: cat.name,

    baseMonthlyDemand,

    qualityLevel: globalQualityLevel,
    qualityMultiplier,
    qualityPrice,

    marginMultiplier: safeMargin,
    finalSellingPrice,

    monthlyRevenue
  };
});


  await axios.post(
    "https://sim-quick-commerce-backend.onrender.com/api/pricing/save",
    {
      userId: localStorage.getItem("userId"),
      simulationId: localStorage.getItem("simulationId"),
      round,
      categories: pricingCategoriesData,
      selectedFeatures,
      rdInvestment
    }
  );

  setSaving(false);
  onComplete();
};



  /* ================= UI ================= */
  return (
    <div className="space-y-6">
      {/* PART 1: PRODUCT CATEGORIES SELECTION */}
      <ProductCategoriesSection
        round={round}
        onComplete={() => {}}
        onCategorySelectionChange={setSelectedCategories}
        showMinimal={true}
      />

      {/* PART 2: GLOBAL QUALITY SELECTOR (Only Once) */}
      {categories.length > 0 && (
        <div className="bg-white border rounded-2xl p-4 md:p-5">
          <h3 className="font-bold text-base md:text-lg mb-4">Select Quality Level (Applied to All Categories)</h3>
          <QualitySelector
            value={globalQualityLevel}
            onChange={(v: number) => setGlobalQualityLevel(v)}
            config={config}
          />

          {/* Show adjusted demand for each category */}
          <div className="mt-6 space-y-3">
            <h4 className="font-semibold text-slate-700 text-sm md:text-base">Adjusted Demand by Category:</h4>
            {categories.map(cat => {
              const isSelected = selectedCategories.includes(cat.name.toLowerCase());
              const multiplier = config?.qualityMultipliers?.[globalQualityLevel.toString()] || 1;
              const adjustedDemand = Math.round(cat.baseMonthlyDemand * multiplier);

              return (
                <div
                  key={cat.categoryId}
                  className={`flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg ${
                    isSelected ? 'bg-slate-50' : 'bg-slate-50/60 opacity-70'
                  }`}
                >
                  <div className="min-w-0">
                    <span className="font-medium text-sm md:text-base truncate">{cat.name}</span>
                    {!isSelected && (
                      <span className="ml-2 text-xs text-slate-500">Not selected</span>
                    )}
                    <p className="text-xs md:text-sm text-slate-600">Base: {cat.baseMonthlyDemand}</p>
                  </div>
                  <div className="text-right w-full sm:w-auto">
                    {isSelected ? (
                      <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-xl p-3 md:p-4 w-full sm:min-w-[200px]">
                        <p className="text-xs font-semibold text-green-700 mb-1">FINAL BUYING PRICE</p>
                        <p className="text-2xl md:text-3xl font-bold text-green-700">
                          ₹{adjustedDemand.toLocaleString('en-IN')}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-3 md:p-4 w-full sm:min-w-[200px]">
                        <p className="text-xs font-semibold text-gray-400 mb-1">FINAL BUYING PRICE</p>
                        <p className="text-2xl md:text-3xl font-bold text-gray-400">—</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PART 3: MARGIN MULTIPLIER INPUT & CALCULATED PRICES */}
      {categories.length > 0 && (
        <div className="bg-white border rounded-2xl p-4 md:p-6">
          <h3 className="font-bold text-base md:text-lg mb-4">Set Margin Multiplier</h3>
          
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border">
            <label className="block text-xs md:text-sm font-medium mb-2">Margin Multiplier</label>
            <input
              type="number"
              min={0.5}
              max={5}
              step={0.1}
              value={marginMultiplier}
              onChange={(e) => setMarginMultiplier(+e.target.value)}
              className="w-full px-3 md:px-4 py-2 border rounded-lg text-base md:text-lg font-semibold"
            />
            <p className="text-xs text-slate-600 mt-2">
              Enter a multiplier to calculate final prices based on base prices
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-slate-700 text-sm md:text-base">Calculated Prices:</h4>
            {categories.map(cat => {
              const isSelected = selectedCategories.includes(cat.name.toLowerCase());
              const multiplier = config?.qualityMultipliers?.[globalQualityLevel.toString()] || 1;
              const adjustedDemand = Math.round(cat.baseMonthlyDemand * multiplier);
              const calculatedPrice = Math.round(adjustedDemand * marginMultiplier);
              
              return (
                <div
                  key={cat.categoryId}
                  className={`border rounded-xl p-4 md:p-6 transition-all ${
                    isSelected 
                      ? 'bg-white border-blue-200 shadow-md' 
                      : 'bg-slate-50/60 opacity-70 border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-base md:text-xl text-slate-900 truncate">{cat.name}</h5>
                      {!isSelected && (
                        <p className="text-xs text-slate-500 mt-1">Not selected in categories</p>
                      )}
                      <p className="text-xs md:text-sm text-slate-600 mt-2">
                        <span className="font-medium">Base:</span>{cat.baseMonthlyDemand.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right w-full sm:w-auto">
                      {isSelected ? (
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-3 md:p-4 w-full sm:min-w-[200px]">
                          <p className="text-xs font-semibold text-blue-700 mb-1">FINAL SELLING PRICE</p>
                          <p className="text-2xl md:text-3xl font-bold text-blue-700">
                            ₹{calculatedPrice.toLocaleString('en-IN')}
                          </p>
                        </div>
                      ) : (
                        <div className="bg-slate-100 border border-slate-300 rounded-xl p-3 md:p-4 w-full sm:min-w-[200px]">
                          <p className="text-xs font-semibold text-slate-500 mb-1">FINAL SELLING PRICE</p>
                          <p className="text-xl md:text-2xl font-bold text-slate-400">—</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <RDInvestmentSlider value={rdInvestment} onChange={setRdInvestment} />

      <FeatureCatalog
        features={features}
        selected={selectedFeatures}
        round={round}
        onToggle={(key: string) =>
          setSelectedFeatures(prev =>
            prev.includes(key)
              ? prev.filter(k => k !== key)
              : [...prev, key]
          )
        }
      />

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all text-sm md:text-base"
      >
        {saving ? "Saving..." : "Save Pricing Strategy"}
      </button>
    </div>
  );
}