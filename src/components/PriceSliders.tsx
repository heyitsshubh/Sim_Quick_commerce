/* eslint-disable @typescript-eslint/no-explicit-any */

export default function PriceSliders({
  name,
  price,
  onChange
}: any) {
  return (
    <div className="border rounded-xl p-3 md:p-4 bg-slate-50">
      <label className="block text-xs md:text-sm font-medium mb-2 truncate">
        {name} Price
      </label>

      <input
        type="range"
        min={50}
        max={2000}
        step={10}
        value={price}
        onChange={(e) => onChange(+e.target.value)}
        className="w-full"
      />

      <div className="mt-2 text-right font-semibold text-sm md:text-base">
        ₹{price}
      </div>
    </div>
  );
}
