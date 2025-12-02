// import axios from "axios";

// const isDev = window.location.hostname === "localhost" || window.location.hostname === "192.168.1.225";
// const baseURL = isDev
//   ? "http://192.168.1.225:3001"
//   : "https://api.complymgmt.ai";

// const API = axios.create({
//   baseURL,
//   headers: {
//     "Content-Type": "application/json",
//     "Cache-Control": "no-cache",
//   },
// });


// API.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// API.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error("API Error:", error.response || error.message);
//     return Promise.reject(error);
//   }
// );

// export default API;





// session expired

import axios from "axios";
import { decryptData } from "../page/utils/encrypt";
// import { useToken } from "../TokenProvider";
// const isDev = window.location.hostname === "localhost" || window.location.hostname === "192.168.1.225";
// const baseURL = isDev
//   ? "http://192.168.1.225:3001"
//   : "https://api.complymgmt.ai";
const baseURL = import.meta.env.VITE_API_BASE_URL;
const API = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
  },
  //  withCredentials: true, // <--- important for cookies
});

// Request interceptor - set Authorization header
API.interceptors.request.use(
  (config) => {
    const encryptedToken = localStorage.getItem("authToken");

    if (!encryptedToken) {
      return config; // no token found skip
    }

    let local_token;
    try {
      local_token = decryptData(encryptedToken);
    } catch (e) {
      console.error("Token decrypt error:", e);
      return config; // decrypt error occurred, skip
    }

    if (local_token) {
      config.headers.Authorization = `Bearer ${local_token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// Response interceptor - handle expired token
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const response = error.response;

    if (
      response &&
      response.data &&
      response.data.message === "Token expired or invalid"
      // response.status === 401 // Unauthorized
    ) {
      localStorage.removeItem("authToken");
      window.location.href = "/"; // redirect to login
    }

    return Promise.reject(error);
  }
);

export default API;
