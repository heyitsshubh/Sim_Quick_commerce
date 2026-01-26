/* eslint-disable @typescript-eslint/no-explicit-any */
import {  TrendingUp, TrendingDown, Percent, Calculator } from "lucide-react";
import { useEffect } from "react";

export default function PriceSliders({ prices, onChange, basePrices, marginMultiplier, onMarginChange }: any) {
  useEffect(() => {
    if (basePrices && Object.keys(prices).length === 0) {
      Object.keys(basePrices).forEach((key) => onChange(key, Math.round(basePrices[key] * marginMultiplier)));
    }
  }, [basePrices]);

  useEffect(() => {
    if (!basePrices) return;
    Object.keys(basePrices).forEach((key) => onChange(key, Math.round(basePrices[key] * marginMultiplier)));
  }, [marginMultiplier, basePrices]);

  const categories = basePrices
    ? Object.keys(basePrices).map((key) => ({
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1),
        basePrice: basePrices[key],
        icon: getIconForCategory(key),
        color: getColorForCategory(key)
      }))
    : [];

  function getIconForCategory(category: string) {
    const icons: Record<string, string> = {
      food: "🍔",
      skincare: "💄",
      mobile: "📱",
      electronics: "💻",
      groceries: "🛒",
      fashion: "👕",
      homeGoods: "🏠"
    };
    return icons[category.toLowerCase()] || "📦";
  }

  function getColorForCategory(category: string) {
    const colors = ["blue", "indigo", "pink", "green", "purple", "orange", "cyan"];
    const keys = Object.keys(basePrices || {});
    const index = keys.indexOf(category);
    return colors[index % colors.length];
  }

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      blue: "#3b82f6",
      indigo: "#6366f1",
      pink: "#ec4899",
      green: "#10b981",
      purple: "#a855f7",
      orange: "#f97316",
      cyan: "#06b6d4"
    };
    return colors[color] || colors.blue;
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

  const calculatePrice = (basePrice: number) => Math.round(basePrice * marginMultiplier);

  const getMinMax = (basePrice: number) => ({ min: Math.floor(basePrice * 1), max: Math.ceil(basePrice * 5) });

  const handleMarginChange = (newMultiplier: number) => {
    onMarginChange(newMultiplier);
    if (!basePrices) return;
    Object.keys(basePrices).forEach((key) => onChange(key, calculatePrice(basePrices[key])));
  };

  if (!basePrices || Object.keys(basePrices).length === 0) {
    return <div className="text-center py-8 text-gray-500">Loading pricing data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-indigo-100 p-2.5 rounded-lg">
            <Calculator className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h4 className="font-bold text-indigo-900 text-lg">Margin Multiplier</h4>
            <p className="text-sm text-indigo-700">Set your profit margin across all categories</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="number"
              min="1"
              max="10"
              step="0.1"
              value={marginMultiplier}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (value >= 1 && value <= 10) handleMarginChange(value);
              }}
              className="w-full px-4 py-3 text-2xl font-bold text-indigo-600 bg-white border-2 border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="bg-white rounded-xl p-4 border-2 border-indigo-200 min-w-[140px]">
            <div className="flex items-center gap-2 mb-1">
              <Percent className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-medium text-gray-600">Margin</span>
            </div>
            <p className="text-2xl font-bold text-indigo-600">{((marginMultiplier - 1) * 100).toFixed(0)}%</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-3">
          {[1.5, 2.0, 2.5, 3.0].map((preset) => (
            <button
              key={preset}
              onClick={() => handleMarginChange(preset)}
              className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                marginMultiplier === preset ? "bg-indigo-600 text-white shadow-lg scale-105" : "bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50"
              }`}
            >
              {preset}x
            </button>
          ))}
        </div>
      </div>

      {categories.map((cat) => {
        const basePrice = cat.basePrice;
        const currentPrice = prices[cat.key] || calculatePrice(basePrice);
        const { min, max } = getMinMax(basePrice);
        const percentage = ((currentPrice - min) / (max - min)) * 100;
        const suggestedPrice = calculatePrice(basePrice);
        const priceChange = ((currentPrice - basePrice) / basePrice) * 100;

        return (
          <div key={cat.key} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{cat.icon}</div>
                <div>
                  <label className="text-base font-bold text-gray-800">{cat.label}</label>
                  <p className="text-xs text-gray-500">Base Cost: {formatCurrency(basePrice)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold" style={{ color: getColorClass(cat.color) }}>
                  {formatCurrency(currentPrice)}
                </p>
                <div className={`flex items-center gap-1 text-xs ${priceChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {priceChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span className="font-semibold">
                    {priceChange >= 0 ? "+" : ""}
                    {priceChange.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {Math.abs(currentPrice - suggestedPrice) > 5 && (
              <div className="mb-3 bg-blue-50 border border-blue-200 rounded-lg p-2 flex items-center justify-between">
                <span className="text-xs text-blue-700 font-medium">💡 Suggested price ({marginMultiplier}x):</span>
                <button onClick={() => onChange(cat.key, suggestedPrice)} className="text-sm font-bold text-blue-600 hover:text-blue-800 underline">
                  {formatCurrency(suggestedPrice)}
                </button>
              </div>
            )}

            <input
              type="range"
              min={min}
              max={max}
              step="5"
              value={currentPrice}
              onChange={(e) => onChange(cat.key, Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer mb-2"
              style={{
                background: `linear-gradient(to right, ${getColorClass(cat.color)} 0%, ${getColorClass(cat.color)} ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`
              }}
            />

            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 font-medium">{formatCurrency(min)}</span>
              <span className="text-xs text-gray-500 font-medium">{formatCurrency(max)}</span>
            </div>
          </div>
        );
      })}

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          border: 3px solid currentColor;
          transition: all 0.2s;
        }
        input[type="range"]::-webkit-slider-thumb:hover { transform: scale(1.15); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); }
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          border: 3px solid currentColor;
          transition: all 0.2s;
        }
        input[type="range"]::-moz-range-thumb:hover { transform: scale(1.15); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button { opacity: 1; }
      `}</style>
    </div>
  );
}