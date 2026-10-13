import axios from "axios";
import API_BASE_URL from "../apiConfig";

// Create Axios instance
// const api = axios.create({
//   baseURL: `${API_BASE_URL}/api`,
//   headers: { "Content-Type": "application/json" },
// });

// Attach token from localStorage if available (for persistence)
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Register user
export async function registerUser(userData) {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/api/register`, userData);
    return data;
  } catch (error) {
    console.error("Registration failed:", error.response?.data || error.message);
    throw error;
  }
}

// Login user
export async function loginUser(credentials) {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/api/login`, credentials);

    if (data?.token) {
      // Save token and update Axios headers
      localStorage.setItem("token", data.token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    }

    return data;
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error;
  }
}
