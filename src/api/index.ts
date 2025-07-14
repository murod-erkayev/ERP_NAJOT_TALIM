import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const access_token = localStorage.getItem("access_token");
  if (access_token) {
    config.headers["Authorization"] = `Bearer ${access_token}`;
  }
  return config;
});

// Token mavjudligini tekshirish
const checkTokenValidity = () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    window.location.href = "/login";
    return false;
  }

  // Token formatini tekshirish (ixtiyoriy)
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("access_token");
      window.location.href = "/login";
      return false;
    }
  } catch (e) {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
    return false;
  }

  return true;
};
export default axiosInstance;
