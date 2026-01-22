/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";

const STORAGE_KEY = "step9_operations_state";

interface OperationsSectionProps {
  round: number;
  onComplete: (data: any) => void;
}

export default function OperationsSection({ round, onComplete }: OperationsSectionProps) {
  const [config, setConfig] = useState<any>(null);
  const [impact, setImpact] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const [state, setState] = useState<any>({
    darkStoreStaff: {
      storeManager: 1,
      pickersPackers: 10,
      inventoryStaff: 2,
      qualityCheckers: 1,
      cleaningStaff: 1
    },
    deliveryStaff: {
      deliveryRiders: 50,
      riderSupervisors: 5
    },
    corporateTeam: {
      techTeam: 10,
      marketingTeam: 5,
      customerSupport: 10
    }
  });

  /* ================= LOAD CONFIG + RESTORE ================= */

  useEffect(() => {
    const load = async () => {
      const { data } = await axios.get(
        "https://sim-quick-commerce-backend.onrender.com/api/operations-staffing-config"
      );
      setConfig(data);

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setState(JSON.parse(saved));
    };
    load();
  }, []);

  /* ================= LIVE CALCULATION ================= */

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

    axios
      .post(
        "https://sim-quick-commerce-backend.onrender.com/api/step-nine/calculate",
        state
      )
      .then(res => setImpact(res.data))
      .catch(() => {});
  }, [state]);

  /* ================= SAVE ================= */

  const handleSave = async () => {
    setSaving(true);

    await axios.post(
      "https://sim-quick-commerce-backend.onrender.com/api/step-nine/save",
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

  if (!config) return <div>Loading operations setup...</div>;

  /* ================= UI ================= */

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* LEFT */}
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-2xl font-bold">Operations & Staffing</h2>

        <Section title="Dark Store Staff (Per Store)">
          <Slider label="Store Manager" min={1} max={1}
            value={state.darkStoreStaff.storeManager}
            set={(v: number) =>
              setState((p:any)=>({...p,darkStoreStaff:{...p.darkStoreStaff,storeManager:v}}))
            }
          />
          <Slider label="Pickers / Packers" min={5} max={30}
            value={state.darkStoreStaff.pickersPackers}
            set={(v: number) =>
              setState((p:any)=>({...p,darkStoreStaff:{...p.darkStoreStaff,pickersPackers:v}}))
            }
          />
          <Slider label="Inventory Staff" min={2} max={8}
            value={state.darkStoreStaff.inventoryStaff}
            set={(v: number) =>
              setState((p:any)=>({...p,darkStoreStaff:{...p.darkStoreStaff,inventoryStaff:v}}))
            }
          />
          <Slider label="Quality Checkers" min={1} max={4}
            value={state.darkStoreStaff.qualityCheckers}
            set={(v: number) =>
              setState((p:any)=>({...p,darkStoreStaff:{...p.darkStoreStaff,qualityCheckers:v}}))
            }
          />
          <Slider label="Cleaning / Maintenance" min={1} max={3}
            value={state.darkStoreStaff.cleaningStaff}
            set={(v: number) =>
              setState((p:any)=>({...p,darkStoreStaff:{...p.darkStoreStaff,cleaningStaff:v}}))
            }
          />
        </Section>

        <Section title="Delivery Staff (Per City)">
          <Slider label="Delivery Riders" min={50} max={1000}
            value={state.deliveryStaff.deliveryRiders}
            set={(v: number) =>
              setState((p:any)=>({...p,deliveryStaff:{...p.deliveryStaff,deliveryRiders:v}}))
            }
          />
          <Slider label="Rider Supervisors" min={5} max={50}
            value={state.deliveryStaff.riderSupervisors}
            set={(v: number) =>
              setState((p:any)=>({...p,deliveryStaff:{...p.deliveryStaff,riderSupervisors:v}}))
            }
          />
        </Section>

        <Section title="Corporate Team">
          <Slider label="Technology Team" min={10} max={50}
            value={state.corporateTeam.techTeam}
            set={(v: number) =>
              setState((p:any)=>({...p,corporateTeam:{...p.corporateTeam,techTeam:v}}))
            }
          />
          <Slider label="Marketing Team" min={5} max={25}
            value={state.corporateTeam.marketingTeam}
            set={(v: number) =>
              setState((p:any)=>({...p,corporateTeam:{...p.corporateTeam,marketingTeam:v}}))
            }
          />
          <Slider label="Customer Support" min={10} max={100}
            value={state.corporateTeam.customerSupport}
            set={(v: number) =>
              setState((p:any)=>({...p,corporateTeam:{...p.corporateTeam,customerSupport:v}}))
            }
          />
        </Section>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl"
        >
          {saving ? "Saving..." : "Save Operations Plan"}
        </button>
      </div>

      {/* RIGHT – IMPACT */}
      {impact && (
        <div className="sticky top-6 bg-gradient-to-br from-blue-50 to-green-50 border rounded-2xl p-6 shadow-sm">
          <h4 className="font-semibold text-lg mb-3">Impact Summary</h4>

          <p className="text-2xl font-bold mb-4">
            ₹{(impact.totalCost / 100000).toFixed(2)} L / month
          </p>

          <ul className="space-y-2 text-sm">
            <li>⚡ Speed +{impact.kpis.speed}%</li>
            {/* <li>📦 Fulfillment +{impact.kpis.fulfillment}%</li> */}
            <li>📈 Scalability +{impact.kpis.scalability}%</li>
            <li>😊 Customer Satisfaction +{impact.kpis.customerSatisfaction}%</li>
            <li>✅ Quality +{impact.kpis.quality}%</li>
          </ul>
        </div>
      )}
    </div>
  );
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

function Slider({ label, min, max, value, set }: any) {
  return (
    <div>
      <label className="text-sm font-medium">
        {label}: <b>{value}</b>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => set(+e.target.value)}
        className="w-full"
      />
    </div>
  );
}
