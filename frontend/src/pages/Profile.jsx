import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  UserCircle,
  UserPlus,
  UserMinus,
  UserCheck,
  Search,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Posts from "../components/Posts";
import {
  fetchFriendList,
  fetchUserProfile,
  fetchOtherUserProfile,
  updateUserProfile,
  removeFriend,
  addFriend,
} from "../utils/userServices";
import {
  fetchPosts,
  upvotePost,
  downvotePost,
  commentOnPost,
} from "../utils/postServices";

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-sm w-full m-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="flex justify-center items-center h-screen">
    <div className="text-red-500">{message}</div>
  </div>
);

const ConnectionButton = ({ status, onConnect, onDisconnect }) => {
  if (status === "NOT_CONNECTED") {
    return (
      <button
        onClick={onConnect}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
      >
        <UserPlus className="w-4 h-4" />
        Connect
      </button>
    );
  }

  return (
    <button
      onClick={onDisconnect}
      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
    >
      <UserCheck className="w-4 h-4" />
      Connected
    </button>
  );
};

const FriendCard = ({ friend, onNavigate, onRemove }) => (
  <div
    className="group relative bg-white rounded-xl border border-gray-100 p-4 transition-all duration-200 hover:shadow-md cursor-pointer"
    onClick={() => onNavigate(friend._id)}
  >
    <div className="flex items-center space-x-4">
      <img
        src={friend.profilePicture || "https://via.placeholder.com/40"}
        alt={friend.fullName}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {friend.fullName}
        </p>
        <p className="text-sm text-gray-500 truncate">
          {friend.department || "No department"}
        </p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(friend);
        }}
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full"
      >
        <UserMinus className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const ProfileInfo = ({
  user,
  isCurrentUser,
  connectionStatus,
  onConnect,
  onDisconnect,
}) => (
  <div className="w-full md:w-3/5 lg:w-1/2 bg-white rounded-lg shadow-lg p-6 mt-6">
    <div className="flex items-center gap-6">
      <img
        src={user.profilePicture || "https://via.placeholder.com/150"}
        alt="Profile"
        className="w-24 h-24 rounded-full shadow-md border-4 border-blue-500 object-cover"
      />
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">
              {user.fullName}
            </h1>
            <p className="text-md text-gray-600 font-medium mt-1">
              {user.department}
            </p>
          </div>
          {!isCurrentUser && (
            <ConnectionButton
              status={connectionStatus}
              onConnect={onConnect}
              onDisconnect={onDisconnect}
            />
          )}
        </div>
        <p className="text-gray-700 mt-3">{user.bio || "No bio available."}</p>
        <div className="space-y-2 mt-2">
          <p className="text-gray-600">
            <strong>Address:</strong> {user.address || "N/A"}
          </p>
          <p className="text-gray-600">
            <strong>Phone:</strong> {user.phoneNumber || "N/A"}
          </p>
          <p className="text-gray-600">
            <strong>Email:</strong> {user.email || "N/A"}
          </p>
        </div>
      </div>
    </div>
  </div>
);

const Profile = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();
  const isCurrentUser = !userId || userId === "undefined";

  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("NOT_CONNECTED");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [connections, setConnections] = useState(new Set());

  useEffect(() => {
    if (userId === "undefined") navigate("/profile");
  }, [userId, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load user data
      const userData = isCurrentUser
        ? await fetchUserProfile()
        : await fetchOtherUserProfile(userId);
      setUser(userData);

      // Load and process friends list
      const friendData = await fetchFriendList();
      if (isCurrentUser) {
        setFriends(friendData);
        setFilteredFriends(friendData);
      }

      // Update connections set and status
      const friendIds = new Set(friendData.map((friend) => friend._id));
      setConnections(friendIds);
      if (!isCurrentUser) {
        setConnectionStatus(
          friendIds.has(userId) ? "CONNECTED" : "NOT_CONNECTED"
        );
      }

      // Load posts
      const postList = await fetchPosts({
        type: isCurrentUser ? "myposts" : "friend",
        id: isCurrentUser ? undefined : userId,
      });
      setPosts(postList);
    } catch (error) {
      console.error("Error loading data:", error);
      setError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId || userId !== "undefined") {
      loadData();
    }
  }, [userId]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setFilteredFriends(
      query
        ? friends.filter((friend) =>
            friend.fullName.toLowerCase().includes(query.toLowerCase())
          )
        : friends
    );
  };

  const handleConnect = async () => {
    try {
      await addFriend(userId);
      setConnectionStatus("CONNECTED");
      setConnections((prev) => new Set([...prev, userId]));
      await loadData();
    } catch (error) {
      console.error("Failed to connect:", error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await removeFriend(userId);
      setConnectionStatus("NOT_CONNECTED");
      setConnections((prev) => {
        const newConnections = new Set(prev);
        newConnections.delete(userId);
        return newConnections;
      });
      await loadData();
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  };

  const handleRemoveFriend = async () => {
    if (selectedFriend) {
      try {
        await removeFriend(selectedFriend._id);
        await loadData();
        setShowConfirmDialog(false);
        setSelectedFriend(null);
      } catch (error) {
        console.error("Failed to remove friend:", error);
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!user) return <ErrorMessage message="User not found" />;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4 flex flex-col items-center">
        <ProfileInfo
          user={user}
          isCurrentUser={isCurrentUser}
          connectionStatus={connectionStatus}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
        />

        {isCurrentUser && (
          <div className="w-full md:w-3/5 lg:w-1/2 bg-white rounded-lg shadow-lg p-6 mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Connections
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search connections..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-64 pl-9 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {filteredFriends.length === 0 ? (
              <div className="text-center py-8">
                <UserCircle className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-500">No connections found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredFriends.map((friend) => (
                  <FriendCard
                    key={friend._id}
                    friend={friend}
                    onNavigate={(id) => navigate(`/profile/${id}`)}
                    onRemove={(friend) => {
                      setSelectedFriend(friend);
                      setShowConfirmDialog(true);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="w-full md:w-3/5 lg:w-1/2 bg-white rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {isCurrentUser ? "Your Posts" : `${user.fullName}'s Posts`}
          </h2>
          {posts.length === 0 ? (
            <p className="text-md text-gray-500">No posts to display.</p>
          ) : (
            <Posts
              posts={posts}
              onUpvote={upvotePost}
              onDownvote={downvotePost}
              onComment={commentOnPost}
            />
          )}
        </div>

        <ConfirmDialog
          isOpen={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
          onConfirm={handleRemoveFriend}
          title="Remove Connection"
          message={`Are you sure you want to remove ${selectedFriend?.fullName} from your connections?`}
        />
      </div>
    </div>
  );
};

export default Profile;
