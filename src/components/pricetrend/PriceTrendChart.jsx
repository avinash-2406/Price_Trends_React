import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

function PriceTrendChart({ data }) {
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip formatter={(v) => `₹ ${v}`} />
            <Area
              dataKey="price"
              stroke="#0d6efd"
              fill="#0d6efd"
              fillOpacity={0.3}
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PriceTrendChart;
