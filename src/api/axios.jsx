import axios from "axios";

const isDev = window.location.hostname === "localhost" || window.location.hostname === "192.168.1.225";
const baseURL = isDev
  ? "http://192.168.1.225:3001"
  : "https://api.complymgmt.ai";

const API = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
  },
});


API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default API;
