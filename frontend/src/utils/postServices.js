import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/post";

// Helper function to format user info
const formatUserInfo = (user) => {
  if (!user) {
    return {
      Name: "Anonymous",
      Department: "No Department",
      image: "/default-profile-image.png",
    };
  }

  return {
    Name: user.fullName || "Anonymous",
    Department: user.department || "No Department",
    image: user.profilePicture || "/default-profile-image.png",
  };
};

// Transform post data for frontend use
const transformPostData = (post) => ({
  _id: post._id,
  caption: post.caption || "",
  image: {
    url: post.image?.url || "/default-post-image.png",
    public_id: post.image?.public_id || "",
  },
  user: formatUserInfo(post.user),
  upvotes: post.upvotes || [],
  downvotes: post.downvotes || [],
  comments: post.comments || [],
  createdAt: post.createdAt || new Date().toISOString(),
});

// Fetch posts (feed, friend, or personal)
export const fetchPosts = async ({ id = null, type = "feed" } = {}) => {
  try {
    let endpoint;

    switch (type) {
      case "friend":
        endpoint = id
          ? `${API_BASE_URL}/friendposts/${id}`
          : `${API_BASE_URL}/feedposts`;
        break;
      case "myposts":
        endpoint = `${API_BASE_URL}/myposts`;
        break;
      default:
        endpoint = `${API_BASE_URL}/feedposts`;
    }

    const response = await axios.get(endpoint, {
      withCredentials: true,
    });

    const posts = response.data.posts || [];

    return posts.map(transformPostData);
  } catch (error) {
    console.error("Failed to fetch posts:", error.response?.data || error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch posts. Please try again."
    );
  }
};

// Create a new post
export const createPost = async (postData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/createpost`, postData, {
      withCredentials: true,
    });

    const post = response.data.post;
    return transformPostData(post);
  } catch (error) {
    console.error("Failed to create post:", error.response?.data || error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to create post. Please try again."
    );
  }
};

// Upvote Post
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
    console.error("Failed to upvote post:", error.response?.data || error);
    throw new Error("Failed to upvote. Try again.");
  }
};

// Downvote Post
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
    console.error("Failed to downvote post:", error.response?.data || error);
    throw new Error("Failed to downvote. Try again.");
  }
};

// Comment on Post
export const commentOnPost = async (postId, commentText) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/comment/${postId}`,
      { comment: commentText },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to comment on post:", error.response?.data || error);
    throw new Error("Failed to add comment. Please try again.");
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
