/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";

interface MarketingSectionProps {
  round: number;
  onComplete: (data: any) => void;
}

const STORAGE_KEY = "step8_marketing_state";

export default function MarketingSection({ round, onComplete }: MarketingSectionProps) {
  const [config, setConfig] = useState<any>(null);
  const [state, setState] = useState<any>(null);
  const [impact, setImpact] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ================= LOAD CONFIG + SAFE STATE ================= */

  useEffect(() => {
    const load = async () => {
      const { data } = await axios.get(
        "https://sim-quick-commerce-backend.onrender.com/api/marketing-config"
      );

      setConfig(data);

      const baseState = {
        acquisition: {
          googleAds: {
            enabled: false,
            budget: data.acquisition.googleAds.minBudget
          },
          facebookAds: {
            enabled: false,
            budget: data.acquisition.facebookAds.minBudget
          },
          firstOrderDiscount: {
            enabled: true,
            percent: data.acquisition.firstOrderDiscount.minPercent
          }
        },
        retention: {
          pushNotifications: { enabled: true },
          loyaltyProgram: { enabled: false }
        }
      };

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setState({
            ...baseState,
            ...parsed,
            acquisition: { ...baseState.acquisition, ...parsed.acquisition },
            retention: { ...baseState.retention, ...parsed.retention }
          });
        } catch {
          setState(baseState);
        }
      } else {
        setState(baseState);
      }

      setLoading(false);
    };

    load();
  }, []);

  /* ================= LIVE CALC ================= */

  useEffect(() => {
    if (!state) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

    axios
      .post(
        "https://sim-quick-commerce-backend.onrender.com/api/step-eight/calculate",
        state
      )
      .then(res => setImpact(res.data))
      .catch(() => {});
  }, [state]);

  /* ================= SAVE ================= */

  const handleSave = async () => {
    setSaving(true);

    await axios.post(
      "https://sim-quick-commerce-backend.onrender.com/api/step-eight/save",
      {
        userId: localStorage.getItem("userId"),
        simulationId: localStorage.getItem("simulationId"),
        roundNumber: round,
        ...state
      }
    );

    onComplete({ ...state, impact });
    setSaving(false);
  };

  if (loading || !config || !state) {
    return <div className="p-6">Loading Marketing Setup...</div>;
  }

  /* ================= UI ================= */

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

      {/* LEFT */}
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-2xl font-bold">Marketing & Growth</h2>

        <Section title="Customer Acquisition">

          <BudgetOption
            label="Google Ads"
            desc="Search advertising"
            data={state.acquisition.googleAds}
            min={config.acquisition.googleAds.minBudget}
            max={config.acquisition.googleAds.maxBudget}
            onToggle={() => toggle(state, setState, "acquisition", "googleAds")}
            onChange={(v:number)=>update(state,setState,"acquisition","googleAds","budget",v)}
          />

          <BudgetOption
            label="Facebook & Instagram"
            desc="Targeted social ads"
            data={state.acquisition.facebookAds}
            min={config.acquisition.facebookAds.minBudget}
            max={config.acquisition.facebookAds.maxBudget}
            onToggle={() => toggle(state, setState, "acquisition", "facebookAds")}
            onChange={(v:number)=>update(state,setState,"acquisition","facebookAds","budget",v)}
          />

          <PercentOption
            label="First Order Discount"
            desc="Critical conversion driver"
            data={state.acquisition.firstOrderDiscount}
            min={config.acquisition.firstOrderDiscount.minPercent}
            max={config.acquisition.firstOrderDiscount.maxPercent}
            onToggle={() => toggle(state, setState, "acquisition", "firstOrderDiscount")}
            onChange={(v:number)=>update(state,setState,"acquisition","firstOrderDiscount","percent",v)}
          />
        </Section>

        <Section title="Retention">
          <Checkbox
            label="Push Notifications"
            checked={!!state.retention.pushNotifications?.enabled}
            onToggle={() => toggle(state, setState, "retention", "pushNotifications")}
          />

          {  (
            <Checkbox
              label="Loyalty Program"
              checked={!!state.retention.loyaltyProgram?.enabled}
              onToggle={() => toggle(state, setState, "retention", "loyaltyProgram")}
            />
          )}
        </Section>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-blue-600 text-white py-3 rounded-xl"
        >
          {saving ? "Saving..." : "Save Marketing Strategy"}
        </button>
      </div>

      {/* RIGHT */}
      {impact && <ImpactCard impact={impact} />}
    </div>
  );
}

/* ================= HELPERS ================= */

function toggle(state:any,set:any,section:string,key:string){
  set({
    ...state,
    [section]: {
      ...state[section],
      [key]: { enabled: !state[section]?.[key]?.enabled }
    }
  });
}

function update(state:any,set:any,section:string,key:string,field:string,value:number){
  set({
    ...state,
    [section]: {
      ...state[section],
      [key]: { ...state[section][key], [field]: value }
    }
  });
}

/* ================= UI COMPONENTS ================= */

function Section({ title, children }: any) {
  return (
    <div className="bg-white border rounded-2xl p-5 space-y-4">
      <h3 className="font-semibold text-lg">{title}</h3>
      {children}
    </div>
  );
}

function BudgetOption({ label, desc, data, min, max, onToggle, onChange }: any) {
  return (
    <div className="border rounded-xl p-4">
      <label className="flex gap-3">
        <input type="checkbox" checked={!!data?.enabled} onChange={onToggle} />
        <span className="font-medium">{label}</span>
      </label>
      <p className="text-sm text-slate-600">{desc}</p>

      {data?.enabled && (
        <input
          type="number"
          min={min}
          max={max}
          value={data.budget}
          onChange={(e) => onChange(+e.target.value)}
          className="mt-2 w-full border rounded-lg px-3 py-2"
        />
      )}
    </div>
  );
}

function PercentOption({ label, desc, data, min, max, onToggle, onChange }: any) {
  return (
    <div className="border rounded-xl p-4">
      <label className="flex gap-3">
        <input type="checkbox" checked={!!data?.enabled} onChange={onToggle} />
        <span className="font-medium">{label}</span>
      </label>
      <p className="text-sm text-slate-600">{desc}</p>

      {data?.enabled && (
        <input
          type="number"
          min={min}
          max={max}
          value={data.percent}
          onChange={(e) => onChange(+e.target.value)}
          className="mt-2 w-full border rounded-lg px-3 py-2"
        />
      )}
    </div>
  );
}

function Checkbox({ label, checked, onToggle }: any) {
  return (
    <label className="flex gap-3 p-4 border rounded-xl cursor-pointer">
      <input type="checkbox" checked={checked} onChange={onToggle} />
      <span className="font-medium">{label}</span>
    </label>
  );
}

function ImpactCard({ impact }: any) {
  return (
    <div className="sticky top-6 bg-green-50 border rounded-2xl p-6">
      <h4 className="font-semibold mb-3">Impact Summary</h4>
      <p className="text-2xl font-bold mb-4">
        ₹{(impact.totalCost / 100000).toFixed(2)} L / month
      </p>
    </div>
  );
}
