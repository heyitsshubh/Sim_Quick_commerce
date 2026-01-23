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
  const [selections, setSelections] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [websiteBudget, setWebsiteBudget] = useState(0);

  useEffect(() => {
    const load = async () => {
      const { data } = await axios.get(
        "https://sim-quick-commerce-backend.onrender.com/api/technology-config"
      );
      setConfig(data);
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSelections(parsed);
        setWebsiteBudget(parsed.websiteBudget || 0);
      } else {
        setSelections({
          customerFacing: {
            mobileApp: true,
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
        setWebsiteBudget(0);
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
    if (!config || !selections) return;

    const calculate = async () => {
      const { data } = await axios.post(
        "https://sim-quick-commerce-backend.onrender.com/api/step-five/calculate",
        {
          ...selections,
          websiteBudget
        }
      );
      setResult(data);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...selections,
        websiteBudget
      }));
    };

    calculate();
  }, [selections, websiteBudget, config]);

  /* ===== SAVE ===== */
  const handleSave = async () => {
    setSaving(true);
    await axios.post(
      "https://sim-quick-commerce-backend.onrender.com/api/step-five/save",
      {
        userId: localStorage.getItem("userId"),
        simulationId: localStorage.getItem("simulationId"),
        roundNumber: round,
        ...selections,
        websiteBudget
      }
    );
    onComplete({ selections, result });
    setSaving(false);
  };

  if (loading || !selections) return <div>Loading Technology Setup...</div>;

  /* ===== UI ===== */
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* LEFT SIDE – OPTIONS */}
      <div className="lg:col-span-2 space-y-8">
        <h2 className="text-2xl font-bold">Technology & Platform</h2>

        {/* WEBSITE BUDGET SLIDER */}

        {/* CUSTOMER FACING */}
        <Section title="Customer Facing Systems" subtitle="User experience & growth drivers">
          {Object.entries(config.customerFacing).map(([key, value]: any) => {
            // Skip website - it's a slider now
            if (key === "website") return null;
            return (
              <TechOption
                key={key}
                label={formatLabel(key)}
                checked={!!selections.customerFacing[key]}
                required={key === "mobileApp"}
                cost={value.devCost || value.setupCost}
                impact={
                  key === "aiRecommendations"
                    ? ["+15% basket size", "+10% conversion"]
                    : ["Improved customer experience"]
                }
                onToggle={() => toggle("customerFacing", key)}
              />
            );
          })}
        </Section> 
        <Section title="Operations & Intelligence" subtitle="Efficiency, margins & scalability">
          {Object.entries(config.operations).map(([key, value]: any) => (
            <TechOption
              key={key}
              label={formatLabel(key)}
              checked={!!selections.operations[key]}
              required={key === "darkStoreSystem" || key === "riderApp"}
              cost={value.cost || value.devCost}
              impact={getOperationImpact(key, value)}
              onToggle={() => toggle("operations", key)}
            />
          ))}
        </Section>
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
          <label className="text-lg font-semibold text-blue-900 mb-2 block">
            Website Development Budget: ₹{websiteBudget} Lakhs
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={websiteBudget}
            onChange={(e) => setWebsiteBudget(Number(e.target.value))}
            className="w-full h-2 bg-blue-300 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-blue-700 mt-2">
            <span>₹0 L</span>
            <span>₹100 L</span>
          </div>
          <p className="text-sm text-blue-800 mt-3">
            💡 Allocate budget for website development. Higher investment = better conversion & features.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
        >
          {saving ? "Saving..." : "Save Technology Setup"}
        </button>
      </div>

      {/* RIGHT SIDE – IMPACT */}
      <div className="space-y-6 sticky top-6 h-fit">
        {result && (
          <>
            <ImpactCard
              title="Total Technology Cost"
              icon="💻"
              cost={result.totalCost}
              kpis={[
                { label: "Conversion", value: `+${result.customerFacing?.kpis?.conversion || 0}%` },
                { label: "Basket Size", value: `+${result.customerFacing?.kpis?.basketSize || 0}%` },
                { label: "Waste Reduction", value: `${Math.abs(result.operations?.kpis?.wasteReduction || 0)}%` },
                { label: "Decision Quality", value: `+${result.operations?.kpis?.decisionQuality || 0}%` }
              ]}
            />
          </>
        )}
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Section({ title, subtitle, children }: any) {
  return (
    <div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-sm text-slate-500 mb-4">{subtitle}</p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function TechOption({ label, checked, required, cost, impact, onToggle }: any) {
  return (
    <label
      className={`flex items-start justify-between gap-4 p-4 rounded-xl border cursor-pointer transition ${
        checked
          ? "bg-green-50 border-green-400"
          : "border-slate-200 hover:border-slate-300"
      } ${required && "opacity-80 cursor-not-allowed bg-blue-50 border-blue-300"}`}
    >
      <div className="flex gap-3">
        <input
          type="checkbox"
          checked={checked}
          disabled={required}
          onChange={onToggle}
          className="mt-1"
        />
        <div>
          <div className="font-semibold">
            {label} {required && <span className="text-xs text-blue-600">(Required)</span>}
          </div>
          {cost && (
            <div className="text-xs text-slate-600">
              Cost: ₹{cost.max} L
            </div>
          )}
          {impact && (
            <ul className="mt-1 text-xs text-green-700 list-disc ml-4">
              {impact.map((i: string) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </label>
  );
}

function ImpactCard({ title, icon, cost, kpis }: any) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-white to-slate-50 p-6 shadow-md">
      <div className="flex items-center gap-4 mb-4">
        <div className="h-12 w-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl">
          {icon}
        </div>
        <div>
          <h4 className="font-semibold">{title}</h4>
          <p className="text-xs text-slate-500">Monthly impact</p>
        </div>
      </div>

      <div className="text-3xl font-bold mb-4">
        ₹{cost.toFixed(2)} L
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {kpis.map((k: any) => (
          <div
            key={k.label}
            className="bg-green-100 text-green-700 rounded-lg px-3 py-2 text-xs font-semibold flex justify-between"
          >
            <span>{k.label}</span>
            <span>{k.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
/* ================= HELPERS ================= */

function formatLabel(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase());
}
function getOperationImpact(key: string, value: any) {
  switch (key) {
    case "demandForecastingAI":
      return [`${Math.abs(value.wasteReductionPercent || 0)}% waste reduction`, "+10% planning accuracy"];
    case "dynamicPricing":
      return ["+8% margin", "+5% revenue uplift"];
    case "supplyChainAnalytics":
      return ["+15% decision quality", "+10% cost efficiency"];
    default:
      return ["Operational efficiency boost"];
  }
}              