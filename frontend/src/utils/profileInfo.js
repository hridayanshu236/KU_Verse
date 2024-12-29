import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/profileInfo";

// Get all departments
export const fetchDepartments = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/department`);
    return response.data;
  } catch (error) {
    console.error("Error fetching departments:", error);
    throw error;
  }
};
export const fetchClubs = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/clubs`);
    return response.data;
  } catch (error) {
    console.error("Error fetching clubs:", error);
    throw error;
  }
};
