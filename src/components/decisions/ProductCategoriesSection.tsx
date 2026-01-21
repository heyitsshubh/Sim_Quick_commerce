/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Lock } from 'lucide-react';
import { usePersistentState } from '../../hooks/usePersistentState';
import ImpactPie from '../charts/ImpactPies';

interface ProductCategoriesSectionProps {
  round: number;
  onComplete: (data: any) => void;
}

type Category = {
  _id: string;
  name: string;
};

type SelectionState = Record<
  string,
  {
    enabled: boolean;
    inventory: string;
  }
>;

const INVENTORY_OPTIONS = ['0-500', '500-1000', '1000-1500'];

export default function ProductCategoriesSection({
  round,
  onComplete,
}: ProductCategoriesSectionProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [marketPie, setMarketPie] = useState<any[]>([]);
  const [quickPie, setQuickPie] = useState<any[]>([]);
  const [selections, setSelections] = usePersistentState<SelectionState>(
    'step2_selections',
    {}
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

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

  const toggleCategory = (id: string) => {
    setSelections({
      ...selections,
      [id]: selections[id]
        ? { ...selections[id], enabled: !selections[id].enabled }
        : { enabled: true, inventory: INVENTORY_OPTIONS[0] },
    });
  };

  const updateInventory = (id: string, value: string) => {
    setSelections({
      ...selections,
      [id]: {
        ...selections[id],
        inventory: value,
      },
    });
  };

  const handleSubmit = async () => {
    const selectedCategories = Object.entries(selections)
      .filter(([, v]) => v.enabled)
      .map(([id, v]) => ({
        categoryId: id,
        enabled: true,
        inventoryRange: v.inventory,
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

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Product Categories</h2>
      <p className="text-slate-600 mb-6">
        Select categories and inventory levels
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {categories.map((category) => {
          const selection = selections[category._id];

          return (
            <div
              key={category._id}
              className={`p-4 border-2 rounded-xl ${
                selection?.enabled
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-slate-200'
              }`}
            >
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!selection?.enabled}
                  onChange={() => toggleCategory(category._id)}
                />
                <span className="font-semibold">{category.name}</span>
              </label>

              {selection?.enabled && (
                <div className="mt-4 space-y-4">
                  {/* Inventory */}
                  <select
                    value={selection.inventory}
                    onChange={(e) =>
                      updateInventory(category._id, e.target.value)
                    }
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    {INVENTORY_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>

                  {/* Pie Charts */}
                  <div className="grid grid-cols-2 gap-4">
                    <ImpactPie
                      title="Quick Commerce Impact"
                      data={quickPie}
                    />
                    <ImpactPie
                      title="Market Positioning Impact"
                      data={marketPie}
                    />
                  </div>
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
