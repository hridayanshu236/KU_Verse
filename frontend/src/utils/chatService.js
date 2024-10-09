
import axios from "axios";

export const fetchChats = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/chat/mychats", {
      withCredentials: true,
    });
    return response.data; 
  } catch (error) {
    throw new Error("Failed to fetch chats. Please try again later.");
  }
};
