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

  const computeTotalCost = (s: any, cfg: any) => {
    if (!s) return 0;
    const sumSection = (sectionName: 'acquisition'|'retention'|'partnerships') =>
      Object.entries(s[sectionName] || {}).reduce((acc: number, [key, item]: any) => {
        if (!item?.enabled) return acc;
        if (typeof item?.budget === 'number') {
          console.log(`Adding ${sectionName}.${key} budget:`, item.budget);
          return acc + item.budget;
        }
        const conf = cfg?.[sectionName]?.[key] || {};
        if (typeof conf.cost === 'number') {
          console.log(`Adding ${sectionName}.${key} cost:`, conf.cost);
          return acc + conf.cost;
        }
        return acc;
      }, 0);
    const total = sumSection('acquisition') + sumSection('retention') + sumSection('partnerships');
    console.log("Total cost computed:", total);
    return total;
  };

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get(
          "https://sim-quick-commerce-backend.onrender.com/api/marketing-config"
        );

        console.log("Raw API response:", data);
        const organizedConfig = {
          acquisition: {
            googleAds: data.marketing?.googleAds,
            facebookAds: data.marketing?.facebookAds,
            referralProgram: data.marketing?.referralProgram,
            firstOrderDiscount: data.marketing?.firstOrderDiscount,
            influencerMarketing: data.marketing?.influencerMarketing,
          },
          retention: {
            pushNotifications: data.marketing?.pushNotifications,
            loyaltyProgram: data.marketing?.loyaltyProgram,
            emailAndSMS: data.marketing?.emailAndSMS,
            cashbackOption: data.marketing?.cashbackOption,
          },
          partnerships: {
            creditCardOffers: data.marketing?.creditCardOffers,
            corporateTieUps: data.marketing?.corporateTieUps,
            housingSociety: data.marketing?.housingSociety,
          },
        };

        console.log("Organized config:", organizedConfig);

        setConfig(organizedConfig);
        const buildSectionDefaults = (sectionConfig: any) => {
          const defaults: any = {};
          Object.entries(sectionConfig || {}).forEach(([key, val]: any) => {
            if (!val) return; 
            if (val.minBudget !== undefined) {
              defaults[key] = { enabled: false, budget: val.minBudget };
            } else if (val.minPercent !== undefined) {
              defaults[key] = { enabled: false, percent: val.minPercent };
            } else if (val.minCost !== undefined) {
              defaults[key] = { enabled: false, cost: val.minCost };
            } else {
              defaults[key] = { enabled: false };
            }
          });
          return defaults;
        };

        const baseState = {
          acquisition: buildSectionDefaults(organizedConfig.acquisition),
          retention: buildSectionDefaults(organizedConfig.retention),
          partnerships: buildSectionDefaults(organizedConfig.partnerships),
        };

        console.log("Base state:", baseState);

        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            const mergeSection = (sectionName: 'acquisition'|'retention'|'partnerships') => {
              const base = baseState[sectionName];
              const saved = parsed[sectionName] || {};
              const merged: any = {};
              Object.keys(base).forEach(key => {
                merged[key] = saved[key] ? { ...base[key], ...saved[key] } : base[key];
              });
              return merged;
            };
            
            setState({
              acquisition: mergeSection('acquisition'),
              retention: mergeSection('retention'),
              partnerships: mergeSection('partnerships'),
            });
          } catch {
            setState(baseState);
          }
        } else {
          setState(baseState);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading marketing config:", error);
        setLoading(false);
      }
    };

    load();
  }, []);

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 px-4 md:px-0">
      <div className="lg:col-span-2 space-y-4 md:space-y-6">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">Marketing & Growth</h2>

        <Section title="Customer Acquisition">
          {Object.entries(config.acquisition).map(([key, val]: any) => {
            const dataObj = state.acquisition[key];
            const labelMap: any = {
              googleAds: "Google Ads",
              facebookAds: "Instagram Ads",
              influencerMarketing: "Influencer Marketing",
              referralProgram: "Referral Program",
              firstOrderDiscount: "First Order Discount",
            };
            const descMap: any = {
              googleAds: "Search advertising",
              facebookAds: "Visual social ads",
              influencerMarketing: "Creators and influencers",
              referralProgram: "Invite friends and earn",
              firstOrderDiscount: "Critical conversion driver",
            };

            const isSlider = (key === "googleAds" || key === "facebookAds") || val.minBudget !== undefined;
            
            if (isSlider) {
              const minBudget = val.minBudget ?? 10000;
              const maxBudget = val.maxBudget ?? 500000;
              return (
                <BudgetOption
                  key={key}
                  label={labelMap[key] || key}
                  desc={descMap[key] || ""}
                  data={dataObj}
                  min={minBudget}
                  max={maxBudget}
                  cost={val.cost}
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
                cost={val.cost}
                onToggle={() => {
                  const current = state.acquisition[key] || {};
                  setState({
                    ...state,
                    acquisition: {
                      ...state.acquisition,
                      [key]: { ...current, enabled: !current.enabled }
                    }
                  });
                }}
              />
            );
          })}
        </Section>

        <Section title="Retention">
          {Object.entries(config.retention).map(([key, val]: any) => {
            const dataObj = state.retention[key];
            const labelMap: any = {
              pushNotifications: "Push Notifications",
              loyaltyProgram: "Loyalty Program",
              emailAndSMS: "Email & SMS",
              cashbackOption: "Cashback Option",
            };
            return (
              <Checkbox
                key={key}
                label={labelMap[key] || key}
                checked={!!dataObj?.enabled}
                cost={val.cost}
                onToggle={() => {
                  const current = state.retention[key] || {};
                  setState({
                    ...state,
                    retention: {
                      ...state.retention,
                      [key]: { ...current, enabled: !current.enabled }
                    }
                  });
                }}
              />
            );
          })}
        </Section>

        <Section title="Partnerships">
          {Object.entries(config.partnerships || {}).map(([key, val]: any) => {
            const dataObj = state.partnerships[key];
            const labelMap: any = {
              creditCardOffers: "Credit Card Offers",
              corporateTieUps: "Corporate Tie-ups",
              housingSociety: "Housing Society",
            };

            return (
              <Checkbox
                key={key}
                label={labelMap[key] || key}
                checked={!!dataObj?.enabled}
                cost={val.cost}
                onToggle={() => {
                  const current = state.partnerships[key] || {};
                  setState({
                    ...state,
                    partnerships: {
                      ...state.partnerships,
                      [key]: { ...current, enabled: !current.enabled }
                    }
                  });
                }}
              />
            );
          })}
        </Section>

        <button
          onClick={handleSave}
          disabled={saving}
className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold py-3 rounded-xl"
        >
          {saving ? "Saving..." : "Save Marketing Strategy"}
        </button>
      </div>
      <div className="space-y-6 sticky top-6 h-fit">
        <ImpactCard impact={impact} fallbackTotalCost={computeTotalCost(state, config)} />
      </div>
    </div>
  );
}

