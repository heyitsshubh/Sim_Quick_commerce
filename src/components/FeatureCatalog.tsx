/* eslint-disable @typescript-eslint/no-explicit-any */
export default function FeatureCatalog({
  features,
  selected,
  budget,
  onToggle
}: any) {
  const spent = selected.reduce((sum: number, k: string) => {
    const f = features.find((x: any) => x.key === k);
    return sum + (f?.cost || 0);
  }, 0);

  return (
    <div className="bg-white border rounded-2xl p-5">
      <h3 className="font-semibold mb-3">Feature Catalog</h3>

      <div className="space-y-3">
        {features.map((f: any) => {
          const disabled = spent + f.cost > budget && !selected.includes(f.key);

          return (
            <label
              key={f.key}
              className={`flex justify-between items-center p-3 border rounded-xl
                ${disabled ? "opacity-40" : "cursor-pointer"}
              `}
            >
              <div>
                <div className="font-medium">{f.name}</div>
                <div className="text-xs text-slate-600">{f.benefit}</div>
              </div>

              <input
                type="checkbox"
                checked={selected.includes(f.key)}
                disabled={disabled}
                onChange={() => onToggle(f.key)}
              />
            </label>
          );
        })}
      </div>

      <div className="mt-3 text-sm">
        Budget Used: ₹{(spent / 100000).toFixed(1)} L /{" "}
        {(budget / 100000).toFixed(1)} L
      </div>
    </div>
  );
}
