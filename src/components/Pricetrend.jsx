import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

function Pricetrend() {
  const [location, setLocation] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [property_type, setPropertyType] = useState("flat")
  const [error, setError] = useState("");

  const fetchPriceTrend = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:8000/api/price-trend/?final_location=${location}&property_type=${property_type}`
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Something went wrong");
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPriceTrend();
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Price Trend (Line Chart)</h3>

      {/* Location Input */}
      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location"
          />
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            onChange={(e) => setPropertyType(e.target.value)}
          >
            <option value="flat">Flat</option>
            <option value="shop">Shop</option>
            <option value="office">Office</option>
            <option value="others">Others</option>
          </select>
        </div>
        <div className="col-md-2">
          <button
            className="btn btn-primary w-100"
            onClick={fetchPriceTrend}
          >
            Search
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && <div className="alert alert-info">Loading...</div>}

      {/* Error */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Line Chart */}
      {!loading && data.length > 0 && (
        <div className="card p-3">
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="year"
                type="category"
                allowDuplicatedCategory={false}
              />

              <YAxis
                dataKey="price"
              />

              <Tooltip formatter={(value) => `₹ ${value}`} />

              <Area
                type="monotone"
                dataKey="price"
                stroke="#0d6efd"
                fill="#0d6efd"
                fillOpacity={0.3}
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>

        </div>
      )}

      {!loading && data.length === 0 && !error && (
        <div className="alert alert-warning">
          No data available
        </div>
      )}
    </div>
  );
}

export default Pricetrend;
