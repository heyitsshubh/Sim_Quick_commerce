/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";

const STORAGE_KEY = "step6_sourcing_state";

export default function SourcingSection({ round, onComplete }: any) {
  const [config, setConfig] = useState<any>(null);
  const [state, setState] = useState<any>({
    supplierStrategy: {
      directBrands: { enabled: false, percentage: 0 },
      wholesaleMarkets: { enabled: false, percentage: 0 },
      privateLabel: { enabled: false, skuCount: 50 },
      localVendors: { enabled: false }
    },
    procurementTeam: {
      categoryManagers: 5,
      qualityControl: 3
    }
  });

  const [impact, setImpact] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  /* ================= LOAD CONFIG + RESTORE ================= */

  useEffect(() => {
    const load = async () => {
      const cfg = await axios.get(
        "https://sim-quick-commerce-backend.onrender.com/api/sourcing-config"
      );
      setConfig(cfg.data);

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setState(JSON.parse(saved));
      }
    };
    load();
  }, []);

  /* ================= LIVE CALC ================= */

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

    axios
      .post(
        "https://sim-quick-commerce-backend.onrender.com/api/step-six/calculate",
        state
      )
      .then(res => setImpact(res.data))
      .catch(() => {});
  }, [state]);

  /* ================= HELPERS ================= */

  const toggle = (key: string) => {
    setState((p: any) => ({
      ...p,
      supplierStrategy: {
        ...p.supplierStrategy,
        [key]: {
          ...p.supplierStrategy[key],
          enabled: !p.supplierStrategy[key].enabled
        }
      }
    }));
  };

const updatePercent = (key: string, value: number) => {
  setState((p: any) => ({
    ...p,
    supplierStrategy: {
      ...p.supplierStrategy,
      [key]: { ...p.supplierStrategy[key], percentage: value }
    }
  }));
};

  const percentTotal =
    state.supplierStrategy.directBrands.percent +
    state.supplierStrategy.wholesaleMarkets.percent;

  const privateLabelAllowed =
    state.supplierStrategy.directBrands.enabled &&
    state.supplierStrategy.wholesaleMarkets.enabled;

  /* ================= SAVE ================= */

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      await axios.post(
        "https://sim-quick-commerce-backend.onrender.com/api/step-six/save",
        {
          userId: localStorage.getItem("userId"),
          simulationId: localStorage.getItem("simulationId"),
          roundNumber: round,
          ...state
        }
      );

      onComplete(state);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  /* ================= UI ================= */

  if (!config) return <div>Loading sourcing setup...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* LEFT */}
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-2xl font-bold">Sourcing & Procurement</h2>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* ================= SUPPLIER STRATEGY ================= */}

        <Section title="Supplier Strategy">

          <PercentOption
            label="Direct from Brands"
            value={state.supplierStrategy.directBrands}
            onToggle={() => toggle("directBrands")}
            onChange={(v: number) => updatePercent("directBrands", v)}
          />

          <PercentOption
            label="Wholesale Markets"
            value={state.supplierStrategy.wholesaleMarkets}
            onToggle={() => toggle("wholesaleMarkets")}
            onChange={(v: number) => updatePercent("wholesaleMarkets", v)}
          />

          <div className="text-sm text-slate-600">
            Total Allocation: <b>{percentTotal}%</b>
          </div>

          <CheckboxOption
            label="Private Label Products"
            disabled={!privateLabelAllowed}
            checked={state.supplierStrategy.privateLabel.enabled}
            onToggle={() => toggle("privateLabel")}
          />

          {state.supplierStrategy.privateLabel.enabled && (
            <Slider
              label="Private Label SKUs"
              min={50}
              max={500}
              value={state.supplierStrategy.privateLabel.skus}
              set={(v: number) =>
                setState((p: any) => ({
                  ...p,
                  supplierStrategy: {
                    ...p.supplierStrategy,
              privateLabel: {
  ...p.supplierStrategy.privateLabel,
  skuCount: v
}
                  }
                }))
              }
            />
          )}

          <CheckboxOption
            label="Local Vendor Partnerships"
            checked={state.supplierStrategy.localVendors.enabled}
            onToggle={() => toggle("localVendors")}
          />
        </Section>

        {/* ================= PROCUREMENT TEAM ================= */}

        <Section title="Procurement Team">
          <Slider
            label="Category Managers"
            min={5}
            max={30}
            value={state.procurementTeam.categoryManagers}
            set={(v: number) =>
              setState((p: any) => ({
                ...p,
                procurementTeam: { ...p.procurementTeam, categoryManagers: v }
              }))
            }
          />

          <Slider
            label="Quality Control Team"
            min={3}
            max={20}
            value={state.procurementTeam.qualityControl}
            set={(v: number) =>
              setState((p: any) => ({
                ...p,
                procurementTeam: { ...p.procurementTeam, qualityControl: v }
              }))
            }
          />
        </Section>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold py-3 rounded-xl"
        >
          {saving ? "Saving..." : "Save Sourcing Strategy"}
        </button>
      </div>

      {/* RIGHT – IMPACT */}
      {impact && (
        <div className="sticky top-6 bg-gradient-to-br from-green-50 to-blue-50 border rounded-2xl p-6 shadow-sm">
          <h4 className="font-semibold text-lg mb-3">Impact Summary</h4>

          <p className="text-2xl font-bold mb-4">
            ₹{(impact.totalCost / 100000).toFixed(2)} L / month
          </p>

          <ul className="space-y-2 text-sm">
            <li>📈 Margin +{impact.kpis.margin}%</li>
            <li>🥬 Freshness +{impact.kpis.freshness}%</li>
            <li>✅ Quality +{impact.kpis.quality}%</li>
            <li>💰 Cost Efficiency +{impact.kpis.costEfficiency}%</li>
          </ul>
        </div>
      )}
    </div>
  );
}

/* ================= REUSABLE UI ================= */

function Section({ title, children }: any) {
  return (
    <div className="bg-white border rounded-2xl p-5 space-y-4">
      <h3 className="font-semibold text-lg">{title}</h3>
      {children}
    </div>
  );
}

function PercentOption({ label, value, onToggle, onChange }: any) {
  return (
    <div className="border rounded-xl p-4">
      <label className="flex gap-3 items-center">
        <input type="checkbox" checked={value.enabled} onChange={onToggle} />
        <span className="font-medium">{label}</span>
      </label>

      {value.enabled && (
        <input
          type="number"
          min={0}
          max={100}
          value={value.percent}
          onChange={(e) => onChange(+e.target.value)}
          className="mt-2 w-full border rounded-lg px-3 py-2"
          placeholder="% of inventory"
        />
      )}
    </div>
  );
}

function CheckboxOption({ label, checked, onToggle, disabled }: any) {
  return (
    <label
      className={`flex gap-3 p-4 border rounded-xl ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      <input type="checkbox" checked={checked} disabled={disabled} onChange={onToggle} />
      <span className="font-medium">{label}</span>
    </label>
  );
}

function Slider({ label, min, max, value, set }: any) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => set(+e.target.value)}
        className="w-full"
      />
      <div className="text-sm text-slate-600">{value}</div>
    </div>
  );
}
