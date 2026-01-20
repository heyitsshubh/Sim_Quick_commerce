export const ROUND_UNLOCKS = {
  1: {
    title: 'Foundation',
    categories: ['Groceries & Staples'],
    description: 'Fruits, dairy, cooking staples, snacks, beverages',
  },
  2: {
    title: 'Personal Care',
    categories: ['Personal Care & Household'],
    description: 'Personal care, baby care, cleaning, pet supplies',
  },
  3: {
    title: 'Health & Pharmacy',
    categories: ['Pharmacy & Health'],
    description: 'OTC, prescription, supplements, medical equipment',
  },
  4: {
    title: 'Food & Meals',
    categories: ['Ready-to-Eat & Food'],
    description: 'RTE meals, bakery, frozen, meat/seafood',
  },
  5: {
    title: 'Electronics',
    categories: ['Electronics & Home'],
    description: 'Mobile accessories, electronics, kitchen, stationery',
  },
  6: {
    title: 'Beauty & Fashion',
    categories: ['Beauty & Fashion'],
    description: 'Cosmetics, fashion accessories, footwear',
  },
  7: {
    title: 'Premium',
    categories: ['Premium & Specialty'],
    description: 'Organic, imported, alcohol, flowers/gifts',
  },
  8: {
    title: 'B2B Expansion',
    categories: ['B2B & Expansion'],
    description: 'Wholesale, restaurant supply, franchise, international',
  },
};

export const CITIES = {
  tier1: ['Mumbai', 'Delhi NCR', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata'],
  tier2: ['Ahmedabad', 'Jaipur', 'Chandigarh', 'Kochi', 'Lucknow'],
};

export const DELIVERY_MODELS = [
  { id: '10min', label: '10-Minute Delivery', desc: 'Ultra-fast, hyperlocal like Zepto' },
  { id: '15min', label: '15-20 Min Delivery', desc: 'Fast + wider range like Blinkit' },
  { id: '30min', label: '30-Min Delivery', desc: 'Balanced speed/selection like Swiggy Instamart' },
  { id: 'hybrid', label: 'Express + Scheduled', desc: 'Hybrid model with flexibility' },
];

export const MARKET_POSITIONING = [
  { id: 'premium', label: 'Premium Urban', desc: 'High-income areas, imported & organic focus' },
  { id: 'mass', label: 'Mass Market', desc: 'All income groups, volume play' },
  { id: 'value', label: 'Value/Discount', desc: 'Price-conscious, competitive pricing' },
];

export const PRODUCT_CATEGORIES = {
  1: [
    { id: 'fruits_veg', label: 'Fruits & Vegetables', inventory: '₹5-30L' },
    { id: 'dairy', label: 'Dairy & Eggs', inventory: '₹8-50L' },
    { id: 'staples', label: 'Cooking Staples', inventory: '₹10-60L' },
    { id: 'packaged_food', label: 'Packaged Food & Snacks', inventory: '₹10-70L' },
    { id: 'beverages', label: 'Beverages (Non-alcoholic)', inventory: '₹8-50L' },
  ],
  2: [
    { id: 'personal_care', label: 'Personal Care Products', inventory: '₹10-70L' },
    { id: 'baby_care', label: 'Baby Care', inventory: '₹8-50L' },
    { id: 'cleaning', label: 'Household Cleaning', inventory: '₹8-50L' },
    { id: 'pet_supplies', label: 'Pet Supplies', inventory: '₹5-35L' },
  ],
  3: [
    { id: 'otc', label: 'OTC Medicines', inventory: '₹10-80L' },
    { id: 'prescription', label: 'Prescription Medicines', inventory: '₹15-100L' },
    { id: 'supplements', label: 'Health Supplements', inventory: '₹8-50L' },
    { id: 'medical_equipment', label: 'Medical Equipment', inventory: '₹5-40L' },
  ],
  4: [
    { id: 'rte_meals', label: 'Ready-to-Eat Meals', inventory: '₹8-60L' },
    { id: 'bakery', label: 'Bakery & Confectionery', inventory: '₹8-50L' },
    { id: 'frozen', label: 'Frozen Foods', inventory: '₹10-80L' },
    { id: 'meat', label: 'Meat & Seafood', inventory: '₹12-100L' },
  ],
  5: [
    { id: 'mobile_acc', label: 'Mobile Accessories', inventory: '₹5-40L' },
    { id: 'electronics', label: 'Small Electronics', inventory: '₹10-80L' },
    { id: 'home_kitchen', label: 'Home & Kitchen', inventory: '₹8-60L' },
    { id: 'stationery', label: 'Stationery & Office', inventory: '₹5-35L' },
  ],
  6: [
    { id: 'beauty', label: 'Beauty & Cosmetics', inventory: '₹10-80L' },
    { id: 'fashion_acc', label: 'Fashion Accessories', inventory: '₹8-60L' },
    { id: 'footwear', label: 'Footwear (Basic)', inventory: '₹10-80L' },
  ],
  7: [
    { id: 'organic', label: 'Organic & Gourmet', inventory: '₹12-100L' },
    { id: 'imported', label: 'Imported Foods', inventory: '₹15-120L' },
    { id: 'alcohol', label: 'Alcohol Delivery', inventory: '₹20-150L' },
    { id: 'flowers', label: 'Flowers & Gifts', inventory: '₹8-60L' },
  ],
  8: [
    { id: 'b2b_wholesale', label: 'B2B Wholesale', inventory: '₹30-200L' },
    { id: 'restaurant_supply', label: 'Restaurant Supply', inventory: '₹25-150L' },
    { id: 'office_pantry', label: 'Office Pantry Supply', inventory: '₹20-120L' },
    { id: 'franchise', label: 'Franchise Dark Stores', inventory: '₹10-80L' },
  ],
};
