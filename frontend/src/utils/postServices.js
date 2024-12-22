// postServices.js
import axios from "axios";
import { fetchUserProfile } from "./userServices";

const API_BASE_URL = "http://localhost:5000/api/post";

export const fetchPosts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/posts`, {
      withCredentials: true,
    });

    // Fetch current user profile data
    const userProfile = await fetchUserProfile(); // Fetch the user profile

    // Transform the response to ensure all required fields exist
    const transformedPosts = response.data.posts.map((post) => ({
      _id: post._id,
      caption: post.caption || "",
      image: {
        url: post.image?.url || "/default-post-image.png",
        public_id: post.image?.public_id || "",
      },
      user: {
        Name: post.user?.fullName || userProfile.fullName || "Anonymous", // Using fullName from the post or current user profile
        Department:
          post.user?.department || userProfile.department || "No Department", // Using department
        image:
          post.user?.profilePicture ||
          userProfile.profilePicture ||
          "/default-profile-image.png", // Using profilePicture
        short_name: post.user?.userName || userProfile.userName || "Anon", // Using userName as a short name
        shortDepart: post.user?.department || userProfile.department || "N/A", // Using department for shortDepart
      },
      upvotes: post.upvotes || [],
      downvotes: post.downvotes || [],
      comments: post.comments || [],
      createdAt: post.createdAt || new Date().toISOString(),
    }));

    return transformedPosts;
  } catch (error) {
    throw new Error("Failed to fetch posts. Please try again later.");
  }
};

export const createPost = async (postData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/createpost`, postData, {
      withCredentials: true,
    });

    // Transform the created post data
    const post = response.data.post;
    return {
      _id: post._id,
      caption: post.caption || "",
      image: {
        url: post.image?.url || "/default-post-image.png",
        public_id: post.image?.public_id || "",
      },
      user: {
        Name: post.user?.Name || "Anonymous",
        Department: post.user?.Department || "No Department",
        image: post.user?.image || "/default-profile-image.png",
        short_name: post.user?.short_name || "Anon",
        shortDepart: post.user?.shortDepart || "N/A",
      },
      upvotes: post.upvotes || [],
      downvotes: post.downvotes || [],
      comments: post.commentt || [],
      createdAt: post.time || new Date().toISOString(),
    };
  } catch (error) {
    throw new Error("Failed to create post. Please try again later.");
  }
};

export const deletePost = async (postId) => {
  try {
    await axios.delete(`${API_BASE_URL}/deletepost/${postId}`, {
      withCredentials: true,
    });
  } catch (error) {
    throw new Error("Failed to delete post. Please try again later.");
  }
};

export const upvotePost = async (postId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/upvote/${postId}`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to upvote post. Please try again later.");
  }
};

export const downvotePost = async (postId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/downvote/${postId}`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to downvote post. Please try again later.");
  }
};

export const commentOnPost = async (postId, comment) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/comment/${postId}`,
      { comment },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to comment on post. Please try again later.");
  }
};

export const deleteComment = async (postId, commentId) => {
  try {
    await axios.delete(`${API_BASE_URL}/deletecomment/${postId}`, {
      data: { commentId },
      withCredentials: true,
    });
  } catch (error) {
    throw new Error("Failed to delete comment. Please try again later.");
  }
};

export const updateCaption = async (postId, newCaption) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/updatecaption/${postId}`,
      { newCaption },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to update caption. Please try again later.");
  }
};
