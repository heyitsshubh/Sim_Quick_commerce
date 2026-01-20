import { useState } from 'react';
import { Lock, Unlock } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '../../data/categories';

interface ProductCategoriesSectionProps {
  round: number;
  onComplete: (data: any) => void;
}

export default function ProductCategoriesSection({ round, onComplete }: ProductCategoriesSectionProps) {
  const [selections, setSelections] = useState<Record<string, boolean>>({});

  const availableCategories = Object.keys(PRODUCT_CATEGORIES)
    .filter((r) => parseInt(r) <= round)
    .flatMap((r) => PRODUCT_CATEGORIES[parseInt(r) as keyof typeof PRODUCT_CATEGORIES]);

  const handleToggle = (id: string) => {
    setSelections({ ...selections, [id]: !selections[id] });
  };

  const handleSubmit = () => {
    onComplete({
      productCategories: selections,
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Product Categories</h2>
      <p className="text-slate-600 mb-6">Select categories to offer in your quick commerce platform</p>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {availableCategories.map((category) => (
          <label
            key={category.id}
            className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
              selections[category.id]
                ? 'border-green-500 bg-green-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <input
              type="checkbox"
              checked={selections[category.id] || false}
              onChange={() => handleToggle(category.id)}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="font-semibold text-slate-900">{category.label}</div>
              <div className="text-sm text-slate-600">Inventory: {category.inventory}</div>
            </div>
            <Unlock className="w-5 h-5 text-green-600" />
          </label>
        ))}
      </div>

      {round < 8 && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 text-slate-600 mb-2">
            <Lock className="w-5 h-5" />
            <span className="font-semibold">Locked Categories</span>
          </div>
          <p className="text-sm text-slate-600">
            More categories unlock in future rounds. Keep playing to expand your product range!
          </p>
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all"
      >
        Save Product Selection
      </button>
    </div>
  );
}
