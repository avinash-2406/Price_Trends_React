import { useState } from "react";
import LocationAutocomplete from "./LocationAutocomplete";

function PriceTrendFilters({ locations, onSearch }) {
  const [location, setLocation] = useState("");
  const [property_type, setPropertyType] = useState("flat");
  const [price_metric, setPriceMetric] = useState("weighted");
  const [year, setYear] = useState("");

  const yearOptions = [2020, 2021, 2022, 2023];

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <div className="row align-items-end g-3">

          <div className="col-md-4">
            <LocationAutocomplete
              value={location}
              onChange={setLocation}
              locations={locations}
            />
          </div>

          <div className="col-md-2">
            <label className="form-label">Property</label>
            <select
              className="form-select"
              value={property_type}
              onChange={(e) => setPropertyType(e.target.value)}
            >
              <option value="flat">Flat</option>
              <option value="shop">Shop</option>
              <option value="office">Office</option>
              <option value="others">Others</option>
            </select>
          </div>

          <div className="col-md-2">
            <label className="form-label">Year</label>
            <select
              className="form-select"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="">All</option>
              {yearOptions.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <button
              className="btn btn-primary w-100"
              onClick={() =>
                onSearch({ location, property_type, price_metric, year })
              }
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PriceTrendFilters;
