/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";

interface TechnologySectionProps {
  round: number;
  onComplete: (data: any) => void;
}

const STORAGE_KEY = "step5_technology_state";

export default function TechnologySection({ round, onComplete }: TechnologySectionProps) {
  const [config, setConfig] = useState<any>(null);
  const [selections, setSelections] = useState<any>({});
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ===== LOAD CONFIG + RESTORE ===== */

  useEffect(() => {
    const load = async () => {
      const { data } = await axios.get(
        "https://sim-quick-commerce-backend.onrender.com/api/technology-config"
      );
      setConfig(data);

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSelections(JSON.parse(saved));
      } else {
    setSelections({
  customerFacing: {
    mobileApp: true,
    website: false,
    voiceOrdering: false,
    aiRecommendations: false
  },
  operations: {
    darkStoreSystem: true,
    riderApp: true,
    demandForecastingAI: false,
    dynamicPricing: false,
    supplyChainAnalytics: false
  }
});

      }
      setLoading(false);
    };
    load();
  }, []);

  /* ===== TOGGLE ===== */

  const toggle = (section: string, key: string) => {
    setSelections((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: !prev[section]?.[key]
      }
    }));
  };

  /* ===== LIVE CALCULATION ===== */

  useEffect(() => {
    if (!config) return;

    const calculate = async () => {
      const { data } = await axios.post(
        "https://sim-quick-commerce-backend.onrender.com/api/step-five/calculate",
        selections
      );
      setResult(data);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selections));
    };

    calculate();
  }, [selections, config]);

  /* ===== SAVE ===== */

  const handleSave = async () => {
    setSaving(true);

    await axios.post(
      "https://sim-quick-commerce-backend.onrender.com/api/step-five/save",
      {
        userId: localStorage.getItem("userId"),
        simulationId: localStorage.getItem("simulationId"),
        roundNumber: round,
        ...selections
      }
    );

    onComplete({ ...selections, result });
    setSaving(false);
  };

  if (loading) return <div>Loading Technology Setup...</div>;

  /* ===== UI ===== */

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Technology & Platform</h2>

      {/* CUSTOMER FACING */}
      <h3 className="font-semibold mb-3">Customer Facing</h3>
      {Object.entries(config.customerFacing).map(([key, value]: any) => (
        <Option
          key={key}
          label={key}
          checked={!!selections.customerFacing?.[key]}
          required={key === "mobileApp"}
          cost={value.devCost || value.setupCost}
          onToggle={() => toggle("customerFacing", key)}
        />
      ))}

      {/* OPERATIONS */}
      <h3 className="font-semibold mt-6 mb-3">Operations</h3>
      {Object.entries(config.operations).map(([key, value]: any) => (
        <Option
          key={key}
          label={key}
          checked={!!selections.operations?.[key]}
          required={key === "darkStoreSystem" || key === "riderApp"}
          cost={value.cost || value.devCost}
          impact={value.wasteReductionPercent}
          onToggle={() => toggle("operations", key)}
        />
      ))}

      {/* IMPACT */}
      {result && (
        <div className="mt-6 bg-green-50 border p-4 rounded-xl">
          <h3 className="font-semibold mb-2">Impact Summary</h3>
          <p><b>Total Cost:</b> ₹{(result.totalCost).toFixed(2)} L</p>
          <ul className="text-sm mt-2 space-y-1">
            <li>🛒 Conversion +{result.customerFacing?.kpis?.conversion || 0}%</li>
            <li>🧺 Basket Size +{result.customerFacing?.kpis?.basketSize || 0}%</li>
            <li>📉 Waste Reduction −{result.operations?.kpis?.wasteReduction || 0}%</li>
            <li>📊 Decision Quality +{result.operations?.kpis?.decisionQuality || 0}%</li>
          </ul>
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl"
      >
        {saving ? "Saving..." : "Save Technology Setup"}
      </button>
    </div>
  );
}

/* ===== OPTION COMPONENT ===== */

function Option({ label, checked, required, cost, impact, onToggle }: any) {
  return (
    <label className="flex items-start gap-3 p-4 border rounded-xl mb-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        disabled={required}
        onChange={onToggle}
      />
      <div>
        <div className="font-semibold">
          {label} {required && "(Required)"}
        </div>
        {cost && (
          <div className="text-sm text-slate-600">
            Cost: ₹{cost.min}–{cost.max} L
          </div>
        )}
        {impact && (
          <div className="text-sm text-green-600">
            Impact: Reduce waste {impact}%
          </div>
        )}
      </div>
    </label>
  );
}
