import axios from "axios";
import { toast } from "sonner";

export const axiosClient = axios.create({
  baseURL: "https://localhost:7242",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      toast.error("Session Expired", {
        description:
          "Your session has expired or is invalid. Please log in again.",
        id: "session-expired",
      });
    }
    return Promise.reject(error);
  },
);