function toggle(state:any,set:any,section:string,key:string){
  const current = state[section]?.[key] || { enabled: false };
  const updated = {
    ...state,
    [section]: {
      ...state[section],
      [key]: {
        ...current,
        enabled: !current.enabled
      }
    }
  };
  set(updated);
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

function Section({ title, children }: any) {
  return (
    <div className="bg-white border rounded-xl md:rounded-2xl p-4 md:p-5 space-y-3 md:space-y-4 shadow-sm">
      <h3 className="font-semibold text-base md:text-lg">{title}</h3>
      {children}
    </div>
  );
}

function BudgetOption({ label, desc, data, min, max, cost, onToggle, onChange }: any) {
  const minValue = min ?? 0;
  const maxValue = max ?? minValue;
  const value = data?.budget ?? minValue;
  const costValue = cost ?? 0;

  return (
    <div className="border rounded-xl p-4 bg-gradient-to-br from-white to-slate-50 space-y-2">
      <label className="flex gap-3 items-center">
        <input type="checkbox" checked={!!data?.enabled} onChange={onToggle} />
        <span className="font-medium">{label}</span>
      </label>

      <p className="text-xs text-slate-600">{desc}</p>

      <div className="text-sm font-semibold text-slate-800">
        Cost: ₹{(costValue / 100000).toFixed(2)} L
      </div>
      {data?.enabled && (
        <div className="mt-2 space-y-1">
          <input
            type="range"
            min={minValue}
            max={maxValue}
            step={Math.max(1, Math.floor((maxValue - minValue) / 20))}
            value={value}
            onChange={(e) => onChange(+e.target.value)}
            className="w-full accent-blue-600"
          />

          <div className="text-xs text-slate-600 flex justify-between">
            <span>₹{minValue.toLocaleString()}</span>
            <span>₹{value.toLocaleString()}</span>
            <span>₹{maxValue.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function Checkbox({ label, checked, cost, onToggle }: any) {
  const costValue = cost ?? 0;
  return (
    <label className="flex gap-3 p-4 border rounded-xl cursor-pointer bg-gradient-to-br from-white to-slate-50 flex-col">
      <div className="flex gap-3">
        <input type="checkbox" checked={checked} onChange={onToggle} />
        <span className="font-medium">{label}</span>
      </div>
      <div className="text-sm font-semibold text-slate-800">
        Cost: ₹{(costValue / 100000).toFixed(2)} L
      </div>
    </label>
  );
}

function ImpactCard({ impact, fallbackTotalCost }: any) {
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
        {(() => {
          const total = (fallbackTotalCost && fallbackTotalCost > 0)
            ? fallbackTotalCost
            : (impact?.totalCost ?? 0);
          return `₹${(total / 100000).toFixed(2)} L / month`;
        })()}
      </div>
    </div>
  );
}