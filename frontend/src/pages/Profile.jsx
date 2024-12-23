import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Posts from "../components/Posts";
import {
  fetchFriendList,
  fetchUserProfile,
  fetchOtherUserProfile,
  updateUserProfile,
  removeFriend,
} from "../utils/userServices";
import {
  fetchPosts,
  upvotePost,
  downvotePost,
  commentOnPost,
} from "../utils/postServices";

const Profile = () => {
  const { id: userId } = useParams();
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editing, setEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const isCurrentUser = !userId || userId === "undefined";

  // Redirect to profile page without ID if userId is undefined
  useEffect(() => {
    console.log("userId", userId);
    if (userId === "undefined") {
      navigate("/profile");
    }
  }, [userId, navigate]);

  const loadProfile = async () => {
    try {
      const userData = isCurrentUser
        ? await fetchUserProfile()
        : await fetchOtherUserProfile(userId);
      setUser(userData);
      if (isCurrentUser) setUpdatedProfile(userData);
    } catch (error) {
      console.error("Failed to fetch profile:", error.message);
      setError("Failed to load profile");
      if (!isCurrentUser) {
        navigate("/profile");
      }
    }
  };

  const loadFriends = async () => {
    if (!isCurrentUser) return;
    try {
      const friendData = await fetchFriendList();
      setFriends(friendData);
      setFilteredFriends(friendData);
    } catch (error) {
      console.error("Failed to load friends:", error.message);
      setError("Failed to load friends");
    }
  };

  const loadPosts = async () => {
    try {
      const postList = await fetchPosts({
        type: isCurrentUser ? "myposts" : "friend",
        id: isCurrentUser ? undefined : userId,
      });
      setPosts(postList);
    } catch (error) {
      console.error("Error loading posts:", error.message);
      setError("Failed to load posts");
    }
  };

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

  const handleRemoveFriend = async (friendId, event) => {
    event.stopPropagation();
    try {
      await removeFriend(friendId);
      await loadFriends();
    } catch (error) {
      console.error("Failed to remove friend:", error.message);
      setError("Failed to remove friend");
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = friends.filter((friend) =>
        friend.fullName.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredFriends(filtered);
    } else {
      setFilteredFriends(friends);
    }
  };

const navigateToProfile = (friendId) => {
  if (!friendId || friendId === "undefined") {
    navigate("/profile");
  } else {
    navigate(`/profile/${friendId}`);
  }
};
  const handleUpvote = async (postId) => {
    try {
      await upvotePost(postId);
      await loadPosts();
    } catch (error) {
      console.error("Failed to upvote post:", error.message);
    }
  };

  const handleDownvote = async (postId) => {
    try {
      await downvotePost(postId);
      await loadPosts();
    } catch (error) {
      console.error("Failed to downvote post:", error.message);
    }
  };

  const handleComment = async (postId, comment) => {
    try {
      await commentOnPost(postId, comment);
      await loadPosts();
    } catch (error) {
      console.error("Failed to comment on post:", error.message);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([loadProfile(), loadPosts(), loadFriends()]);
      } catch (error) {
        console.error("Error loading data:", error.message);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    if (!userId || userId !== "undefined") {
      loadData();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">User not found</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4 flex flex-col items-center">
        {/* Profile Section */}
        <div className="w-full md:w-3/5 lg:w-1/2 bg-white rounded-lg shadow-lg p-6 mt-6">
          <div className="flex items-center gap-6">
            <img
              src={user.profilePicture || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-24 h-24 rounded-full shadow-md border-4 border-blue-500 object-cover"
            />
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
              <div className="space-y-2 mt-2">
                <p key="address" className="text-gray-600">
                  <strong>Address:</strong> {user.address || "N/A"}
                </p>
                <p key="phone" className="text-gray-600">
                  <strong>Phone:</strong> {user.phoneNumber || "N/A"}
                </p>
                <p key="email" className="text-gray-600">
                  <strong>Email:</strong> {user.email || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Friends Section */}
        {isCurrentUser && (
          <div className="w-full md:w-3/5 lg:w-1/2 bg-white rounded-lg shadow-lg p-6 mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Friends</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search friends..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-64 px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {filteredFriends.length === 0 ? (
              <div className="text-center py-8">
                <UserCircle className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-500">No friends found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredFriends.map((friend) => (
                  <div
                    key={`friend-${friend._id}`}
                    className="group relative bg-white rounded-xl border border-gray-100 p-4 transition-all duration-200 hover:shadow-md cursor-pointer"
                    onClick={() => navigateToProfile(friend._id)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          src={
                            friend.profilePicture ||
                            "https://via.placeholder.com/40"
                          }
                          alt={friend.fullName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {friend.fullName}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {friend.department || "No department"}
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleRemoveFriend(friend.id, e)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Posts Section */}
        <div className="w-full md:w-3/5 lg:w-1/2 bg-white rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {isCurrentUser ? "Your Posts" : `${user.fullName}'s Posts`}
          </h2>
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
