/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Lock } from 'lucide-react';
import { usePersistentState } from '../../hooks/usePersistentState';

interface ProductCategoriesSectionProps {
  round: number;
  onComplete: (data: any) => void;
}

type Category = { _id: string; name: string; isActive?: boolean };

export default function ProductCategoriesSection({ round, onComplete }: ProductCategoriesSectionProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selections, setSelections] = usePersistentState<Record<string, boolean>>('step2_selections', {});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get('https://sim-quick-commerce-backend.onrender.com/api/step-two/categories');
        setCategories(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error('Categories fetch failed:', err.response?.data || err.message);
        setError('Failed to load categories. Please retry.');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleToggle = (id: string) => {
    setSelections({
      ...selections,
      [id]: !selections[id],
    });
  };

  const handleSubmit = async () => {
    const selectedIds = Object.keys(selections).filter((id) => selections[id]);

    if (selectedIds.length === 0) {
      setError('Select at least one category');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const token = localStorage.getItem('jwt') || '';
      const userId = localStorage.getItem('userId');
      const simulationId = localStorage.getItem('simulationId');

      const categoriesPayload = selectedIds.map((id) => ({
        categoryId: id,
        enabled: true,
        inventoryLevel: 'Medium',
      }));

      await axios.post(
        'https://sim-quick-commerce-backend.onrender.com/api/step-two/save',
        {
          userId,
          simulationId,
          roundNumber: round,
          categories: categoriesPayload,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );

      // Don't clear - keep selections persisted
      onComplete({
        productCategories: selections,
        selectedCategoryIds: selectedIds,
      });
    } catch (err: any) {
      console.error('Save failed:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to save. Please retry.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading categories...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Product Categories</h2>
      <p className="text-slate-600 mb-6">Select categories to offer in your quick commerce platform</p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {categories.map((category) => (
          <label
            key={category._id}
            className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
              selections[category._id] ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <input
              type="checkbox"
              checked={!!selections[category._id]}
              onChange={() => handleToggle(category._id)}
              className="mt-1"
            />
            <div>
              <div className="font-semibold text-slate-900">{category.name}</div>
            </div>
          </label>
        ))}
      </div>

      {round < 8 && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 text-slate-600 mb-2">
            <Lock className="w-5 h-5" />
            <span>More categories unlock in future rounds.</span>
          </div>
          <p className="text-sm text-slate-600">Keep playing to expand your product range!</p>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={saving}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-all"
      >
        {saving ? 'Saving...' : 'Save Product Selection'}
      </button>
    </div>
  );
}