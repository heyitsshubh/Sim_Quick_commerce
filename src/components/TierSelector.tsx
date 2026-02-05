type Tier = "premium" | "standard" | "basic" | "discount";

interface Props {
  onSelect: (tier: Tier) => void;
  activeTier: Tier;
}

const tiers: Tier[] = ["premium", "standard", "basic", "discount"];

export default function TierSelector({ onSelect, activeTier }: Props) {
  return (
    <div className="flex gap-3 mb-6">
      {tiers.map((tier) => (
        <button
          key={tier}
          onClick={() => onSelect(tier)}
          className={`px-4 py-2 rounded-lg font-semibold capitalize ${
            activeTier === tier
              ? "bg-blue-600 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {tier}
        </button>
      ))}
    </div>
  );
}
