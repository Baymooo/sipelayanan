import axios from "axios";

const getBaseURL = () => {
  // Kalau ada env variable, pakai itu
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  // Kalau production (bukan localhost), pakai URL ALB
  if (window.location.hostname !== "localhost") {
    return `${window.location.protocol}//${window.location.hostname}/api`;
  }
  // Development lokal
  return "http://localhost:3000/api";
};

const api = axios.create({
  baseURL: getBaseURL(),
});

// Otomatis sisipkan token JWT ke setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Kalau 401, logout otomatis
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);

export default api;
