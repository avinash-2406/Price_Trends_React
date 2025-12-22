const metrics = [
  { key: "weighted", label: "Weighted Avg" },
  { key: "p50", label: "50th %" },
  { key: "p75", label: "75th %" },
  { key: "p90", label: "90th %" },
];

function MetricSelector({ value, onChange }) {
  return (
    <div className="d-flex justify-content-evenly mb-3">
      {metrics.map(m => (
        <button
          key={m.key}
          className={`btn m-2 w-50 ${
            value === m.key ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => onChange(m.key)}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}

export default MetricSelector;
