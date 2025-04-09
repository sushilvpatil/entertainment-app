import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL; // Read from .env file

// Check if running in the browser before accessing localStorage
const authToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

const axiosInstanceWithoutToken = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(authToken && { Authorization: `Bearer ${authToken}` }), // Add Authorization header only if token exists
  },
});

export default axiosInstanceWithoutToken;