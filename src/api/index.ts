import axios from "axios";
import { ClearItem, GetItem } from "../helper/storages";
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const access_token = GetItem("access_token");
  if (access_token) {
    config.headers["Authorization"] = `Bearer ${access_token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status == 401) {
      window.location.href = "/";
      ClearItem();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
