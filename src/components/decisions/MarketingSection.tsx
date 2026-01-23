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

      // Build defaults dynamically from API config
      const buildSectionDefaults = (sectionConfig: any) => {
        const defaults: any = {};
        Object.entries(sectionConfig || {}).forEach(([key, val]: any) => {
          if (val.minBudget !== undefined) {
            defaults[key] = { enabled: false, budget: val.minBudget };
          } else if (val.minPercent !== undefined) {
            // Keep discount enabled by default if percent-based
            defaults[key] = { enabled: true, percent: val.minPercent };
          } else if (val.minCost !== undefined) {
            defaults[key] = { enabled: false, cost: val.minCost };
          } else {
            // Simple toggle-only option (e.g., setupCost or revenueBoost)
            defaults[key] = { enabled: false };
          }
        });
        return defaults;
      };

      const baseState = {
        acquisition: buildSectionDefaults(data.acquisition),
        retention: buildSectionDefaults(data.retention),
        partnerships: buildSectionDefaults(data.partnerships),
      };

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setState({
            ...baseState,
            ...parsed,
            acquisition: { ...baseState.acquisition, ...(parsed.acquisition || {}) },
            retention: { ...baseState.retention, ...(parsed.retention || {}) },
            partnerships: { ...baseState.partnerships, ...(parsed.partnerships || {}) },
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 px-4 md:px-0">

      {/* LEFT */}
      <div className="lg:col-span-2 space-y-4 md:space-y-6">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">Marketing & Growth</h2>

        <Section title="Customer Acquisition">
          {Object.entries(config.acquisition).map(([key, val]: any) => {
            const dataObj = state.acquisition[key];
            const sliderKeys = new Set(["googleAds", "facebookAds"]);
            const labelMap: any = {
              googleAds: "Google Ads",
              facebookAds: "Facebook & Instagram",
              influencerMarketing: "Influencer Marketing",
              referralProgram: "Referral Program",
              firstOrderDiscount: "First Order Discount",
            };
            const descMap: any = {
              googleAds: "Search advertising",
              facebookAds: "Targeted social ads",
              influencerMarketing: "Creators and influencers",
              referralProgram: "Invite friends and earn",
              firstOrderDiscount: "Critical conversion driver",
            };

            if (sliderKeys.has(key) && val.minBudget !== undefined) {
              return (
                <BudgetOption
                  key={key}
                  label={labelMap[key] || key}
                  desc={descMap[key] || ""}
                  data={dataObj}
                  min={val.minBudget}
                  max={val.maxBudget}
                  onToggle={() => toggle(state, setState, "acquisition", key)}
                  onChange={(v:number)=>update(state,setState,"acquisition",key,"budget",v)}
                />
              );
            }

            return (
              <Checkbox
                key={key}
                label={labelMap[key] || key}
                checked={!!dataObj?.enabled}
                onToggle={() => toggle(state, setState, "acquisition", key)}
              />
            );
          })}
        </Section>

        <Section title="Retention">
          {Object.entries(config.retention).map(([key, val]: any) => {
            const dataObj = state.retention[key];
            const sliderBlocked = new Set(["emailSms", "cashbackCoupons"]);
            const labelMap: any = {
              pushNotifications: "Push Notifications",
              loyaltyProgram: "Loyalty Program",
              emailSms: "Email & SMS",
              cashbackCoupons: "Cashback Coupons",
            };
            const descMap: any = {
              pushNotifications: "Re-engage with timely alerts",
              loyaltyProgram: "Reward repeat purchases",
              emailSms: "Lifecycle campaigns",
              cashbackCoupons: "Incentivize repeat orders",
            };

            if (sliderBlocked.has(key)) {
              return (
                <Checkbox
                  key={key}
                  label={labelMap[key] || key}
                  checked={!!dataObj?.enabled}
                  onToggle={() => toggle(state, setState, "retention", key)}
                />
              );
            }

            if (val.minBudget !== undefined) {
              return (
                <BudgetOption
                  key={key}
                  label={labelMap[key] || key}
                  desc={descMap[key] || ""}
                  data={dataObj}
                  min={val.minBudget}
                  max={val.maxBudget}
                  onToggle={() => toggle(state, setState, "retention", key)}
                  onChange={(v:number)=>update(state,setState,"retention",key,"budget",v)}
                />
              );
            }
            if (val.minCost !== undefined) {
              return (
                <CostOption
                  key={key}
                  label={labelMap[key] || key}
                  desc={descMap[key] || ""}
                  data={dataObj}
                  min={val.minCost}
                  max={val.maxCost}
                  onToggle={() => toggle(state, setState, "retention", key)}
                  onChange={(v:number)=>update(state,setState,"retention",key,"cost",v)}
                />
              );
            }
            return (
              <Checkbox
                key={key}
                label={labelMap[key] || key}
                checked={!!dataObj?.enabled}
                onToggle={() => toggle(state, setState, "retention", key)}
              />
            );
          })}
        </Section>

        <Section title="Partnerships">
          {Object.entries(config.partnerships || {}).map(([key, val]: any) => {
            const dataObj = state.partnerships[key];
            const labelMap: any = {
              creditCardOffers: "Credit Card Offers",
              corporateTieups: "Corporate Tie-ups",
              housingSocieties: "Housing Societies",
            };
            const descMap: any = {
              creditCardOffers: "Co-branded discounts",
              corporateTieups: "Bulk corporate partnerships",
              housingSocieties: "Society-level promotions",
            };

            if (key === "housingSocieties") {
              return (
                <Checkbox
                  key={key}
                  label={labelMap[key] || key}
                  checked={!!dataObj?.enabled}
                  onToggle={() => toggle(state, setState, "partnerships", key)}
                />
              );
            }

            if (val.minCost !== undefined) {
              return (
                <CostOption
                  key={key}
                  label={labelMap[key] || key}
                  desc={descMap[key] || ""}
                  data={dataObj}
                  min={val.minCost}
                  max={val.maxCost}
                  onToggle={() => toggle(state, setState, "partnerships", key)}
                  onChange={(v:number)=>update(state,setState,"partnerships",key,"cost",v)}
                />
              );
            }
            return (
              <Checkbox
                key={key}
                label={labelMap[key] || key}
                checked={!!dataObj?.enabled}
                onToggle={() => toggle(state, setState, "partnerships", key)}
              />
            );
          })}
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
      {impact && (
        <div className="hidden lg:block space-y-6 sticky top-6 h-fit">
          <ImpactCard impact={impact} />
        </div>
      )}
    </div>
  );
}

