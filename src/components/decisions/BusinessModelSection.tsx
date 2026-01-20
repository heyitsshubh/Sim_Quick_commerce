/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import axios from 'axios';

interface BusinessModelSectionProps {
  round: number;
  onComplete: (data: any) => void;
}

type BusinessModel = { _id: string; name: string; description?: string; example?: string };
type MarketPosition = { _id: string; name: string; description?: string; focus?: string };

export default function BusinessModelSection({ onComplete }: BusinessModelSectionProps) {
  const [deliveryModel, setDeliveryModel] = useState('');
  const [positioning, setPositioning] = useState('');
  const [businessModels, setBusinessModels] = useState<BusinessModel[]>([]);
  const [marketPositions, setMarketPositions] = useState<MarketPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get('https://sim-quick-commerce-backend.onrender.com/api/step-one/options');
        setBusinessModels(data?.businessModels ?? []);
        setMarketPositions(data?.marketPositions ?? []);
      } catch (err) {
        console.error(err);
        setError('Failed to load options. Please retry.');
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
  }, []);

const handleSubmit = async () => {
    if (!deliveryModel || !positioning) return;

    try {
      setLoading(true);
      await axios.post('https://sim-quick-commerce-backend.onrender.com/api/step-one/save', {
        businessModel: deliveryModel,
        marketPositioning: positioning,
      });

      onComplete({
        businessModel: deliveryModel,
        marketPositioning: positioning,
      });
    } catch (err) {
      console.error(err);
      setError('Failed to save. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading options...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Business Model & Positioning</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-3">
            Quick Commerce Delivery Model
          </label>
          <div className="grid gap-3">
            {businessModels.map((model) => (
              <label
                key={model._id}
                className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  deliveryModel === model._id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="deliveryModel"
                  value={model._id}
                  checked={deliveryModel === model._id}
                  onChange={(e) => setDeliveryModel(e.target.value)}
                  className="mt-1"
                />
                <div>
                  <div className="font-semibold text-slate-900">{model.name}</div>
                  <div className="text-sm text-slate-600">{model.description}</div>
                  {model.example && (
                    <div className="text-xs text-slate-500 mt-1">Example: {model.example}</div>
                  )}
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
            {marketPositions.map((pos) => (
              <label
                key={pos._id}
                className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  positioning === pos._id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="positioning"
                  value={pos._id}
                  checked={positioning === pos._id}
                  onChange={(e) => setPositioning(e.target.value)}
                  className="mt-1"
                />
                <div>
                  <div className="font-semibold text-slate-900">{pos.name}</div>
                  <div className="text-sm text-slate-600">{pos.description}</div>
                  {pos.focus && (
                    <div className="text-xs text-slate-500 mt-1">Focus: {pos.focus}</div>
                  )}
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