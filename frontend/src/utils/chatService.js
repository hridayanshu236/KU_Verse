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

export const createChat = async (participants) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/chat/create",
      { participants }, 
      {
        withCredentials: true, 
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error creating chat:", error);
    throw new Error(
      error.response ? error.response.data.message : "Error creating chat"
    );
  }
};
