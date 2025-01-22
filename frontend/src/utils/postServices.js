import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/post";

const formatUserInfo = (user) => {
  if (!user) {
    return {
      fullName: "Anonymous",
      department: "No Department",
      profilePicture: "/default-profile-image.png",
    };
  }

  return {
    fullName: user.fullName || "Anonymous",
    department: user.department?.trim() || "No Department",
    profilePicture: user.profilePicture || "/default-profile-image.png",
    id: user._id,
  };
};

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
  time: post.time || new Date().toISOString(),
});

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

    const response = await axios.get(endpoint, { withCredentials: true });
    return response.data.posts.map(transformPostData);
  } catch (error) {
    handleError(error, "Failed to fetch posts");
  }
};

export const createPost = async (postData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/createpost`, postData, {
      withCredentials: true,
    });
    return transformPostData(response.data.post);
  } catch (error) {
    handleError(error, "Failed to create post");
  }
};

export const upvotePost = async (postId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/upvote/${postId}`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    handleError(error, "Failed to upvote post");
  }
};

export const downvotePost = async (postId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/downvote/${postId}`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    handleError(error, "Failed to downvote post");
  }
};

export const commentOnPost = async (postId, commentText) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/comment/${postId}`,
      { comment: commentText },
      { withCredentials: true }
    );
    return response.data.comment;
  } catch (error) {
    handleError(error, "Failed to add comment");
  }
};

export const deletePost = async (postId) => {
  try {
    await axios.delete(`${API_BASE_URL}/deletepost/${postId}`, {
      withCredentials: true,
    });
  } catch (error) {
    handleError(error, "Failed to delete post");
  }
};

export const deleteComment = async (postId, commentId) => {
  try {
    await axios.delete(`${API_BASE_URL}/deletecomment/${postId}`, {
      data: { commentId },
      withCredentials: true,
    });
  } catch (error) {
    handleError(error, "Failed to delete comment");
  }
};

export const fetchCommentsByPostId = async (postId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${postId}/comments`, {
      withCredentials: true,
    });
    return response.data.comments;
  } catch (error) {
    handleError(error, "Failed to fetch comments");
  }
};

export const updateCaption = async (postId, newCaption) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/updatecaption/${postId}`,
      { newCaption },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    handleError(error, "Failed to update caption");
  }
};

export const fetchPostUserInfo = async (postId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${postId}`, {
      withCredentials: true,
    });
    const post = response.data.post;
    return {
      ...transformPostData(post).user,
      createdAt: post.time || new Date().toISOString(),
    };
  } catch (error) {
    handleError(error, "Failed to fetch post user info");
  }
};

export const editPost = async (postId, postData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/editpost/${postId}`,
      postData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    return transformPostData(response.data.post);
  } catch (error) {
    handleError(error, "Failed to edit post");
  }
};

const handleError = (error, defaultMessage) => {
  console.error(`${defaultMessage}:`, error.response?.data || error);
  throw new Error(error.response?.data?.message || defaultMessage);
};
