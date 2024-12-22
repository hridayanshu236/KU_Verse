import React, { useState, useEffect } from "react";
import {
  fetchFriendList,
  fetchUserProfile,
  updateUserProfile,
  addFriend,
  removeFriend,
} from "../utils/userServices";
import { fetchPosts } from "../utils/postServices";
import Navbar from "../components/Navbar";
import Posts from "../components/Posts";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [editing, setEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});
  const [posts, setPosts] = useState([]);
  const [searchFriend, setSearchFriend] = useState("");

  // Fetch user profile
  const loadProfile = async () => {
    try {
      const userData = await fetchUserProfile();
      setUser(userData);
      setUpdatedProfile(userData);
    } catch (error) {
      console.error(error.message);
    }
  };

  // Fetch user's friends
  const loadFriends = async () => {
    try {
      const friendData = await fetchFriendList();
      setFriends(friendData);
    } catch (error) {
      console.error(error.message);
    }
  };

  // Fetch user's posts
  const loadPosts = async () => {
    try {
      const postList = await fetchPosts();
      setPosts(postList);
    } catch (error) {
      console.error(error.message);
    }
  };

  const saveProfile = async () => {
    try {
      await updateUserProfile(updatedProfile);
      loadProfile();
      setEditing(false);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      await removeFriend(friendId);
      loadFriends();
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    loadProfile();
    loadFriends();
    loadPosts();
  }, []);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-100">
      <Navbar />
      <div className="flex flex-col items-center mt-6 px-4">
        {/* User Information Section */}
        <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-6">
            <img
              src={user.profilePicture || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-20 h-20 rounded-full shadow-lg border-2 border-blue-500"
            />
            {editing ? (
              <div className="flex flex-col flex-1">
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
                  className="border p-2 rounded bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="border p-2 rounded bg-gray-50 text-gray-800 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="border p-2 rounded bg-gray-50 text-gray-800 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : (
              <div>
                <h1 className="text-2xl font-bold text-blue-600">
                  {user.fullName}
                </h1>
                <p className="text-sm text-gray-600 font-medium">
                  {user.department}
                </p>
                <p className="text-sm text-gray-700 mt-2">{user.bio || ""}</p>
                <p className="text-sm text-gray-600">
                  <strong>Address:</strong> {user.address}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Phone:</strong> {user.phoneNumber}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Date of Birth:</strong>{" "}
                  {new Date(user.dateofBirth).toDateString()}
                </p>
              </div>
            )}
            <button
              className="ml-auto bg-blue-500 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-blue-600 shadow-md"
              onClick={() => (editing ? saveProfile() : setEditing(true))}
            >
              {editing ? "Save" : "Edit Profile"}
            </button>
          </div>
        </div>

        {/* Friends Section */}
        <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 mt-6 border border-gray-200">
          <h2 className="text-xl font-bold text-green-600 mb-4">Friends</h2>
          <input
            type="text"
            placeholder="Search Friends"
            value={searchFriend}
            onChange={(e) => setSearchFriend(e.target.value)}
            className="border p-2 rounded w-full mb-4 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <div className="grid grid-cols-4 gap-4">
            {friends
              .filter((friend) =>
                friend.fullName
                  .toLowerCase()
                  .includes(searchFriend.toLowerCase())
              )
              .map((friend) => (
                <div
                  key={friend._id}
                  className="flex flex-col items-center bg-gray-50 p-4 rounded-lg border shadow hover:shadow-lg transition-shadow duration-200"
                >
                  <img
                    src={
                      friend.profilePicture || "https://via.placeholder.com/150"
                    }
                    alt="Friend"
                    className="w-16 h-16 rounded-full mb-2 shadow-sm"
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
        <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 mt-6 border border-gray-200">
          <h2 className="text-xl font-bold text-blue-600 mb-4">Your Posts</h2>
          {posts.length === 0 ? (
            <p className="text-sm text-gray-500">No posts to display.</p>
          ) : (
            posts.map((post) => <Posts key={post._id} {...post} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
