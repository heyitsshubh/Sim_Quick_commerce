import { useState } from 'react';

interface MarketingSectionProps {
  round: number;
  onComplete: (data: any) => void;
}

const MARKETING_CHANNELS = [
  { id: 'google_ads', label: 'Google Ads', desc: 'Search advertising - "Grocery near me"' },
  { id: 'social', label: 'Facebook & Instagram', desc: 'Social advertising with targeting' },
  { id: 'referral', label: 'Referral Program', desc: 'Friend referral for viral growth' },
  { id: 'first_order', label: 'First Order Discount', desc: 'Welcome offer (30-60% off) - CRITICAL' },
  { id: 'cashback', label: 'Cashback/Coupons', desc: 'Ongoing discounts for repeat orders' },
  { id: 'loyalty', label: 'Loyalty Program', desc: 'Points system with gamification', minRound: 2 },
  { id: 'influencer', label: 'Influencer Marketing', desc: 'Local influencers for credibility', minRound: 2 },
  { id: 'push', label: 'Push Notifications', desc: 'Re-engagement & abandoned cart', minRound: 1 },
  { id: 'email_sms', label: 'Email/SMS Marketing', desc: 'Promotional campaigns' },
];

export default function MarketingSection({ round, onComplete }: MarketingSectionProps) {
  const [selections, setSelections] = useState<Record<string, boolean>>({});

  const availableChannels = MARKETING_CHANNELS.filter((ch) => !ch.minRound || ch.minRound <= round);

  const handleToggle = (id: string) => {
    setSelections({ ...selections, [id]: !selections[id] });
  };

  const handleSubmit = () => {
    onComplete({
      marketing: selections,
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Marketing & Growth</h2>
      <p className="text-slate-600 mb-6">Select marketing channels for customer acquisition and retention</p>

      <div className="space-y-3 mb-6">
        {availableChannels.map((channel) => (
          <label
            key={channel.id}
            className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
              selections[channel.id]
                ? 'border-green-500 bg-green-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <input
              type="checkbox"
              checked={selections[channel.id] || false}
              onChange={() => handleToggle(channel.id)}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="font-semibold text-slate-900">{channel.label}</div>
              <div className="text-sm text-slate-600">{channel.desc}</div>
            </div>
          </label>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all"
      >
        Save Marketing Plan
      </button>
    </div>
  );
}
