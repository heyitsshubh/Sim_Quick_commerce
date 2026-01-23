/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";

export default function SourcingSection({ round, onComplete }: any) {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(
    localStorage.getItem("selectedSupplierId")
  );

  // const [impact, setImpact] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ================= LOAD SUPPLIERS ================= */

  useEffect(() => {
    axios
      .get("https://sim-quick-commerce-backend.onrender.com/api/suppliers")
      .then(res => setSuppliers(res.data))
      .catch(() => setError("Failed to load suppliers"));
  }, []);

  /* ================= CALCULATE IMPACT ================= */

  useEffect(() => {
    if (!selectedSupplierId) return;

    localStorage.setItem("selectedSupplierId", selectedSupplierId);

    axios
      .post(
        "https://sim-quick-commerce-backend.onrender.com/api/step-six/calculate",
        { supplierId: selectedSupplierId }
      )
      // .then(res => setImpact(res.data))
      .catch(() => {});
  }, [selectedSupplierId]);

  /* ================= SELECT SUPPLIER ================= */

  const selectSupplier = async (supplierId: string) => {
    setSelectedSupplierId(supplierId);

    await axios.post(
      "https://sim-quick-commerce-backend.onrender.com/api/selection/select",
      {
        userId: localStorage.getItem("userId"),
        supplierId
      }
    );
  };

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
          supplierId: selectedSupplierId
        }
      );

      onComplete({ supplierId: selectedSupplierId });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="grid grid-cols-1 gap-8">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Sourcing & Supplier Selection</h2>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* ================= SUPPLIERS ================= */}

        <Section title="Choose Supplier (Select One)">
          {suppliers.map(s => (
            <div
              key={s._id}
              onClick={() => selectSupplier(s._id)}
              className={`border rounded-xl p-4 flex items-start gap-4 cursor-pointer transition shadow-sm
                ${
                  selectedSupplierId === s._id
                    ? "border-green-500 bg-green-50 ring-1 ring-green-300"
                    : "hover:border-slate-400"
                }
              `}
            >
              <input
                type="radio"
                name="supplier"
                aria-label={`Select ${s.name}`}
                checked={selectedSupplierId === s._id}
                readOnly
                className="mt-2"
              />

              <img
                src={s.logoUrl}
                alt={s.name}
                className="w-14 h-14 rounded-md border"
              />

              <div className="flex-1 text-sm">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-900">{s.name}</h4>
                  {selectedSupplierId === s._id && (
                    <span className="text-xs px-2 py-1 rounded-full bg-green-600 text-white">Selected</span>
                  )}
                </div>

                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div className="bg-slate-50 rounded-lg px-3 py-2">
                    <div className="text-xs text-slate-500">Cost / Unit</div>
                    <div className="font-semibold">₹{Number(s.costPerUnit).toLocaleString()}</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg px-3 py-2">
                    <div className="text-xs text-slate-500">Delivery</div>
                    <div className="font-semibold">{s.deliveryTimeWeeks} weeks</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg px-3 py-2">
                    <div className="text-xs text-slate-500">Turnover Bonus</div>
                    <div className="font-semibold">{s.turnoverBonusPercent}%</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg px-3 py-2">
                    <div className="text-xs text-slate-500">Bonus After</div>
                    <div className="font-semibold">₹{(s.bonusAfterTurnover / 100000).toFixed(1)} L</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg px-3 py-2">
                    <div className="text-xs text-slate-500">Reliability</div>
                    <div className="font-semibold">⭐ {s.reliabilityRating}/5</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg px-3 py-2">
                    <div className="text-xs text-slate-500">Sustainability</div>
                    <div className="font-semibold">🌱 {s.sustainabilityRating}/5</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Section>

        <button
          onClick={handleSave}
          disabled={!selectedSupplierId || saving}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold py-3 rounded-xl"
        >
          {saving ? "Saving..." : "Save Supplier Choice"}
        </button>
      </div>
    </div>
  );
}

/* ================= REUSABLE ================= */

function Section({ title, children }: any) {
  return (
    <div className="bg-white border rounded-2xl p-5 space-y-4">
      <h3 className="font-semibold text-lg">{title}</h3>
      {children}
    </div>
  );
}
