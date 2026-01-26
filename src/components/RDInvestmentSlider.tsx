/* eslint-disable @typescript-eslint/no-explicit-any */
export default function RDInvestmentSlider({ value, onChange }: any) {
  return (
    <div className="bg-white border rounded-2xl p-5">
      <h3 className="font-semibold mb-2">R&D Investment</h3>

      <input
        type="range"
        min={0}
        max={3000000}
        step={100000}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        className="w-full"
      />

      <div className="text-sm mt-2">
        Invested this round: ₹{(value / 100000).toFixed(1)} L
      </div>
    </div>
  );
}