/* ================= HELPERS ================= */

function toggle(state:any,set:any,section:string,key:string){
  const current = state[section]?.[key] || {};
  set({
    ...state,
    [section]: {
      ...state[section],
      [key]: { ...current, enabled: !current.enabled }
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
    <div className="bg-white border rounded-xl md:rounded-2xl p-4 md:p-5 space-y-3 md:space-y-4 shadow-sm">
      <h3 className="font-semibold text-base md:text-lg">{title}</h3>
      {children}
    </div>
  );
}

function BudgetOption({ label, desc, data, min, max, onToggle, onChange }: any) {
  const minValue = min ?? 0;
  const maxValue = max ?? minValue;
  const value = data?.budget ?? minValue;
  return (
    <div className="border rounded-xl p-4 bg-gradient-to-br from-white to-slate-50">
      <label className="flex gap-3">
        <input type="checkbox" checked={!!data?.enabled} onChange={onToggle} />
        <span className="font-medium">{label}</span>
      </label>
      <p className="text-xs md:text-sm text-slate-600">{desc}</p>

      {data?.enabled && (
        <div className="mt-3 space-y-1">
          <input
            type="range"
            min={minValue}
            max={maxValue}
            step={Math.max(1, Math.floor((maxValue - minValue) / 20))}
            value={value}
            onChange={(e) => onChange(+e.target.value)}
            className="w-full accent-blue-600"
          />
          <div className="text-xs text-slate-700 flex justify-between">
            <span>Min: ₹{minValue.toLocaleString()}</span>
            <span>Selected: ₹{value.toLocaleString()}</span>
            <span>Max: ₹{maxValue.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function CostOption({ label, desc, data, min, max, onToggle, onChange }: any) {
  const minValue = min ?? 0;
  const maxValue = max ?? minValue;
  const value = data?.cost ?? minValue;
  return (
    <div className="border rounded-xl p-4 bg-gradient-to-br from-white to-slate-50">
      <label className="flex gap-3">
        <input type="checkbox" checked={!!data?.enabled} onChange={onToggle} />
        <span className="font-medium">{label}</span>
      </label>
      <p className="text-xs md:text-sm text-slate-600">{desc}</p>

      {data?.enabled && (
        <div className="mt-3 space-y-1">
          <input
            type="range"
            min={minValue}
            max={maxValue}
            step={Math.max(1, Math.floor((maxValue - minValue) / 20))}
            value={value}
            onChange={(e) => onChange(+e.target.value)}
            className="w-full accent-blue-600"
          />
          <div className="text-xs text-slate-700 flex justify-between">
            <span>Min: ₹{minValue.toLocaleString()}</span>
            <span>Selected: ₹{value.toLocaleString()}</span>
            <span>Max: ₹{maxValue.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function Checkbox({ label, checked, onToggle }: any) {
  return (
    <label className="flex gap-3 p-4 border rounded-xl cursor-pointer bg-gradient-to-br from-white to-slate-50">
      <input type="checkbox" checked={checked} onChange={onToggle} />
      <span className="font-medium">{label}</span>
    </label>
  );
}

function ImpactCard({ impact }: any) {
  return (
    <div className="rounded-xl md:rounded-2xl border bg-gradient-to-br from-white to-slate-50 p-4 md:p-6 shadow-md">
      <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
        <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-green-100 text-green-700 flex items-center justify-center text-xl md:text-2xl">
          📣
        </div>
        <div>
          <h4 className="font-semibold text-sm md:text-base">Impact Summary</h4>
          <p className="text-xs text-slate-500">Monthly impact</p>
        </div>
      </div>
      <div className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">
        ₹{(impact.totalCost / 100000).toFixed(2)} L / month
      </div>
    </div>
  );
}
