/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import axios from 'axios';

interface DeliverySectionProps {
  round: number;
  onComplete: (data: any) => void;
}

export default function DeliverySection({ round, onComplete }: DeliverySectionProps) {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // DELIVERY FLEET
  const [ownFleet, setOwnFleet] = useState(false);
  const [thirdParty, setThirdParty] = useState(false);
  const [riderCount, setRiderCount] = useState(50);
  const [bikeCount, setBikeCount] = useState(50);
  const [electricPercent, setElectricPercent] = useState(0);

  // LOGISTICS OPTIMIZATION
  const [routeOptimization, setRouteOptimization] = useState(false);
  const [realTimeTracking, setRealTimeTracking] = useState(false);
  const [batchingAlgorithm, setBatchingAlgorithm] = useState(false);
  const [hyperlocalWarehousing, setHyperlocalWarehousing] = useState(false);

  // 🔹 Fetch master config
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await axios.get(
          'https://sim-quick-commerce-backend.onrender.com/api/delivery-config'
        );
        setConfig(res.data);

        setRiderCount(res.data.ownFleet.riders.min);
        setBikeCount(res.data.ownFleet.bikes.min);
      } catch {
        setError('Failed to load delivery configuration');
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  // 🔹 Save to backend
  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError(null);

      const payload = {
        userId: localStorage.getItem('userId'),
        simulationId: localStorage.getItem('simulationId'),
        roundNumber: round,

        deliveryFleet: {
          ownFleet,
          ridersPerCity: ownFleet ? riderCount : 0,
          bikesPerCity: ownFleet ? bikeCount : 0,
          electricBikes: {
            enabled: ownFleet && electricPercent > 0,
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
        'https://sim-quick-commerce-backend.onrender.com/api/step-four/save',
        payload
      );

      onComplete(payload);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save delivery setup');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading delivery setup...</div>;
  if (!config) return <div className="text-red-600">Delivery config not found</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">
        Delivery Fleet & Logistics
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* ================= DELIVERY FLEET ================= */}

      <label className="flex items-center gap-3 p-4 border-2 rounded-xl mb-4">
        <input
          type="checkbox"
          checked={ownFleet}
          onChange={(e) => setOwnFleet(e.target.checked)}
        />
        <div>
          <div className="font-semibold">Own Delivery Fleet</div>
          <div className="text-sm text-slate-600">
            In-house riders for control & quality
          </div>
        </div>
      </label>

      {ownFleet && (
        <div className="bg-slate-50 p-4 rounded-xl space-y-4 mb-6">
          {/* RIDERS */}
          <div>
            <label className="text-sm font-medium">Riders per City</label>
            <input
              type="range"
              min={config.ownFleet.riders.min}
              max={config.ownFleet.riders.max}
              step={50}
              value={riderCount}
              onChange={(e) => setRiderCount(+e.target.value)}
              className="w-full"
            />
            <div className="text-sm text-slate-600">{riderCount} riders</div>
          </div>

          {/* BIKES */}
          <div>
            <label className="text-sm font-medium">Bikes per City</label>
            <input
              type="range"
              min={config.ownFleet.bikes.min}
              max={config.ownFleet.bikes.max}
              step={50}
              value={bikeCount}
              onChange={(e) => setBikeCount(+e.target.value)}
              className="w-full"
            />
            <div className="text-sm text-slate-600">{bikeCount} bikes</div>
          </div>

          {/* ELECTRIC BIKES — ALWAYS VISIBLE */}
          <div>
            <label className="text-sm font-medium">
              Electric Bikes (% of fleet)
            </label>
            <input
              type="range"
              min={0}
              max={100}
              step={10}
              value={electricPercent}
              onChange={(e) => setElectricPercent(+e.target.value)}
              className="w-full"
            />
            <div className="text-sm text-slate-600">
              {electricPercent}% electric bikes
            </div>
          </div>
        </div>
      )}

      <label className="flex items-center gap-3 p-4 border-2 rounded-xl mb-8">
        <input
          type="checkbox"
          checked={thirdParty}
          onChange={(e) => setThirdParty(e.target.checked)}
        />
        <div>
          <div className="font-semibold">Third-Party Delivery</div>
          <div className="text-sm text-slate-600">
            Gig workers for flexible capacity
          </div>
        </div>
      </label>

      {/* ================= LOGISTICS OPTIMIZATION ================= */}

      <h3 className="text-xl font-semibold mb-4">Logistics Optimization</h3>

      <div className="space-y-3 mb-6">
        <Checkbox label="Route Optimization Software" checked={routeOptimization} set={setRouteOptimization} />
        <Checkbox label="Real-Time Tracking" checked={realTimeTracking} set={setRealTimeTracking} />
        <Checkbox label="Delivery Batching Algorithm" checked={batchingAlgorithm} set={setBatchingAlgorithm} />
        <Checkbox label="Hyperlocal Warehousing" checked={hyperlocalWarehousing} set={setHyperlocalWarehousing} />
      </div>

      {/* SAVE */}
      <button
        onClick={handleSubmit}
        disabled={saving || (!ownFleet && !thirdParty)}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold px-6 py-3 rounded-xl"
      >
        {saving ? 'Saving...' : 'Save Delivery Setup'}
      </button>
    </div>
  );
}

/* ---------- SMALL HELPER COMPONENT ---------- */

function Checkbox({
  label,
  checked,
  set
}: {
  label: string;
  checked: boolean;
  set: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => set(e.target.checked)}
      />
      <span className="font-medium">{label}</span>
    </label>
  );
}
