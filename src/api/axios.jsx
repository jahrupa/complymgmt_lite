
// session expired

import axios from "axios";
import { decryptData } from "../page/utils/encrypt";
import { PAGE_ACCESS_DENIED, pageNameFromUrl } from "../page/utils/pageAccessEvents";
import { LOGIN_API } from "./Endpoint";
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
    } catch {
      return config; // decrypt error occurred, skip
    }

    if (local_token) {
      config.headers.Authorization = `Bearer ${local_token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// 401 messages from middleware/jwt.go and the handlers' "no user on the request" checks
const SESSION_ERRORS = ["Unauthorized", "Invalid token claims", "Invalid user", "Login First", "Login first", "Invalid JWT Token"];

// Response interceptor - handle expired token
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const response = error.response;

    // Not every 401 is a dead session: handlers also use it for "No access to update the resource",
    // and the login call for wrong credentials. Only these messages mean the user must log in again.
    if (
      response?.data?.message === "Token expired or invalid" ||
      (response?.status === 401 &&
        !error.config?.url?.endsWith(LOGIN_API) &&
        SESSION_ERRORS.includes(response?.data?.message))
    ) {
      localStorage.removeItem("authToken");
      window.location.href = "/"; // redirect to login
    }

    // A refused read means the user can't view that page; RequirePageAccess listens for this
    if (response?.status === 403 && error.config?.method === "get") {
      const page = pageNameFromUrl(error.config.url);
      if (page) window.dispatchEvent(new CustomEvent(PAGE_ACCESS_DENIED, { detail: page }));
    }

    return Promise.reject(error);
  }
);

export default API;
