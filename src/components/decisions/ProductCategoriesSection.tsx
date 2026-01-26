/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Lock } from 'lucide-react';
import { usePersistentState } from '../../hooks/usePersistentState';
import ImpactPie from '../charts/ImpactPies';

interface ProductCategoriesSectionProps {
  round: number;
  onComplete: (data: any) => void;
  onCategorySelectionChange?: (selectedCategoryNames: string[]) => void; // NEW
  showMinimal?: boolean;
}

type InventoryRange = {
  label: string;
  min: number;
  max: number;
};

type Category = {
  _id: string;
  name: string;
  inventoryRanges: InventoryRange[];
  baseMonthlyDemand: number;
};

type SelectionState = Record<
  string,
  {
    enabled: boolean;
    inventoryRange: string;
  }
>;

export default function ProductCategoriesSection({
  round,
  onComplete,
  onCategorySelectionChange, // NEW
   showMinimal = false,
}: ProductCategoriesSectionProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [marketPie, setMarketPie] = useState<any[]>([]);
  const [quickPie, setQuickPie] = useState<any[]>([]);
  const [selections, setSelections] =
    usePersistentState<SelectionState>('step2_selections', {});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [catRes, marketRes, quickRes] = await Promise.all([
          axios.get('https://sim-quick-commerce-backend.onrender.com/api/step-two/categories'),
          axios.get('https://sim-quick-commerce-backend.onrender.com/api/market-positioning'),
          axios.get('https://sim-quick-commerce-backend.onrender.com/api/quick-commerce-models'),
        ]);

        setCategories(catRes.data || []);
        setMarketPie(marketRes.data || []);
        setQuickPie(quickRes.data || []);
      } catch {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // NEW: Notify parent whenever selections change
  useEffect(() => {
    if (!onCategorySelectionChange || categories.length === 0) return;
    
    const selectedNames = Object.entries(selections)
      .filter(([, v]) => v.enabled)
      .map(([id]) => {
        const cat = categories.find(c => c._id === id);
        return cat?.name.toLowerCase() || '';
      })
      .filter(Boolean);
    
    onCategorySelectionChange(selectedNames);
  }, [selections, categories, onCategorySelectionChange]);

  const toggleCategory = (category: Category) => {
    setSelections({
      ...selections,
      [category._id]: selections[category._id]
        ? { ...selections[category._id], enabled: !selections[category._id].enabled }
        : {
            enabled: true,
            inventoryRange: category.inventoryRanges[0]?.label,
          },
    });
  };

  const updateInventory = (id: string, value: string) => {
    setSelections({
      ...selections,
      [id]: {
        ...(selections[id] ?? { enabled: true }),
        inventoryRange: value,
      },
    });
  };

  const handleSubmit = async () => {
    const selectedCategories = Object.entries(selections)
      .filter(([, v]) => v.enabled)
      .map(([id, v]) => ({
        categoryId: id,
        enabled: true,
        inventoryRange: v.inventoryRange,
      }));

    if (selectedCategories.length === 0) {
      setError('Select at least one category');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await axios.post(
        'https://sim-quick-commerce-backend.onrender.com/api/step-two/save',
        {
          userId: localStorage.getItem('userId'),
          simulationId: localStorage.getItem('simulationId'),
          roundNumber: round,
          categories: selectedCategories,
        }
      );

      onComplete({ categories: selections });
    } catch {
      setError('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (showMinimal) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-2">Product Categories</h2>
        <p className="text-slate-600 mb-6">Select product categories</p>

        <div className="space-y-3">
          {categories.map((category) => {
            const selection = selections[category._id];
            const enabled = !!selection?.enabled;

            return (
              <label
                key={category._id}
                className="flex items-center justify-between gap-3 cursor-pointer p-3 border rounded-lg hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={() => toggleCategory(category)}
                    className="w-4 h-4"
                  />
                  <span className="font-medium text-slate-700">{category.name}</span>
                </div>
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded-full">
                  {category.baseMonthlyDemand ?? "-"}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    );
  }



  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Product Categories</h2>
      <p className="text-slate-600 mb-6">
        Select categories and inventory ranges
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 mb-6">
        {categories.map((category) => {
          const selection = selections[category._id];
          const enabled = !!selection?.enabled;

          return (
            <div
              key={category._id}
              className={`p-4 border-2 rounded-xl ${
                enabled ? 'border-blue-600 bg-blue-50' : 'border-slate-200'
              }`}
            >
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={() => toggleCategory(category)}
                />
                <span className="font-semibold">{category.name}</span>
              </label>

              {/* Charts always visible */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <ImpactPie
                  title="Quick Commerce Demand"
                  data={quickPie}
                />
                <ImpactPie
                  title="Market Positioning Demand"
                  data={marketPie}
                />
              </div>

              {/* Inventory Dropdown only when enabled */}
              {enabled && (
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Inventory Level
                  </label>
                  <select
                    value={selection.inventoryRange}
                    onChange={(e) =>
                      updateInventory(category._id, e.target.value)
                    }
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    {category.inventoryRanges.map((r) => (
                      <option key={r.label} value={r.label}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {round < 8 && (
        <div className="bg-slate-50 border rounded-xl p-4 mb-6">
          <Lock className="inline w-4 h-4 mr-2" />
          More categories unlock in future rounds
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={saving}
        className="w-full bg-blue-600 text-white py-3 rounded-xl"
      >
        {saving ? 'Saving...' : 'Save Product Selection'}
      </button>
    </div>
  );
}