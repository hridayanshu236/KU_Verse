import React, { useState, useEffect } from "react";
import {
  fetchFriendList,
  fetchUserProfile,
  updateUserProfile,
  addFriend,
  removeFriend,
} from "../utils/userServices";
import {
  fetchPosts,
  upvotePost,
  downvotePost,
  commentOnPost,
} from "../utils/postServices";
import Navbar from "../components/Navbar";
import Posts from "../components/Posts";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [editing, setEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});
  const [posts, setPosts] = useState([]);
  const [searchFriend, setSearchFriend] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile
  const loadProfile = async () => {
    try {
      const userData = await fetchUserProfile();
      setUser(userData);
      setUpdatedProfile(userData);
      console.log("User profile loaded successfully", userData);
    } catch (error) {
      console.error(
        "An error occurred while fetching the user profile.",
        error
      );
      setError("Failed to load profile");
    }
  };

  // Fetch user's friends
  const loadFriends = async () => {
    try {
      const friendData = await fetchFriendList();
      setFriends(friendData);
    } catch (error) {
      console.error("Failed to load friends:", error.message);
      setError("Failed to load friends");
    }
  };

  // Fetch user's posts
  const loadPosts = async () => {
    try {
      const postList = await fetchPosts({ type: "myposts" });
      console.log("Posts loaded successfully", postList);
      if (Array.isArray(postList)) {
        setPosts(postList);
      } else {
        console.error("Expected array of posts but received:", typeof postList);
        setError("Invalid posts data format");
      }
    } catch (error) {
      console.error("Error loading posts:", error);
      setError(error.message);
    }
  };

  // Save profile changes
  const saveProfile = async () => {
    try {
      await updateUserProfile(updatedProfile);
      await loadProfile();
      setEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error.message);
      setError("Failed to update profile");
    }
  };

  // Handle friend removal
  const handleRemoveFriend = async (friendId) => {
    try {
      await removeFriend(friendId);
      await loadFriends();
    } catch (error) {
      console.error("Failed to remove friend:", error.message);
      setError("Failed to remove friend");
    }
  };

  // Handle post upvote
  const handleUpvote = async (postId) => {
    try {
      const updatedPost = await upvotePost(postId);
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === postId ? updatedPost : post))
      );
    } catch (error) {
      console.error("Failed to upvote post:", error.message);
    }
  };

  // Handle post downvote
  const handleDownvote = async (postId) => {
    try {
      const updatedPost = await downvotePost(postId);
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === postId ? updatedPost : post))
      );
    } catch (error) {
      console.error("Failed to downvote post:", error.message);
    }
  };

  // Handle post comment
  const handleComment = async (postId, comment) => {
    try {
      const updatedPost = await commentOnPost(postId, comment);
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === postId ? updatedPost : post))
      );
    } catch (error) {
      console.error("Failed to add comment:", error.message);
    }
  };

  // Load all data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([loadPosts(), loadProfile(), loadFriends()]);
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">Error loading profile</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4 flex flex-col items-center">
        {/* User Information Section */}
        <div className="w-full md:w-3/5 lg:w-1/2 bg-white rounded-lg shadow-md p-6 mt-6">
          <div className="flex items-center gap-6">
            <img
              src={user.profilePicture || "⁦https://via.placeholder.com/150⁩"}
              alt="Profile"
              className="w-24 h-24 rounded-full shadow-md border-4 border-blue-500"
            />
            {editing ? (
              <div className="flex flex-col flex-1 gap-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={updatedProfile.fullName || ""}
                  onChange={(e) =>
                    setUpdatedProfile({
                      ...updatedProfile,
                      fullName: e.target.value,
                    })
                  }
                  className="border p-2 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Department"
                  value={updatedProfile.department || ""}
                  onChange={(e) =>
                    setUpdatedProfile({
                      ...updatedProfile,
                      department: e.target.value,
                    })
                  }
                  className="border p-2 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Bio"
                  value={updatedProfile.bio || ""}
                  onChange={(e) =>
                    setUpdatedProfile({
                      ...updatedProfile,
                      bio: e.target.value,
                    })
                  }
                  className="border p-2 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : (
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-blue-600">
                  {user.fullName}
                </h1>
                <p className="text-md text-gray-600 font-medium mt-1">
                  {user.department}
                </p>
                <p className="text-gray-700 mt-3">
                  {user.bio || "No bio available."}
                </p>
                <p className="text-gray-600 mt-2">
                  <strong>Address:</strong> {user.address}
                </p>
                <p className="text-gray-600">
                  <strong>Phone:</strong> {user.phoneNumber}
                </p>
                <p className="text-gray-600">
                  <strong>Date of Birth:</strong>{" "}
                  {new Date(user.dateofBirth).toDateString()}
                </p>
              </div>
            )}
            <button
              className={`ml-auto px-4 py-2 rounded-lg text-sm font-semibold shadow ${
                editing
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
              onClick={() => (editing ? saveProfile() : setEditing(true))}
            >
              {editing ? "Save" : "Edit"}
            </button>
          </div>
        </div>

        {/* Friends Section */}
        <div className="w-full md:w-3/5 lg:w-1/2 bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Friends</h2>
          <input
            type="text"
            placeholder="Search Friends"
            value={searchFriend}
            onChange={(e) => setSearchFriend(e.target.value)}
            className="border p-2 rounded w-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {friends
              .filter((friend) =>
                friend.fullName
                  .toLowerCase()
                  .includes(searchFriend.toLowerCase())
              )
              .map((friend) => (
                <div
                  key={friend._id}
                  className="flex flex-col items-center bg-gray-50 p-3 rounded border shadow hover:shadow-md transition-shadow duration-200"
                >
                  <img
                    src={
                      friend.profilePicture || "⁦https://via.placeholder.com/150⁩"
                    }
                    alt="Friend"
                    className="w-14 h-14 rounded-full mb-1 shadow-md"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {friend.fullName}
                  </span>
                  <button
                    onClick={() => handleRemoveFriend(friend._id)}
                    className="text-red-500 text-xs mt-2 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Posts Section */}
        <div className="w-full md:w-3/5 lg:w-1/2 bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Your Posts
          </h2>
          {error && (
            <p className="text-red-500 mb-4">Error loading posts: {error}</p>
          )}
          {posts.length === 0 ? (
            <p className="text-md text-gray-500">No posts to display.</p>
          ) : (
            <Posts
              posts={posts}
              onUpvote={handleUpvote}
              onDownvote={handleDownvote}
              onComment={handleComment}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;