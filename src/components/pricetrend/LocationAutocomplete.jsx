import { useState } from "react";

function LocationAutocomplete({ value, onChange, locations }) {
  const [show, setShow] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);

  const filtered = locations.filter(loc =>
    loc.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <div className="position-relative">
      <label className="form-label fw-medium">Location</label>
      <input
        type="text"
        className="form-control"
        value={value}
        placeholder="Enter location"
        onChange={(e) => {
          onChange(e.target.value);
          setShow(true);
          setVisibleCount(8);
        }}
        onFocus={() => setShow(true)}
      />

      {show && filtered.length > 0 && (
        <ul
          className="list-group position-absolute w-100 shadow mt-1"
          style={{ maxHeight: 240, overflowY: "auto", zIndex: 1000 }}
          onScroll={(e) => {
            const bottom =
              e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
            if (bottom) setVisibleCount(prev => prev + 8);
          }}
        >
          {filtered.slice(0, visibleCount).map((loc, i) => (
            <li
              key={i}
              className="list-group-item list-group-item-action"
              onClick={() => {
                onChange(loc);
                setShow(false);
              }}
            >
              {loc}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LocationAutocomplete;
