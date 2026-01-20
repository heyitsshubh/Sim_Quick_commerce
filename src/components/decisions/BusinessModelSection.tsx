import { useState } from 'react';
import { DELIVERY_MODELS, MARKET_POSITIONING } from '../../data/categories';

interface BusinessModelSectionProps {
  round: number;
  onComplete: (data: any) => void;
}

export default function BusinessModelSection({ round, onComplete }: BusinessModelSectionProps) {
  const [deliveryModel, setDeliveryModel] = useState('');
  const [positioning, setPositioning] = useState('');

  const handleSubmit = () => {
    if (deliveryModel && positioning) {
      onComplete({
        businessModel: deliveryModel,
        marketPositioning: positioning,
      });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Business Model & Positioning</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-3">
            Quick Commerce Delivery Model
          </label>
          <div className="grid gap-3">
            {DELIVERY_MODELS.map((model) => (
              <label
                key={model.id}
                className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  deliveryModel === model.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="deliveryModel"
                  value={model.id}
                  checked={deliveryModel === model.id}
                  onChange={(e) => setDeliveryModel(e.target.value)}
                  className="mt-1"
                />
                <div>
                  <div className="font-semibold text-slate-900">{model.label}</div>
                  <div className="text-sm text-slate-600">{model.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-3">
            Market Positioning
          </label>
          <div className="grid gap-3">
            {MARKET_POSITIONING.map((pos) => (
              <label
                key={pos.id}
                className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  positioning === pos.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="positioning"
                  value={pos.id}
                  checked={positioning === pos.id}
                  onChange={(e) => setPositioning(e.target.value)}
                  className="mt-1"
                />
                <div>
                  <div className="font-semibold text-slate-900">{pos.label}</div>
                  <div className="text-sm text-slate-600">{pos.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!deliveryModel || !positioning}
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-all"
      >
        Save Business Model
      </button>
    </div>
  );
}
