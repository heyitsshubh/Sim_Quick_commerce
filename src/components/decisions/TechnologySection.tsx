import { useState } from 'react';

interface TechnologySectionProps {
  round: number;
  onComplete: (data: any) => void;
}

const TECH_OPTIONS = [
  { id: 'mobile_app', label: 'Mobile App (Customer)', desc: 'Shopping app - REQUIRED', required: true },
  { id: 'rider_app', label: 'Rider App', desc: 'Delivery tracking - REQUIRED', required: true },
  { id: 'dark_store_mgmt', label: 'Dark Store Management System', desc: 'Store operations - REQUIRED', required: true },
  { id: 'website', label: 'Website', desc: 'Web ordering for desktop users', required: false, minRound: 1 },
  { id: 'inventory_mgmt', label: 'Inventory Management System', desc: 'Real-time tracking', required: false, minRound: 1 },
  { id: 'tracking', label: 'Real-Time Tracking', desc: 'Customer visibility', required: false, minRound: 1 },
  { id: 'route_opt', label: 'Route Optimization Software', desc: 'Delivery efficiency', required: false, minRound: 2 },
  { id: 'analytics', label: 'Supply Chain Analytics', desc: 'Business intelligence', required: false, minRound: 2 },
  { id: 'ai_recommendations', label: 'AI Recommendations', desc: 'Personalization to increase basket size', required: false, minRound: 3 },
  { id: 'demand_forecast', label: 'Demand Forecasting AI', desc: 'Inventory planning - Reduce waste 30%', required: false, minRound: 3 },
  { id: 'dynamic_pricing', label: 'Dynamic Pricing Engine', desc: 'Price optimization & surge pricing', required: false, minRound: 4 },
];

export default function TechnologySection({ round, onComplete }: TechnologySectionProps) {
  const [selections, setSelections] = useState<Record<string, boolean>>(
    TECH_OPTIONS.filter((opt) => opt.required).reduce((acc, opt) => ({ ...acc, [opt.id]: true }), {})
  );

  const availableOptions = TECH_OPTIONS.filter((opt) => !opt.minRound || opt.minRound <= round);

  const handleToggle = (id: string, required: boolean) => {
    if (!required) {
      setSelections({ ...selections, [id]: !selections[id] });
    }
  };

  const handleSubmit = () => {
    onComplete({
      technology: selections,
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Technology & Platform</h2>
      <p className="text-slate-600 mb-6">Select technology systems to implement</p>

      <div className="space-y-3 mb-6">
        {availableOptions.map((option) => (
          <label
            key={option.id}
            className={`flex items-start gap-3 p-4 border-2 rounded-xl transition-all ${
              option.required
                ? 'border-blue-300 bg-blue-50 opacity-75 cursor-not-allowed'
                : selections[option.id]
                ? 'border-green-500 bg-green-50 cursor-pointer'
                : 'border-slate-200 hover:border-slate-300 cursor-pointer'
            }`}
          >
            <input
              type="checkbox"
              checked={selections[option.id] || false}
              onChange={() => handleToggle(option.id, option.required)}
              disabled={option.required}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="font-semibold text-slate-900">
                {option.label}
                {option.required && <span className="ml-2 text-xs text-blue-600">(Required)</span>}
              </div>
              <div className="text-sm text-slate-600">{option.desc}</div>
            </div>
          </label>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all"
      >
        Save Technology Selection
      </button>
    </div>
  );
}
