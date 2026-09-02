import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

api.interceptors.request.use(config => {
  try {
    const stored = localStorage.getItem("bts-auth");
    if (stored) {
      const { token } = JSON.parse(stored);
      if (token) config.headers["Authorization"] = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    const status = err.response?.status;
    const url = err.config?.url || "";
    if (status === 401 && !url.includes("/auth/login")) {
      localStorage.removeItem("bts-auth");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
