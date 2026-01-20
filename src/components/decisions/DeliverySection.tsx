import { useState } from 'react';

interface DeliverySectionProps {
  round: number;
  onComplete: (data: any) => void;
}

export default function DeliverySection({ round, onComplete }: DeliverySectionProps) {
  const [ownFleet, setOwnFleet] = useState(false);
  const [thirdParty, setThirdParty] = useState(false);
  const [riderCount, setRiderCount] = useState(50);
  const [bikeCount, setBikeCount] = useState(50);
  const [electricPercent, setElectricPercent] = useState(0);

  const handleSubmit = () => {
    onComplete({
      deliveryFleet: {
        ownFleet,
        thirdParty,
        riderCount: ownFleet ? riderCount : 0,
        bikeCount: ownFleet ? bikeCount : 0,
        electricPercent,
      },
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Delivery Fleet & Logistics</h2>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-blue-300">
            <input
              type="checkbox"
              checked={ownFleet}
              onChange={(e) => setOwnFleet(e.target.checked)}
            />
            <div>
              <div className="font-semibold text-slate-900">Own Delivery Fleet</div>
              <div className="text-sm text-slate-600">In-house riders for quality control</div>
            </div>
          </label>

          {ownFleet && (
            <div className="ml-6 space-y-4 bg-slate-50 p-4 rounded-xl">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Number of Riders (per city)
                </label>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="50"
                  value={riderCount}
                  onChange={(e) => setRiderCount(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-sm text-slate-600 mt-1">{riderCount} riders</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Number of Bikes (per city)
                </label>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="50"
                  value={bikeCount}
                  onChange={(e) => setBikeCount(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-sm text-slate-600 mt-1">{bikeCount} bikes</div>
              </div>

              {round >= 3 && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Electric Bikes (%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="10"
                    value={electricPercent}
                    onChange={(e) => setElectricPercent(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-sm text-slate-600 mt-1">{electricPercent}% electric fleet</div>
                </div>
              )}
            </div>
          )}

          <label className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-blue-300">
            <input
              type="checkbox"
              checked={thirdParty}
              onChange={(e) => setThirdParty(e.target.checked)}
            />
            <div>
              <div className="font-semibold text-slate-900">Third-Party Delivery</div>
              <div className="text-sm text-slate-600">Gig workers for flexible capacity</div>
            </div>
          </label>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!ownFleet && !thirdParty}
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-all"
      >
        Save Delivery Setup
      </button>
    </div>
  );
}
