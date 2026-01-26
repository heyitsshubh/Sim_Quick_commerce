/* eslint-disable @typescript-eslint/no-explicit-any */
export default function FeatureCatalog({
  features,
  selected,
  budget,
  onToggle,
  round = 1,
}: any) {
  const spent = selected.reduce((sum: number, k: string) => {
    const f = features.find((x: any) => x.key === k);
    return sum + (f?.cost || 0);
  }, 0);

  const lockedForRound = round === 1;

  return (
    <div className="bg-white border rounded-2xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Feature Catalog</h3>
        {lockedForRound && (
          <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            Available from next round
          </span>
        )}
      </div>

      <div className="space-y-3">
        {features.map((f: any) => {
          const overBudget = spent + f.cost > budget && !selected.includes(f.key);
          const disabled = lockedForRound || overBudget;

          return (
            <label
              key={f.key}
              className={`flex justify-between items-center p-3 border rounded-xl transition ${
                disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-slate-300"
              }`}
            >
              <div>
                <div className="font-medium">{f.name}</div>
                <div className="text-xs text-slate-600">{f.benefit}</div>
                <div className="text-xs text-slate-500">Cost: ₹{(f.cost / 100000).toFixed(1)} L</div>
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

      <div className="mt-1 text-sm text-slate-700">
        Budget Used: ₹{(spent / 100000).toFixed(1)} L / {(budget / 100000).toFixed(1)} L
      </div>
      {lockedForRound && (
        <div className="text-xs text-slate-500">
          Note: R&D budget allocated this round will be available from the next round.
        </div>
      )}
    </div>
  );
}