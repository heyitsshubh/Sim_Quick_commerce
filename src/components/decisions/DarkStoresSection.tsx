/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { CITIES } from '../../data/categories';

interface DarkStoresSectionProps {
  round: number;
  onComplete: (data: any) => void;
}

export default function DarkStoresSection({ round, onComplete }: DarkStoresSectionProps) {
  const [cityStores, setCityStores] = useState<Record<string, number>>({});
  const [storeSize, setStoreSize] = useState('medium');

  const availableCities = round >= 3 ? [...CITIES.tier1, ...CITIES.tier2] : CITIES.tier1;

  const handleCityChange = (city: string, count: number) => {
    setCityStores({ ...cityStores, [city]: count });
  };

  const handleSubmit = () => {
    onComplete({
      darkStores: cityStores,
      storeSize,
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Dark Store Infrastructure</h2>
      <p className="text-slate-600 mb-6">Select cities and number of dark stores to launch</p>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-900 mb-3">Store Size</label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'small', label: 'Small', desc: '1000-2000 sq ft', range: '1000-2000 SKUs' },
            { id: 'medium', label: 'Medium', desc: '2000-4000 sq ft', range: '2000-4000 SKUs' },
            { id: 'large', label: 'Large', desc: '4000-8000 sq ft', range: '4000-8000 SKUs' },
          ].map((size) => (
            <label
              key={size.id}
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                storeSize === size.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <input
                type="radio"
                name="storeSize"
                value={size.id}
                checked={storeSize === size.id}
                onChange={(e) => setStoreSize(e.target.value)}
                className="sr-only"
              />
              <div className="font-semibold text-slate-900">{size.label}</div>
              <div className="text-xs text-slate-600">{size.desc}</div>
              <div className="text-xs text-slate-500 mt-1">{size.range}</div>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <label className="block text-sm font-semibold text-slate-900">City Expansion</label>
        {availableCities.map((city) => (
          <div key={city} className="flex items-center gap-4">
            <span className="w-32 text-sm font-medium text-slate-900">{city}</span>
            <input
              type="number"
              min="0"
              max="100"
              value={cityStores[city] || 0}
              onChange={(e) => handleCityChange(city, parseInt(e.target.value) || 0)}
              className="w-24 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="0"
            />
            <span className="text-sm text-slate-600">stores</span>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all"
      >
        Save Dark Store Setup
      </button>
    </div>
  );
}
