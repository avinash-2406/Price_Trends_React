import { useState } from "react";
import { fetchPriceTrendAPI } from "../services/priceTrend.service";

export const usePriceTrend = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTrend = async (params) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetchPriceTrendAPI(params);
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchTrend };
};
