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
    if (error.response) {
      switch (error.response.status) {
        case 401:
          toast.error("Session Expired", {
            description: "Your session has expired or is invalid. Please log in again.",
            id: "session-expired",
          });
          break;
        case 409:
          toast.error("Concurrency Conflict", {
            description: "Another admin has modified this data. Please refresh to get the latest data.",
            id: "concurrency-conflict",
          });
          break;
        default: {
          const message = error.response.data?.message || "An unexpected error occurred.";
          toast.error(message);
          break;
        }
      }
    } else {
      toast.error("Network error. Please check your connection.");
    }
    return Promise.reject(error);
  },
);
