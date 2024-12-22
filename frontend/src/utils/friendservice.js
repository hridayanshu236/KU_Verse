import axios from "axios";

export const fetchFriendList = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/user/friendlist", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch friends. Please try again later.");
  }
};
