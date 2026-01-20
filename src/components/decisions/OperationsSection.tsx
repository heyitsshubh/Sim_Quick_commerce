import { useState } from 'react';

interface OperationsSectionProps {
  round: number;
  onComplete: (data: any) => void;
}

export default function OperationsSection({ round, onComplete }: OperationsSectionProps) {
  const [storeManagers, setStoreManagers] = useState(1);
  const [pickers, setPickers] = useState(10);
  const [riders, setRiders] = useState(50);
  const [techTeam, setTechTeam] = useState(15);
  const [marketing, setMarketing] = useState(10);
  const [support, setSupport] = useState(20);

  const handleSubmit = () => {
    onComplete({
      operations: {
        storeManagers,
        pickers,
        riders,
        techTeam,
        marketing,
        support,
      },
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Operations & Staffing</h2>
      <p className="text-slate-600 mb-6">Set team sizes for different departments</p>

      <div className="space-y-6">
        <div className="bg-slate-50 rounded-xl p-4">
          <h3 className="font-semibold text-slate-900 mb-4">Dark Store Staff (Per Store)</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Store Managers: {storeManagers}
              </label>
              <input
                type="range"
                min="1"
                max="3"
                step="1"
                value={storeManagers}
                onChange={(e) => setStoreManagers(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-slate-600">₹30-70K/month each</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Pickers/Packers: {pickers}
              </label>
              <input
                type="range"
                min="5"
                max="30"
                step="5"
                value={pickers}
                onChange={(e) => setPickers(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-slate-600">₹15-25K/month each</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-4">
          <h3 className="font-semibold text-slate-900 mb-4">Delivery Staff (Per City)</h3>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Delivery Riders: {riders}
            </label>
            <input
              type="range"
              min="50"
              max="1000"
              step="50"
              value={riders}
              onChange={(e) => setRiders(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-slate-600">₹18-25K/month each</div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-4">
          <h3 className="font-semibold text-slate-900 mb-4">Corporate Team</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Technology Team: {techTeam}
              </label>
              <input
                type="range"
                min="10"
                max="50"
                step="5"
                value={techTeam}
                onChange={(e) => setTechTeam(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-slate-600">₹40K-1.5L/month each</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Marketing Team: {marketing}
              </label>
              <input
                type="range"
                min="5"
                max="25"
                step="5"
                value={marketing}
                onChange={(e) => setMarketing(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-slate-600">₹25K-1L/month each</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Customer Support: {support}
              </label>
              <input
                type="range"
                min="10"
                max="100"
                step="10"
                value={support}
                onChange={(e) => setSupport(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-slate-600">₹15-30K/month each</div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all"
      >
        Save Operations Plan
      </button>
    </div>
  );
}
