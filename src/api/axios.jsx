import axios from "axios";

const API = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com", // Change to your API URL
  // baseURL: "http://192.168.1.240:3000", // Change to your API URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
API.interceptors.request.use(
  (config) => {
    // Add Authorization token if needed
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response);
    return Promise.reject(error);
  }
);

export default API;

  