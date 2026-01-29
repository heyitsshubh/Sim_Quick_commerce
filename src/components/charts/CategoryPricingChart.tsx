import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line,
} from "recharts";

interface CategoryPricingChartProps {
  title: string;
  data: {
    name: string;
    premium: number;
    standard: number;
    basic: number;
    discount: number;
    baseMonthlyDemand: number;
  }[];
}

const COLORS = {
  premium: "#1d4ed8",
  standard: "#3b82f6",
  basic: "#60a5fa",
  discount: "#93c5fd",
  demand: "#0f172a",
};

export default function CategoryPricingChart({
  title,
  data,
}: CategoryPricingChartProps) {
  return (
    <div className="w-full h-72 bg-white rounded-xl shadow-sm p-3">
      <h4 className="text-sm font-semibold text-slate-700 mb-2 text-center">
        {title}
      </h4>

      <ResponsiveContainer width="100%" height="85%">
        <ComposedChart data={data} margin={{ top: 8, right: 18, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Bar dataKey="premium" name="Premium" fill={COLORS.premium} />
          <Bar dataKey="standard" name="Standard" fill={COLORS.standard} />
          <Bar dataKey="basic" name="Basic" fill={COLORS.basic} />
          <Bar dataKey="discount" name="Discount" fill={COLORS.discount} />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="baseMonthlyDemand"
            name="Base Monthly Demand"
            stroke={COLORS.demand}
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
