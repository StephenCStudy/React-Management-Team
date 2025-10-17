import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api", // thay bằng URL backend của bạn
  headers: {
    "Content-Type": "application/json",
  },
});

// interceptor để thêm token nếu có
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error);
    throw error;
  }
);

export default axiosClient;
