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
    <div className="container mt-4">

      <h3 className="mb-3">Price Trend (Line Chart)</h3>

      {/* Location Input */}
      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
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
              className="list-group position-absolute w-100 shadow"
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
          <select
            className="form-select"
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
            className="btn btn-primary w-100"
            onClick={() =>
              fetchPriceTrend(location, property_type, price_metric, year)}
          >
            Search
          </button>
        </div>
      </div>

      <div className="d-flex gap-2 mb-2">
        {[
          { key: "weighted", label: "Weighted Avg" },
          { key: "p50", label: "50th %" },
          { key: "p75", label: "75th %" },
          { key: "p90", label: "90th %" },
        ].map((m) => (
          <button
            key={m.key}
            type="button"
            className={`btn ${price_metric === m.key ? "btn-success" : "btn-outline-success"
              }`}
            onClick={() => setPriceMetric(m.key)}
          >
            {m.label}
          </button>
        ))}
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
