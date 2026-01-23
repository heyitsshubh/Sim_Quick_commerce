import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface ImpactPieProps {
  title: string;
  data: { name: string; value: number }[];
}

const COLORS = ["#2563eb", "#60a5fa", "#93c5fd"];

export default function ImpactPie({ title, data }: ImpactPieProps) {
  return (
    <div className="w-full h-56 bg-white rounded-xl shadow-sm p-3">
      <h4 className="text-sm font-semibold text-slate-700 mb-2 text-center">
        {title}
      </h4>

      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Tooltip 
            formatter={(value) => `${value}`}
            contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={40}
            innerRadius={20}
            label
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
