import { useState } from "react";
import { useLocations } from "../../hooks/useLocations";
import { usePriceTrend } from "../../hooks/usePriceTrend";

import PriceTrendFilters from "./PriceTrendFilters";
import MetricSelector from "./MetricSelector";
import PriceTrendChart from "./PriceTrendChart";

function Pricetrend() {
  const locations = useLocations();
  const { data, loading, error, fetchTrend } = usePriceTrend();
  const [priceMetric, setPriceMetric] = useState("weighted");

  return (
    <div className="container py-4">

      <h3 className="fw-semibold mb-1">Price Trend</h3>
      <p className="text-muted mb-3">
        Analyze historical price movement
      </p>

      <PriceTrendFilters
        locations={locations}
        onSearch={(params) =>
          fetchTrend({ ...params, price_metric: priceMetric })
        }
      />

      <MetricSelector
        value={priceMetric}
        onChange={setPriceMetric}
      />

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-danger">{error}</p>}
      {!loading && data.length > 0 && <PriceTrendChart data={data} />}
      {!loading && data.length === 0 && !error && (
        <p className="text-center text-muted">No data available</p>
      )}
    </div>
  );
}

export default Pricetrend;
