import axios from "axios";

export const fetchChatMessages = async (chatId) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/chat/${chatId}/messages`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch chat messages");
  }
};

export const sendMessage = async (messageData) => {
  const response = await axios.post(
    `http://localhost:5000/api/chat/${messageData.chatId}/sendMessage`,
    {
      message: messageData.message, 
    },
    { withCredentials: true } 
  );
  return response.data;
};