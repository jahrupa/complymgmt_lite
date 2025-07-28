// axiosConfig.js
import axios from "axios";
const API = axios.create({
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



// axiosConfig.js
// import axios from "axios";

// export const API_ServiceA = axios.create({
//   baseURL: "http://192.168.1.225:3001",
//   headers: {
//     "Content-Type": "application/json",
//     "Cache-Control": "no-cache",
//   },
// });

// export const API_ServiceB = axios.create({
//   baseURL: "http://192.168.1.240:8000",
//   headers: {
//     "Content-Type": "application/json",
//     "Cache-Control": "no-cache",
//   },
// });


// const attachInterceptors = (instance) => {
//   instance.interceptors.request.use(
//     (config) => {
//       const token = localStorage.getItem("token");
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//       return config;
//     },
//     (error) => Promise.reject(error)
//   );

//   instance.interceptors.response.use(
//     (response) => response,
//     (error) => {
//       console.error("API Error:", error.response);
//       return Promise.reject(error);
//     }
//   );
// };


// attachInterceptors(API_ServiceA);
// attachInterceptors(API_ServiceB);


// export default API_ServiceA;
