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

  /* ================= LOAD CONFIG + RESTORE STATE ================= */
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
        // silent fail
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

      const payload = {
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
      };

      await axios.post(
        "https://sim-quick-commerce-backend.onrender.com/api/step-four/save",
        payload
      );

      onComplete(payload);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading delivery setup...</div>;
  if (!config) return <div className="text-red-600">Config not found</div>;

  /* ================= UI ================= */
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Delivery Fleet & Logistics</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">{error}</div>
      )}

      <Checkbox label="Own Delivery Fleet" checked={ownFleet} set={setOwnFleet} />

      {ownFleet && (
        <div className="bg-slate-50 p-4 rounded-xl mt-3 space-y-4">
          <Range label="Riders per City" value={riderCount} min={50} max={1000} set={setRiderCount} />
          <Range label="Bikes per City" value={bikeCount} min={50} max={1000} set={setBikeCount} />

          <div>
            <label className="text-sm font-medium">
              Electric Bikes (% of fleet)
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={electricPercent}
              onChange={(e) => setElectricPercent(+e.target.value)}
              className="w-full border px-3 py-2 rounded-lg"
            />
          </div>

          {impact?.deliveryFleet && (
            <ImpactCard
              title="Delivery Fleet Impact"
              data={impact.deliveryFleet}
            />
          )}
        </div>
      )}

      <Checkbox label="Third-Party Delivery" checked={thirdParty} set={setThirdParty} />

      {impact?.thirdPartyDelivery && (
        <ImpactCard
          title="Third-Party Delivery Impact"
          data={impact.thirdPartyDelivery}
        />
      )}

      <h3 className="text-xl font-semibold mt-6 mb-3">
        Logistics Optimization
      </h3>

      <Checkbox label="Route Optimization Software" checked={routeOptimization} set={setRouteOptimization} />
      <Checkbox label="Real-Time Tracking" checked={realTimeTracking} set={setRealTimeTracking} />
      <Checkbox label="Delivery Batching Algorithm" checked={batchingAlgorithm} set={setBatchingAlgorithm} />
      <Checkbox label="Hyperlocal Warehousing" checked={hyperlocalWarehousing} set={setHyperlocalWarehousing} />

      {impact?.logisticsOptimization && (
        <ImpactCard
          title="Logistics Optimization Impact"
          data={impact.logisticsOptimization}
        />
      )}

      {impact?.totalCost && (
        <div className="mt-6 bg-blue-50 border p-4 rounded-xl">
          <h3 className="font-semibold">Total Monthly Cost</h3>
          <p className="text-lg font-bold">
            ₹{(impact.totalCost / 100000).toFixed(2)} L
          </p>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={saving || (!ownFleet && !thirdParty)}
        className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl"
      >
        {saving ? "Saving..." : "Save Delivery Setup"}
      </button>
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

function Checkbox({ label, checked, set }: any) {
  return (
    <label className="flex items-center gap-3 p-3 border rounded-lg mt-2 cursor-pointer">
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

function ImpactCard({ title, data }: any) {
  return (
    <div className="bg-green-50 border rounded-xl p-4 mt-4">
      <h4 className="font-semibold mb-1">{title}</h4>
      <p className="text-sm mb-2">
        Cost: ₹{(data.cost / 100000).toFixed(2)} L / month
      </p>
      <ul className="text-sm space-y-1">
        {Object.entries(data.kpis).map(([k, v]: any) => (
          <li key={k}>
            {k.charAt(0).toUpperCase() + k.slice(1)} +{v}%
          </li>
        ))}
      </ul>
    </div>
  );
}
