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

  /* ================= CURRENT COUNTS FROM DB ================= */
  const [currentRiders, setCurrentRiders] = useState(0);
  const [currentBikes, setCurrentBikes] = useState(0);

  /* ================= DELIVERY FLEET ================= */
  const [ownFleet, setOwnFleet] = useState(false);
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
  const [thirdParty, setThirdParty] = useState(false);

  /* ================= LOAD CONFIG + RESTORE + CURRENT COUNTS ================= */
  useEffect(() => {
    const init = async () => {
      try {
        // Load config with current totals
        const configRes = await axios.get(
          "https://sim-quick-commerce-backend.onrender.com/api/delivery-config"
        );
        setConfig(configRes.data);

        // Extract current riders and bikes from the config response
        if (configRes.data.currentTotals) {
          setCurrentRiders(configRes.data.currentTotals.totalRiders || 0);
          setCurrentBikes(configRes.data.currentTotals.totalBikers || 0);
        }

        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const s = JSON.parse(saved);
          setOwnFleet(s.ownFleet);
          setRiderCount(s.riderCount);
          setBikeCount(s.bikeCount);
          setElectricPercent(s.electricPercent);
          setRouteOptimization(s.routeOptimization);
          setRealTimeTracking(s.realTimeTracking);
          setBatchingAlgorithm(s.batchingAlgorithm);
          setHyperlocalWarehousing(s.hyperlocalWarehousing);
          setImpact(s.impact);
        } else {
          setRiderCount(configRes.data.ownFleet.riders.min);
          setBikeCount(configRes.data.ownFleet.bikes.min);
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
              }
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
        setThirdParty(res.data?.thirdPartyDelivery?.isUsed || false);

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            ownFleet,
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
    riderCount,
    bikeCount,
    electricPercent,
    routeOptimization,
    realTimeTracking,
    batchingAlgorithm,
    hyperlocalWarehousing,
    config
  ]);
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
            }
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
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-2xl font-bold">Delivery Fleet & Logistics</h2>

        {error && <div className="bg-red-50 p-3 rounded text-red-700">{error}</div>}

        <Checkbox label="Own Delivery Fleet" checked={ownFleet} set={setOwnFleet} />

        {ownFleet && (
          <div className="bg-slate-50 p-4 rounded-xl space-y-4">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="text-sm font-medium text-blue-900 mb-2">ℹ️ Current Fleet Status (All Players):</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white p-2 rounded">
                  <span className="text-slate-600">Total Riders:</span>
                  <span className="font-bold ml-2 text-blue-600">{currentRiders}</span>
                </div>
                <div className="bg-white p-2 rounded">
                  <span className="text-slate-600">Total Bikes:</span>
                  <span className="font-bold ml-2 text-blue-600">{currentBikes}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Riders per City</label>
                <input
                  type="range"
                  min={-currentRiders}
                  max={1000}
                  step={50}
                  value={riderCount}
                  onChange={(e) => setRiderCount(+e.target.value)}
                  className="w-full"
                />
                <div className="text-sm text-slate-600 font-semibold mt-1">{riderCount}</div>
                <input
                  type="number"
                  value={riderCount}
                  onChange={(e) => setRiderCount(+e.target.value)}
                  min={-currentRiders}
                  max={1000}
                  className="w-full border px-3 py-2 rounded-lg mt-2"
                  placeholder="Enter custom value"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Bikes per City</label>
                <input
                  type="range"
                  min={-currentBikes}
                  max={1000}
                  step={50}
                  value={bikeCount}
                  onChange={(e) => setBikeCount(+e.target.value)}
                  className="w-full"
                />
                <div className="text-sm text-slate-600 font-semibold mt-1">{bikeCount}</div>
                <input
                  type="number"
                  value={bikeCount}
                  onChange={(e) => setBikeCount(+e.target.value)}
                  min={-currentBikes}
                  max={1000}
                  className="w-full border px-3 py-2 rounded-lg mt-2"
                  placeholder="Enter custom value"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Electric Bikes (% of fleet)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={electricPercent}
                onChange={(e) => {
                  const val = +e.target.value;
                  if (val <= 100) {
                    setElectricPercent(val);
                  }
                }}
                className="w-full border px-3 py-2 rounded-lg"
              />
              <div className="mt-2 bg-amber-50 border border-amber-200 p-3 rounded-lg">
                <p className="text-xs md:text-sm text-amber-900 leading-relaxed">
                  ℹ️ One bike can be used by many riders since the riders will be working in 8 hours shift. So technically, a bike can be used by 3 bikers at 8 hour shift each. Also, keep in mind that some bikes may not be available since they might be in servicing. Also, some bikers will leave the organization at the end of the month. You can increase/reduce the bikers easily. But if you are trying to reduce a bike, it will take 2 rounds.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
          <p className="text-sm text-blue-800">
            ℹ️ <strong>Third-Party Delivery:</strong> Will be automatically used if demand exceeds your fleet capacity. No manual selection needed.
          </p>
        </div>

        <h3 className="text-xl font-semibold">Logistics Optimization (Optional)</h3>

        <Checkbox label="Route Optimization Software" checked={routeOptimization} set={setRouteOptimization} />
        <Checkbox label="Real-Time Tracking" checked={realTimeTracking} set={setRealTimeTracking} />
        <Checkbox label="Delivery Batching Algorithm" checked={batchingAlgorithm} set={setBatchingAlgorithm} />
        <Checkbox label="Hyperlocal Warehousing" checked={hyperlocalWarehousing} set={setHyperlocalWarehousing} />

        <button
          onClick={handleSubmit}
          disabled={saving || !ownFleet}
          className="w-full bg-blue-600 text-white py-3 rounded-xl disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          {saving ? "Saving..." : "Save Delivery Setup"}
        </button>
      </div>
      <div className="space-y-4">
        {impact?.deliveryFleet && (
          <ImpactCard title="Delivery Fleet Impact" icon="🚚" data={impact.deliveryFleet} />
        )}

        {thirdParty && impact?.thirdPartyDelivery && (
          <div className="rounded-2xl border bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-xl">
                🤝
              </div>
              <h4 className="font-semibold">Third-Party Delivery (Auto)</h4>
            </div>
            <div className="space-y-2 text-sm text-slate-700">
              <p>
                <strong>Monthly Cost:</strong> ₹{(impact.thirdPartyDelivery.cost / 100000).toFixed(2)} L
              </p>
              <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded">
                ℹ️ Automatically activated because demand exceeds fleet capacity
              </p>
            </div>
          </div>
        )}

        {impact?.logisticsOptimization && (
          <ImpactCard title="Logistics Optimization Impact" icon="⚙️" data={impact.logisticsOptimization} />
        )}

        {impact?.totalCost !== undefined && (
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

function Checkbox({ label, checked, set }: any) {
  return (
    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
      <input type="checkbox" checked={checked} onChange={(e) => set(e.target.checked)} className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </label>
  );
}



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
  const isNegative = value < 0;
  return (
    <div className={`rounded-full px-3 py-1 text-xs font-semibold ${
      isNegative 
        ? 'bg-red-100 text-red-700' 
        : 'bg-green-100 text-green-700'
    }`}>
      {isNegative ? '' : '+'}{value}% {label.replace(/([A-Z])/g, " $1")}
    </div>
  );
}