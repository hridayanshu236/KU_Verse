import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/bookmarks";
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export const addPostToBookmarkGroup = async (groupName, postId) => {
  try {
    const response = await axiosInstance.post("/bookmarks", {
      groupName,
      postId,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to add post to bookmark group:", error);
    throw error;
  }
};
export const getGroupPosts = async (groupId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/bookmarks/groups/${groupId}/posts`
    );
    return response.data.posts;
  } catch (error) {
    console.error("Failed to fetch posts from bookmark group:", error);
    throw error;
  }
};
