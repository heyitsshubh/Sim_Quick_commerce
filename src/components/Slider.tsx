import { TrendingUp } from "lucide-react";

type SliderProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  max: number;
  min?: number;
  step?: number;
  icon?: React.ReactNode;
};

export default function Slider({ 
  label, 
  value, 
  onChange, 
  max,
  min = 0,
  step = 1,
  icon
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <>
      <style>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
          transition: all 0.2s ease;
        }

        .slider-thumb::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.6);
        }

        .slider-thumb::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
          transition: all 0.2s ease;
        }

        .slider-thumb::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.6);
        }

        .slider-thumb::-webkit-slider-runnable-track {
          background: transparent;
          border: none;
        }

        .slider-thumb::-moz-range-track {
          background: transparent;
          border: none;
        }
      `}</style>

      <div className="space-y-3 bg-gradient-to-br from-slate-50 to-white p-5 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon && <div className="text-xl">{icon}</div>}
            <label className="text-sm font-semibold text-slate-700">{label}</label>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">₹{value.toLocaleString()}</p>
            <p className="text-xs text-slate-500">Max: ₹{max.toLocaleString()}</p>
          </div>
        </div>

        {/* Slider */}
        <div className="relative pt-2">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={e => onChange(+e.target.value)}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer slider-thumb"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`
            }}
          />
        </div>

        {/* Progress Info */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600">₹{min.toLocaleString()}</span>
          <div className="flex items-center gap-1 text-blue-600 font-semibold">
            <TrendingUp size={14} />
            {percentage.toFixed(0)}%
          </div>
          <span className="text-slate-600">₹{max.toLocaleString()}</span>
        </div>
      </div>
    </>
  );
}