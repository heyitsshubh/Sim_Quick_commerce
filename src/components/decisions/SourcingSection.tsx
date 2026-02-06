/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";

export default function SourcingSection({ round, onComplete }: any) {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(
    localStorage.getItem("selectedSupplierId")
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("https://sim-quick-commerce-backend.onrender.com/api/suppliers")
      .then(res => setSuppliers(res.data))
      .catch(() => setError("Failed to load suppliers"));
  }, []);

  const selectSupplier = (supplierId: string) => {
    setSelectedSupplierId(supplierId);
    localStorage.setItem("selectedSupplierId", supplierId);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      await axios.post(
        "https://sim-quick-commerce-backend.onrender.com/api/selection/save",
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


  return (
    <div className="grid grid-cols-1 gap-4 md:gap-8 px-4 md:px-0">
      <div className="space-y-4 md:space-y-6">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">Sourcing & Supplier Selection</h2>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <Section title="Choose Supplier (Select One)">
     {suppliers.map((s) => {
  const selected = selectedSupplierId === s._id;

  return (
    <div
      key={s._id}
      onClick={() => selectSupplier(s._id)}
      className={`border rounded-xl md:rounded-2xl p-4 md:p-6 cursor-pointer transition
        ${
          selected
            ? "bg-emerald-50 border-emerald-400 ring-2 ring-emerald-200"
            : "bg-white border-slate-200 hover:border-emerald-300"
        }
      `}
    >
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">  
        <div className="flex flex-row md:flex-col items-center gap-3 md:gap-0 md:w-44 md:shrink-0 w-full">
          <input
            type="radio"
            name="supplier"
            checked={selected}
            readOnly
            className="md:mb-3 accent-emerald-600 shrink-0"
          />

          <img
            src={s.logoUrl}
            alt={s.name}
            className="w-12 h-12 md:w-20 md:h-20 object-contain md:mb-3 shrink-0"
          />

          <h4 className="md:text-center font-bold text-sm md:text-base leading-tight flex-1 md:flex-none">
            {s.name}
          </h4>
          {selected && (
            <span className="md:hidden text-xs px-2 py-1 rounded-full bg-emerald-600 text-white">✓</span>
          )}
        </div>
        <div className="flex-1 space-y-2 md:space-y-3 text-xs md:text-sm w-full">
          <DetailRow
            label="Costs for distribution"
            value={`₹${Number(s.costPerUnit).toLocaleString()} / unit`}
          />
          <DetailRow
            label="Delivery time"
            value={`${s.deliveryTimeWeeks} weeks`}
          />
          <DetailRow
            label="Turnover bonus"
            value={`${s.turnoverBonusPercent}%`}
          />
          <DetailRow
            label="Bonus rewarded after turnover"
            value={`₹${(s.bonusAfterTurnover / 1_000_000).toFixed(2)} Cr`}
          />
          <DetailRow
            label="Reliability"
            value={<StarMeter score={s.reliabilityRating} />}
          />
          <DetailRow
            label="Sustainability"
            value={<StarMeter score={s.sustainabilityRating} />}
          />
        </div>
      </div>
    </div>
  );
})}

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

function Section({ title, children }: any) {
  return (
    <div className="bg-white border rounded-xl md:rounded-2xl p-4 md:p-5 space-y-3 md:space-y-4">
      <h3 className="font-semibold text-base md:text-lg">{title}</h3>
      {children}
    </div>
  );
}

function DetailRow({ label, value }: any) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 pb-2 gap-2">
      <span className="text-slate-600 text-left flex-1">{label}</span>
      <span className="font-semibold text-slate-900 text-right">{value}</span>
    </div>
  );
}

function StarMeter({ score }: any) {
  const stars = Math.round(Number(score) || 0);
  return (
    <span className="text-yellow-500">
      {"★".repeat(stars)}
      {"☆".repeat(5 - stars)}
    </span>
  );
}
