/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Lock } from 'lucide-react';
import ImpactPie from '../charts/ImpactPies';

interface ProductCategoriesSectionProps {
  round: number;
  onComplete: (data: any) => void;
  onCategorySelectionChange?: (selectedCategoryNames: string[]) => void;
  showMinimal?: boolean;
}

type PricingTiers = {
  premium: number;
  standard: number;
  basic: number;
  discount: number;
};

type Category = {
  _id: string;
  name: string;
  pricingTiers: PricingTiers;
  baseMonthlyDemand: number;
};

export default function ProductCategoriesSection({
  round,
  onComplete,
  onCategorySelectionChange,
  showMinimal = false,
}: ProductCategoriesSectionProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selections, setSelections] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const selectionStorageKey = 'step2_selections';

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const catRes = await axios.get(
          'https://sim-quick-commerce-backend.onrender.com/api/step-two/categories'
        );

        const fetchedCategories = catRes.data || [];
        setCategories(fetchedCategories);

        const savedSelectionsRaw = localStorage.getItem(selectionStorageKey);
        const savedSelections = savedSelectionsRaw
          ? (JSON.parse(savedSelectionsRaw) as Record<string, boolean>)
          : null;

        const initialSelections = (fetchedCategories as Category[]).reduce(
          (acc, cat) => ({
            ...acc,
            [cat._id]: savedSelections?.[cat._id] ?? true,
          }),
          {} as Record<string, boolean>
        );
        setSelections(initialSelections);
      } catch {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  useEffect(() => {
    if (!categories.length) return;

    localStorage.setItem(selectionStorageKey, JSON.stringify(selections));

    const selectedNames = categories
      .filter((cat) => selections[cat._id])
      .map((cat) => cat.name.toLowerCase());

    onCategorySelectionChange?.(selectedNames);
  }, [categories, selections, onCategorySelectionChange, selectionStorageKey]);

  const toggleCategory = (categoryId: string) => {
    setSelections((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleSubmit = async () => {
    const selectedCategories = Object.entries(selections)
      .filter(([, enabled]) => enabled)
      .map(([id]) => ({
        categoryId: id,
        enabled: true,
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
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Product Categories</h2>
        <p className="text-slate-600">
          Choose categories to include and review pricing tiers.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {categories.map((category) => (
          <div
            key={category._id}
            className={`bg-white border rounded-2xl p-5 shadow-sm transition-all ${
              selections[category._id]
                ? 'border-blue-600 ring-1 ring-blue-200'
                : 'border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!selections[category._id]}
                  onChange={() => toggleCategory(category._id)}
                  className="w-4 h-4"
                />
                <span className="font-semibold text-slate-800 text-lg">
                  {category.name}
                </span>
              </label>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
                Demand: {category.baseMonthlyDemand}
              </span>
            </div>

            <div className="mt-4">
              <ImpactPie
                title={`${category.name} Pricing Tiers`}
                data={[
                  { name: 'Premium', value: category.pricingTiers.premium },
                  { name: 'Standard', value: category.pricingTiers.standard },
                  { name: 'Basic', value: category.pricingTiers.basic },
                  { name: 'Discount', value: category.pricingTiers.discount },
                ]}
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-600">
              <div className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                <span>Premium</span>
                <span className="font-semibold text-slate-900">
                  {category.pricingTiers.premium}
                </span>
              </div>
              <div className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                <span>Standard</span>
                <span className="font-semibold text-slate-900">
                  {category.pricingTiers.standard}
                </span>
              </div>
              <div className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                <span>Basic</span>
                <span className="font-semibold text-slate-900">
                  {category.pricingTiers.basic}
                </span>
              </div>
              <div className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                <span>Discount</span>
                <span className="font-semibold text-slate-900">
                  {category.pricingTiers.discount}
                </span>
              </div>
            </div>
          </div>
        ))}
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
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Product Selection'}
      </button>
    </div>
  );
}