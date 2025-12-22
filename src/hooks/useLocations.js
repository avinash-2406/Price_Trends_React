import { useEffect, useState } from "react";
import { fetchAllLocationsAPI } from "../services/priceTrend.service";

export const useLocations = () => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetchAllLocationsAPI()
      .then(res => setLocations(res.data))
      .catch(err => console.error(err));
  }, []);

  return locations;
};
