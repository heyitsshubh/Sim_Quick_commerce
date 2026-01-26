/* eslint-disable @typescript-eslint/no-explicit-any */
import QualitySelector from "./QualitySelector";
import PriceSlider from "./PriceSliders";

export default function CategoryPricingCard({ category, onChange }: any) {
      const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  return (
    <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
      <div>
        <h3 className="text-lg font-bold">{category.name}</h3>
        <p className="text-xs text-slate-600">
          Base Monthly Demand: {category.baseMonthlyDemand}
        </p>
      </div>
         <ProductCategoriesSection
          round={round}
          onComplete={(data) => {/* handle completion */}}
          onCategorySelectionChange={setSelectedCategories}
        />

            <QualitySelector
          value={qualityLevel}
          onChange={setQualityLevel}
          config={config}
          selectedCategories={selectedCategories}
        />

      <PriceSlider
        name={category.name}
        price={category.price}
        onChange={(v: number) =>
          onChange({ ...category, price: v })
        }
      />
    </div>
  );
}
