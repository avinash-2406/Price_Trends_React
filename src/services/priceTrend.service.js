import axios from "axios";

export const fetchPriceTrendAPI = ({ location, property_type, price_metric, year }) => {
  let url = `http://localhost:8000/api/price-trend/?final_location=${location}&property_type=${property_type}&price_metric=${price_metric}`;
  if (year) url += `&year=${year}`;
  return axios.get(url);
};

export const fetchAllLocationsAPI = () => {
  return axios.get("http://localhost:8000/api/getall_locations/");
};
