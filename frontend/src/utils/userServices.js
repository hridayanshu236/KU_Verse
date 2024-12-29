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
export const fetchOtherUserProfile = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/profile/${userId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch user profile. Please try again later.");
  }
};

export const updateUserProfile = async (updates) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/updateprofile`, updates, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Return the response data
    return response.data;
  } catch (error) {
    console.error("Update profile error:", error.response?.data || error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to update profile. Please try again later."
    );
  }
};
export const updateProfilePicture = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/updateDp`, {
      method: "PUT",
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update profile picture");
    }

    const data = await response.json();
    return data.profilePicture;
  } catch (error) {
    console.error("Error updating profile picture:", error);
    throw error;
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

export const fetchRecommendations = async (limit = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/recommendations`, {
      params: { limit },
      withCredentials: true,
    });
    return response.data.recommendations;
  } catch (error) {
    console.error("Recommendation error:", error.response?.data || error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch recommendations. Please try again later."
    );
  }
};

// Optional: Function to update recommendation weights
export const updateRecommendationWeights = async (weights) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/recommendations/weights`,
      weights,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Weight update error:", error.response?.data || error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to update recommendation weights. Please try again later."
    );
  }
};

export const fetchMutualConnections = async (userId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/mutual-connections/${userId}`,
      { withCredentials: true }
    );
    return response.data.mutualConnections;
  } catch (error) {
    console.error("Error fetching mutual connections:", error);
    throw new Error("Failed to fetch mutual connections");
  }
};

export const fetchMutualFriends = async (userId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/mutual-friends/${userId}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching mutual friends:", error);
    throw new Error("Failed to fetch mutual friends");
  }
};
