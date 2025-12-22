import { useEffect, useState } from "react";
import axios from "axios"
import { useSearchParams } from "react-router-dom";
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
import "./Pricetrend.css"



function Pricetrend() {
  const [location, setLocation] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [property_type, setPropertyType] = useState("flat")
  const [price_metric, setPriceMetric] = useState("weighted")
  const [error, setError] = useState("");
  const [year, setYear] = useState("");

  const yearOptions = ["", 2020, 2021, 2022, 2023];
  const [input_suggestion_locations, setInput_Suggestion_Locations] = useState([])
  const [show, setShow] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);
  const [searchParams, setSearchParams] = useSearchParams();



  const filteredLocations = input_suggestion_locations.filter((loc) =>
    loc.toLowerCase().includes(location.toLowerCase())
  );

  const fetchPriceTrend = async (location, property_type, price_metric, year) => {
    if (!location.trim()) {
      setError("Please enter location");
      return;
    }

    setSearchParams({
      location,
      property_type,
      price_metric,
      year
    });

    setLoading(true);
    setError("");

    let url = `http://localhost:8000/api/price-trend/?final_location=${location}&property_type=${property_type}&price_metric=${price_metric}`;

    if (year) {
      url += `&year=${year}`;
    }

    try {
      const response = await fetch(url);

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

  const getall_locations = () => {
    axios
      .get("http://localhost:8000/api/getall_locations/")
      .then((res) => {
        setInput_Suggestion_Locations(res.data);
      })
      .catch((err) => {
        console.error(err.message);
      })
      .finally(() => {
        console.log("Get all locations API loaded successfully");
      });
  };


  useEffect(() => {
    getall_locations()
    const locationParam = searchParams.get("location");
    const propertyParam = searchParams.get("property_type");
    const metricParam = searchParams.get("price_metric");
    const yearParam = searchParams.get("year");

    if (locationParam) {
      setLocation(locationParam);
      setPropertyType(propertyParam || "flat");
      setPriceMetric(metricParam || "weighted");
      setYear(yearParam || "");

      fetchPriceTrend(
        locationParam,
        propertyParam,
        metricParam,
        yearParam
      );
    }
  }, []);

  return (
    <div className="container py-4 pricetrend-page">

      <div className="mb-4">
        <h3 className="fw-semibold mb-1">Price Trend</h3>
        <p className="text-muted mb-0">
          Analyze historical price movement by location and property type
        </p>
      </div>
      {/* <h3 className="mb-3">Price Trend (Line Chart)</h3> */}

      <div className="card border-0 shadow-sm mb-4 pricetrend-card">
        <div className="card-body">
          {/* Location Input */}
          <div className="row mb-3 gap-1 justify-content-evenly align-items-center">
            <div className="col-md-4 position-relative">
              <label className="form-label fw-medium">Location</label>
              <input
                type="text"
                className="form-control form-control-md  pricetrend-input"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value)
                  setShow(true)
                  setVisibleCount(8); // reset on new search
                }}
                onFocus={() => setShow(true)}
                placeholder="Enter location"
              />


              {show && filteredLocations.length > 0 && (
                <ul
                  className="list-group position-absolute w-100 shadow rounded-3 mt-1 pricetrend-suggestion"
                  style={{
                    maxHeight: "240px", // ~8 items
                    overflowY: "auto",
                    zIndex: 1000
                  }}
                  onScroll={(e) => {
                    const bottom =
                      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;

                    if (bottom) {
                      setVisibleCount((prev) => prev + 8);
                    }
                  }}
                >
                  {filteredLocations.slice(0, visibleCount).map((loc, index) => (
                    <li
                      key={index}
                      className="list-group-item list-group-item-action"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setLocation(loc);
                        setShow(false);
                      }}
                    >
                      {loc}
                    </li>
                  ))}
                </ul>
              )}

            </div>

            <div className="col-md-2">
              <label className="form-label fw-medium">Property</label>
              <select
                className="form-select form-select-md pricetrend-select"
                onChange={(e) => setPropertyType(e.target.value)}
              >
                <option value="flat">Flat</option>
                <option value="shop">Shop</option>
                <option value="office">Office</option>
                <option value="others">Others</option>
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label fw-medium">Year</label>
              <select
                className="form-select form-select-md pricetrend-select"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                <option value="">All Years</option>
                {yearOptions
                  .filter(Boolean)
                  .map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
              </select>
            </div>

            <div className="col-md-2">
              <button
                className="btn btn-primary w-100 btn-md mt-4"
                onClick={() =>
                  fetchPriceTrend(location, property_type, price_metric, year)}
              >
                Search
              </button>
            </div>
          </div>

          <div className="d-flex  py-2 mb-2 w-100  justify-content-evenly align-items-center">
            {[
              { key: "weighted", label: "Weighted Avg" },
              { key: "p50", label: "50th %" },
              { key: "p75", label: "75th %" },
              { key: "p90", label: "90th %" },
            ].map((m) => (
              <button
                key={m.key}
                type="button"
                className={`btn rounded px-4 w-50 m-2 pop-card ${price_metric === m.key
                  ? "btn-primary"
                  : "btn-outline-primary"
                  }`}
                onClick={() => setPriceMetric(m.key)}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>






      {/* Loading */}
      {loading && <div className="text-center py-5 text-muted">Loading price trend...</div>}

      {/* Error */}
      {error && <div className="text-center py-5 text-muted">{error}</div>}

      {/* Line Chart */}
      {!loading && data.length > 0 && (
        <div className="card border-0 shadow-sm mt-4 pricetrend-card">
          <div className="card-body">

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
            {/* <h5 className="fw-semibold mb-3">Price Trend Overview</h5> */}
          </div>
        </div>
      )}

      {!loading && data.length === 0 && !error && (
        <div className="text-center text-muted py-5">
          No price data available for selected filters
        </div>
      )}
    </div>
  );
}

export default Pricetrend;
