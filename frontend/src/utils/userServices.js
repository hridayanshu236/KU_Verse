import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/user";

export const fetchFriendList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/friendlist`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch friend list. Please try again later.");
  }
};

export const fetchUserProfile = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/myprofile`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch user profile. Please try again later.");
  }
};

export const updateUserProfile = async (updates) => {
  try {
    await axios.put(`${API_BASE_URL}/updateprofile`, updates, {
      withCredentials: true,
    });
  } catch (error) {
    throw new Error("Failed to update profile. Please try again later.");
  }
};

export const updatePassword = async (passwords) => {
  try {
    await axios.put(`${API_BASE_URL}/updatepassword`, passwords, {
      withCredentials: true,
    });
  } catch (error) {
    throw new Error("Failed to update password. Please try again later.");
  }
};

export const addFriend = async (friendId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/friend/${friendId}`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to add friend. Please try again later.");
  }
};

export const removeFriend = async (friendId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/unfriend/${friendId}`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to remove friend. Please try again later.");
  }
};
