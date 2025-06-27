// axiosConfig.js
import axios from "axios";

const API = axios.create({
  // baseURL: "http://192.168.1.240:3000", // Change to your API URL
  // baseURL: "http://192.168.1.226:3000", // Change to your API URL
  baseURL: "http://192.168.1.225:3001",
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
    console.error("API Error:", error.response);
    return Promise.reject(error);
  }
);

export default API;
