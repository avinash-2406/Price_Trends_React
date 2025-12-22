import { useState, useEffect } from "react";
import { useLocations } from "../../hooks/useLocations";
import { usePriceTrend } from "../../hooks/usePriceTrend";

import { useSearchParams } from "react-router-dom";


import PriceTrendFilters from "./PriceTrendFilters";
import MetricSelector from "./MetricSelector";
import PriceTrendChart from "./PriceTrendChart";

function Pricetrend() {
    const locations = useLocations();
    const { data, loading, error, fetchTrend } = usePriceTrend();

    const [searchParams, setSearchParams] = useSearchParams();

    // 🔹 Initialize metric from URL
    const [priceMetric, setPriceMetric] = useState(
        searchParams.get("price_metric") || "weighted"
    );

    // 🔹 Fetch data on page refresh (URL → API)
    useEffect(() => {
        const location = searchParams.get("location");
        const property_type = searchParams.get("property_type");
        const year = searchParams.get("year");
        const price_metric = searchParams.get("price_metric");

        if (location && property_type && price_metric) {
            fetchTrend({
                location,
                property_type,
                year,
                price_metric,
            });
        }
    }, []);

    // 🔹 When Search button is clicked
    const handleSearch = (params) => {
        const finalParams = {
            ...params,
            price_metric: priceMetric,
        };

        // update URL
        setSearchParams(finalParams);

        // fetch API
        fetchTrend(finalParams);
    };

    // 🔹 When metric changes
    const handleMetricChange = (metric) => {
        setPriceMetric(metric);

        const updatedParams = Object.fromEntries(searchParams.entries());
        updatedParams.price_metric = metric;

        setSearchParams(updatedParams);

        // refetch only if search already happened
        if (updatedParams.location) {
            fetchTrend(updatedParams);
        }
    };




    return (
        <div className="container py-4">

            <h3 className="fw-semibold mb-1">Price Trend</h3>
            <p className="text-muted mb-3">
                Analyze historical price movement
            </p>

            <PriceTrendFilters
                locations={locations}
                onSearch={handleSearch}
                defaultValues={{
                    location: searchParams.get("location") || "",
                    propertyType: searchParams.get("property_type") || "flat",
                    year: searchParams.get("year") || "",
                }}
            />
            <MetricSelector
                value={priceMetric}
                onChange={handleMetricChange}
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
