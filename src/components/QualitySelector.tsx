/* eslint-disable @typescript-eslint/no-explicit-any */
import { Star, TrendingUp, Lock, DollarSign, CheckCircle2, Square } from "lucide-react";

export default function QualitySelector({
  value,
  maxAllowed,
  onChange,
  config,
  selectedCategories = [],
  onCategoryChange
}: any) {
  const qualityLevels = [
    { level: 1, label: "Basic", color: "from-gray-400 to-gray-500", locked: false },
    { level: 2, label: "Standard", color: "from-blue-400 to-blue-500", locked: false },
    { level: 3, label: "Good", color: "from-green-400 to-green-500", locked: false },
    { level: 4, label: "Premium", color: "from-yellow-400 to-yellow-500", locked: false },
    { level: 5, label: "Superior", color: "from-orange-400 to-orange-500", locked: false },
    { level: 6, label: "Luxury", color: "from-purple-400 to-purple-500", locked: true },
    { level: 7, label: "Ultra-Premium", color: "from-pink-500 to-rose-500", locked: true }
  ];

  const isLocked = (level: number) => level > maxAllowed || qualityLevels[level - 1]?.locked;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

  const getCategoryCosts = () => {
    if (!config?.basePrices || !config?.qualityMultipliers) return [];
    const multiplier = config.qualityMultipliers[value.toString()] || 1;
    return Object.entries(config.basePrices).map(([key, basePrice]: [string, any]) => ({
      key,
      category: key.charAt(0).toUpperCase() + key.slice(1),
      basePrice,
      adjustedPrice: basePrice * multiplier,
      multiplier
    }));
  };

  const categoryCosts = getCategoryCosts();

  const handleToggleCategory = (key: string) => {
    if (!onCategoryChange) return;
    const exists = selectedCategories.map((c: string) => c.toLowerCase()).includes(key.toLowerCase());
    const next = exists
      ? selectedCategories.filter((c: string) => c.toLowerCase() !== key.toLowerCase())
      : [...selectedCategories, key];
    onCategoryChange(next);
  };

  return (
    <div className="space-y-4">
      {/* Slider */}
      <div className="relative">
        <input
          type="range"
          min="1"
          max={Math.min(maxAllowed, 5)}
          value={Math.min(value, 5)}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-3 bg-gradient-to-r from-gray-200 via-green-200 to-orange-300 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, 
              #9ca3af 0%, 
              #3b82f6 ${(1 / 5) * 100}%, 
              #10b981 ${(3 / 5) * 100}%, 
              #f59e0b ${(5 / 5) * 100}%)`
          }}
        />
        <style>{`
          input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: white;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            border: 3px solid #10b981;
            transition: all 0.2s;
          }
          input[type="range"]::-webkit-slider-thumb:hover { transform: scale(1.2); box-shadow: 0 6px 16px rgba(0,0,0,0.4); }
          input[type="range"]::-moz-range-thumb { width: 24px; height: 24px; border-radius: 50%; background: white; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 3px solid #10b981; transition: all 0.2s; }
          input[type="range"]::-moz-range-thumb:hover { transform: scale(1.2); box-shadow: 0 6px 16px rgba(0,0,0,0.4); }
        `}</style>
      </div>

      {/* Quality Level Cards */}
      <div className="grid grid-cols-7 gap-2">
        {qualityLevels.map((q) => {
          const locked = isLocked(q.level);
          return (
            <button
              key={q.level}
              disabled={locked}
              onClick={() => !locked && onChange(q.level)}
              className={`relative group transition-all duration-300 ${locked ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}`}
            >
              <div
                className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                  value === q.level && !locked
                    ? `bg-gradient-to-br ${q.color} border-white shadow-xl scale-105`
                    : locked
                    ? "bg-gray-100 border-gray-300"
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  {locked ? (
                    <Lock className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Star className={`w-5 h-5 ${value === q.level ? "text-white fill-white" : "text-gray-400"}`} />
                  )}
                  <span className={`text-xs font-semibold ${value === q.level && !locked ? "text-white" : "text-gray-600"}`}>
                    {q.level}
                  </span>
                </div>
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                {locked ? `🔒 ${q.label} (Locked)` : q.label}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Current Selection Info */}
      <div className={`bg-gradient-to-br ${qualityLevels[value - 1]?.color} rounded-xl p-4 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm opacity-90">Current Quality Level</p>
              <p className="text-2xl font-bold">{qualityLevels[value - 1]?.label}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Multiplier</p>
            <p className="text-3xl font-bold">{config?.qualityMultipliers?.[value.toString()] || 1}x</p>
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      {categoryCosts.length > 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <h4 className="font-semibold text-blue-900">Cost Impact by Category</h4>
          </div>

          <div className="space-y-2">
            {categoryCosts.map((item, index) => {
              const isSelected = selectedCategories.map((c: string) => c.toLowerCase()).includes(item.key.toLowerCase());
              return (
              <button
                  key={index}
                  type="button"
                  onClick={() => handleToggleCategory(item.key)}
                  className={`w-full text-left flex justify-between items-center rounded-lg p-3 border transition-all cursor-pointer ${
                    isSelected ? "bg-blue-100/70 border-blue-300 shadow-sm" : "bg-white border-gray-200 hover:border-blue-200"
                  }`}
                  aria-pressed={isSelected}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      {isSelected ? <CheckCircle2 className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4 text-gray-400" />}
                      <p className="text-sm font-medium text-gray-700">{item.category}</p>
                      {isSelected && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">Base: {formatCurrency(item.basePrice)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">{formatCurrency(item.adjustedPrice)}</p>
                    <p className="text-xs text-green-600 font-semibold">+{((item.multiplier - 1) * 100).toFixed(0)}%</p>
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      )}

      {/* Quality Description */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="bg-green-100 p-2 rounded-lg">
            <Star className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-1">Quality Impact</h4>
            <p className="text-sm text-gray-600">
              {value <= 2 && "Entry-level quality suitable for budget-conscious customers."}
              {value === 3 && "Good quality that meets most customer expectations."}
              {value === 4 && "Premium quality that exceeds standard expectations."}
              {value === 5 && "Superior quality that delights discerning customers."}
              {value === 6 && "Luxury quality for high-end market segments."}
              {value === 7 && "Ultra-premium quality representing the pinnacle of excellence."}
            </p>
          </div>
        </div>
      </div>

      {/* Locked Levels Notice */}
      {(qualityLevels[5]?.locked || qualityLevels[6]?.locked) && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Lock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold text-purple-800 mb-1">Premium Levels Locked</h4>
              <p className="text-sm text-purple-700">
                Unlock Luxury (Level 6) and Ultra-Premium (Level 7) quality tiers by investing in advanced R&D and achieving higher market performance.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}