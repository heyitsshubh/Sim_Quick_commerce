/* eslint-disable @typescript-eslint/no-explicit-any */

export default function FeatureCatalog({
  features,
  selected,
  onToggle,
  round
}: any) {
  const disabledAll = round === 1;

  return (
    <div className="bg-white border rounded-2xl p-5 space-y-4">
      <h3 className="font-semibold text-lg">Feature Catalog</h3>

      {disabledAll && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg text-sm">
          Features unlock from <b>Round 2</b> based on R&D investment.
        </div>
      )}

      {features.map((f: any) => {
        const checked = selected.includes(f.key);

        return (
          <label
            key={f.key}
            className={`flex items-start gap-4 p-4 border rounded-xl transition
              ${
                disabledAll
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:border-slate-400"
              }
              ${
                checked && !disabledAll
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-slate-200"
              }
            `}
          >
            <input
              type="checkbox"
              className="mt-1"
              checked={checked}
              disabled={disabledAll}          // 🔒 LOCK
              onChange={() => onToggle(f.key)}
            />

            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h4 className="font-semibold text-slate-900">
                  {f.name}
                </h4>

                <span className="text-sm font-medium text-slate-700">
                  ₹{(f.cost / 100000).toFixed(1)} L
                </span>
              </div>

              <p className="text-sm text-slate-600 mt-1">
                {f.benefit}
              </p>
            </div>
          </label>
        );
      })}
    </div>
  );
}
