/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";

interface DeliverySectionProps {
  round: number;
  onComplete: (data: any) => void;
}

const STORAGE_KEY = "step4_delivery_state";

export default function DeliverySection({ round, onComplete }: DeliverySectionProps) {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ================= DELIVERY FLEET ================= */
  const [ownFleet, setOwnFleet] = useState(false);
  const [thirdParty, setThirdParty] = useState(false);
  const [riderCount, setRiderCount] = useState(50);
  const [bikeCount, setBikeCount] = useState(50);
  const [electricPercent, setElectricPercent] = useState(0);

  /* ================= LOGISTICS ================= */
  const [routeOptimization, setRouteOptimization] = useState(false);
  const [realTimeTracking, setRealTimeTracking] = useState(false);
  const [batchingAlgorithm, setBatchingAlgorithm] = useState(false);
  const [hyperlocalWarehousing, setHyperlocalWarehousing] = useState(false);

  /* ================= IMPACT ================= */
  const [impact, setImpact] = useState<any>(null);

  /* ================= LOAD CONFIG + RESTORE ================= */
  useEffect(() => {
    const init = async () => {
      try {
        const res = await axios.get(
          "https://sim-quick-commerce-backend.onrender.com/api/delivery-config"
        );
        setConfig(res.data);

        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const s = JSON.parse(saved);
          setOwnFleet(s.ownFleet);
          setThirdParty(s.thirdParty);
          setRiderCount(s.riderCount);
          setBikeCount(s.bikeCount);
          setElectricPercent(s.electricPercent);
          setRouteOptimization(s.routeOptimization);
          setRealTimeTracking(s.realTimeTracking);
          setBatchingAlgorithm(s.batchingAlgorithm);
          setHyperlocalWarehousing(s.hyperlocalWarehousing);
          setImpact(s.impact);
        } else {
          setRiderCount(res.data.ownFleet.riders.min);
          setBikeCount(res.data.ownFleet.bikes.min);
        }
      } catch {
        setError("Failed to load delivery configuration");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  /* ================= LIVE CALCULATION ================= */
  useEffect(() => {
    if (!config) return;

    const calculate = async () => {
      try {
        const res = await axios.post(
          "https://sim-quick-commerce-backend.onrender.com/api/step-four/calculate",
          {
            deliveryFleet: {
              ownFleet,
              ridersPerCity: ownFleet ? riderCount : 0,
              bikesPerCity: ownFleet ? bikeCount : 0,
              electricBikes: {
                enabled: electricPercent > 0,
                percentage: electricPercent
              },
              thirdPartyDelivery: thirdParty
            },
            logisticsOptimization: {
              routeOptimization,
              realTimeTracking,
              batchingAlgorithm,
              hyperlocalWarehousing
            }
          }
        );

        setImpact(res.data);

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            ownFleet,
            thirdParty,
            riderCount,
            bikeCount,
            electricPercent,
            routeOptimization,
            realTimeTracking,
            batchingAlgorithm,
            hyperlocalWarehousing,
            impact: res.data
          })
        );
      } catch {
        // silent
      }
    };

    calculate();
  }, [
    ownFleet,
    thirdParty,
    riderCount,
    bikeCount,
    electricPercent,
    routeOptimization,
    realTimeTracking,
    batchingAlgorithm,
    hyperlocalWarehousing,
    config
  ]);

  /* ================= SAVE ================= */
  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError(null);

      await axios.post(
        "https://sim-quick-commerce-backend.onrender.com/api/step-four/save",
        {
          userId: localStorage.getItem("userId"),
          simulationId: localStorage.getItem("simulationId"),
          roundNumber: round,
          deliveryFleet: {
            ownFleet,
            ridersPerCity: riderCount,
            bikesPerCity: bikeCount,
            electricBikes: {
              enabled: electricPercent > 0,
              percentage: electricPercent
            },
            thirdPartyDelivery: thirdParty
          },
          logisticsOptimization: {
            routeOptimization,
            realTimeTracking,
            batchingAlgorithm,
            hyperlocalWarehousing
          }
        }
      );

      onComplete({ impact });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!config) return <div className="text-red-600">Config not found</div>;

  /* ================= UI ================= */
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* ================= LEFT CONTROLS ================= */}
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-2xl font-bold">Delivery Fleet & Logistics</h2>

        {error && <div className="bg-red-50 p-3 rounded text-red-700">{error}</div>}

        <Checkbox label="Own Delivery Fleet" checked={ownFleet} set={setOwnFleet} />

        {ownFleet && (
          <div className="bg-slate-50 p-4 rounded-xl space-y-4">
            <Range label="Riders per City" value={riderCount} min={50} max={1000} set={setRiderCount} />
            <Range label="Bikes per City" value={bikeCount} min={50} max={1000} set={setBikeCount} />

            <div>
              <label className="text-sm font-medium">Electric Bikes (% of fleet)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={electricPercent}
                onChange={(e) => setElectricPercent(+e.target.value)}
                className="w-full border px-3 py-2 rounded-lg"
              />
            </div>
          </div>
        )}

        <Checkbox label="Third-Party Delivery" checked={thirdParty} set={setThirdParty} />

        <h3 className="text-xl font-semibold">Logistics Optimization</h3>

        <Checkbox label="Route Optimization Software" checked={routeOptimization} set={setRouteOptimization} />
        <Checkbox label="Real-Time Tracking" checked={realTimeTracking} set={setRealTimeTracking} />
        <Checkbox label="Delivery Batching Algorithm" checked={batchingAlgorithm} set={setBatchingAlgorithm} />
        <Checkbox label="Hyperlocal Warehousing" checked={hyperlocalWarehousing} set={setHyperlocalWarehousing} />

        <button
          onClick={handleSubmit}
          disabled={saving || (!ownFleet && !thirdParty)}
          className="w-full bg-blue-600 text-white py-3 rounded-xl"
        >
          {saving ? "Saving..." : "Save Delivery Setup"}
        </button>
      </div>

      {/* ================= RIGHT IMPACT PANEL ================= */}
      <div className="space-y-4">
        {impact?.deliveryFleet && (
          <ImpactCard title="Delivery Fleet Impact" icon="🚚" data={impact.deliveryFleet} />
        )}

        {impact?.thirdPartyDelivery && (
          <ImpactCard title="Third-Party Delivery Impact" icon="🤝" data={impact.thirdPartyDelivery} />
        )}

        {impact?.logisticsOptimization && (
          <ImpactCard title="Logistics Optimization Impact" icon="⚙️" data={impact.logisticsOptimization} />
        )}

        {impact?.totalCost && (
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white shadow-lg">
            <div className="text-sm opacity-90">Total Monthly Cost</div>
            <div className="text-3xl font-bold">
              ₹{(impact.totalCost / 100000).toFixed(2)} L
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= UI COMPONENTS ================= */

function Checkbox({ label, checked, set }: any) {
  return (
    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
      <input type="checkbox" checked={checked} onChange={(e) => set(e.target.checked)} />
      <span className="font-medium">{label}</span>
    </label>
  );
}

function Range({ label, value, min, max, set }: any) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={50}
        value={value}
        onChange={(e) => set(+e.target.value)}
        className="w-full"
      />
      <div className="text-sm text-slate-600">{value}</div>
    </div>
  );
}

/* ================= BEAUTIFUL IMPACT CARD ================= */

function ImpactCard({ title, data, icon }: any) {
  return (
    <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm hover:shadow-lg transition-all">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-green-400 to-emerald-500" />

      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
          {icon}
        </div>
        <h4 className="font-semibold">{title}</h4>
      </div>

      <div className="mb-4">
        <div className="text-xs text-slate-500 uppercase">Monthly Cost</div>
        <div className="text-2xl font-bold">
          ₹{(data.cost / 100000).toFixed(2)} L
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.entries(data.kpis).map(([k, v]: any) => (
          <KpiPill key={k} label={k} value={v} />
        ))}
      </div>
    </div>
  );
}

function KpiPill({ label, value }: any) {
  return (
    <div className="rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs font-semibold">
      +{value}% {label.replace(/([A-Z])/g, " $1")}
    </div>
  );
}
