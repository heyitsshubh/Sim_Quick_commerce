/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';

interface PricingSectionProps {
  round: number;
  onComplete: (data: any) => void;
}

export default function PricingSection({ round, onComplete }: PricingSectionProps) {
  const [strategy, setStrategy] = useState('');
  const [deliveryCharges, setDeliveryCharges] = useState('');
  const [aov, setAov] = useState(500);
  const [margin, setMargin] = useState(20);
  const [membership, setMembership] = useState(false);

  const handleSubmit = () => {
    if (strategy && deliveryCharges) {
      onComplete({
        pricing: {
          strategy,
          deliveryCharges,
          aov,
          margin,
          membership: round >= 3 ? membership : false,
        },
      });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Pricing & Economics</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-3">Pricing Strategy</label>
          <div className="space-y-2">
            {[
              { id: 'lower', label: 'Lower than Market', desc: 'Discount positioning (-5% to -15%)' },
              { id: 'par', label: 'At Par with Market', desc: 'Competitive (0%)' },
              { id: 'premium', label: 'Premium Pricing', desc: 'Speed premium (+5% to +20%)' },
            ].map((opt) => (
              <label
                key={opt.id}
                className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  strategy === opt.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="strategy"
                  value={opt.id}
                  checked={strategy === opt.id}
                  onChange={(e) => setStrategy(e.target.value)}
                  className="mt-1"
                />
                <div>
                  <div className="font-semibold text-slate-900">{opt.label}</div>
                  <div className="text-sm text-slate-600">{opt.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-3">Delivery Charges</label>
          <div className="space-y-2">
            {[
              { id: 'free', label: 'Free Delivery', desc: 'Minimum order ₹99-499' },
              { id: 'flat', label: 'Flat Fee', desc: '₹20-50 per order' },
              { id: 'distance', label: 'Distance-based', desc: '₹10-100 variable' },
            ].map((opt) => (
              <label
                key={opt.id}
                className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  deliveryCharges === opt.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="deliveryCharges"
                  value={opt.id}
                  checked={deliveryCharges === opt.id}
                  onChange={(e) => setDeliveryCharges(e.target.value)}
                  className="mt-1"
                />
                <div>
                  <div className="font-semibold text-slate-900">{opt.label}</div>
                  <div className="text-sm text-slate-600">{opt.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Average Order Value Target: ₹{aov}
          </label>
          <input
            type="range"
            min="300"
            max="1200"
            step="50"
            value={aov}
            onChange={(e) => setAov(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Target Gross Margin: {margin}%
          </label>
          <input
            type="range"
            min="12"
            max="30"
            step="1"
            value={margin}
            onChange={(e) => setMargin(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        {round >= 3 && (
          <label className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-blue-300">
            <input
              type="checkbox"
              checked={membership}
              onChange={(e) => setMembership(e.target.checked)}
            />
            <div>
              <div className="font-semibold text-slate-900">Membership/Subscription</div>
              <div className="text-sm text-slate-600">Unlimited free delivery (₹99-299/month)</div>
            </div>
          </label>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!strategy || !deliveryCharges}
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-all"
      >
        Save Pricing Strategy
      </button>
    </div>
  );
}
