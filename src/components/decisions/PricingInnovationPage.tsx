/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";

import QualitySelector from "../QualitySelector";
import RDInvestmentSlider from "../RDInvestmentSlider";
import FeatureCatalog from "../FeatureCatalog";
import PriceSliders from "../PriceSliders";

export default function PricingInnovationPage({ round, onComplete }: any) {
  const [config, setConfig] = useState<any>(null);
  const [features, setFeatures] = useState<any[]>([]);

  const [qualityLevel, setQualityLevel] = useState(3);
  const [rdInvestment, setRdInvestment] = useState(0);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [prices, setPrices] = useState<any>({});
  const [marginMultiplier, setMarginMultiplier] = useState(2.5);
  const [saving, setSaving] = useState(false);

  /* ================= LOAD CONFIG ================= */
  useEffect(() => {
    axios
      .get("https://sim-quick-commerce-backend.onrender.com/api/pricing/config")
      .then((res) => {
        const cfg = res.data.config;
        const mm = cfg?.marginMultiplier ?? 2.5;

        setConfig(cfg);
        setFeatures(res.data.features);
        setMarginMultiplier(mm);

        // initialize prices using margin multiplier
        if (cfg?.basePrices) {
          const initialPrices = Object.fromEntries(
            Object.entries(cfg.basePrices).map(([k, v]: [string, any]) => [
              k,
              Math.round((v as number) * mm)
            ])
          );
          setPrices(initialPrices);
        }
      });
  }, []);

  /* ================= CALCULATE ================= */
  useEffect(() => {
    if (!config) return;

    axios
      .post(
        "https://sim-quick-commerce-backend.onrender.com/api/pricing/calculate",
        {
          qualityLevel,
          selectedFeatures,
          prices,
          marginMultiplier
        }
      )
      .catch(() => {});
  }, [config, qualityLevel, selectedFeatures, prices, marginMultiplier]);

  /* ================= SAVE ================= */
  const handleSave = async () => {
    setSaving(true);

    await axios.post(
      "https://sim-quick-commerce-backend.onrender.com/api/pricing/save",
      {
        userId: localStorage.getItem("userId"),
        simulationId: localStorage.getItem("simulationId"),
        round,
        qualityLevel,
        rdInvestment,
        selectedFeatures,
        prices,
        marginMultiplier
      }
    );

    setSaving(false);
    onComplete();
  };

  if (!config) return <div>Loading Pricing & Innovation...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* LEFT */}
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-3xl font-bold">Pricing & Innovation</h2>

        <QualitySelector
          value={qualityLevel}
          maxAllowed={7}
          onChange={setQualityLevel}
          config={config}
        />

        <RDInvestmentSlider
          value={rdInvestment}
          onChange={setRdInvestment}
        />

        <FeatureCatalog
          features={features}
          selected={selectedFeatures}
          budget={rdInvestment}
          onToggle={(key: string) =>
            setSelectedFeatures((p) =>
              p.includes(key) ? p.filter((k) => k !== key) : [...p, key]
            )
          }
        />

        <PriceSliders
          prices={prices}
          basePrices={config?.basePrices}
          marginMultiplier={marginMultiplier}
          onMarginChange={setMarginMultiplier}
          onChange={(cat: string, value: number) =>
            setPrices((p: any) => ({ ...p, [cat]: value }))
          }
        />

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold"
        >
          {saving ? "Saving..." : "Save Pricing Strategy"}
        </button>
      </div>

      {/* RIGHT */}
    </div>
  );
}