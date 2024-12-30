import React, { useState, useEffect } from "react";
import { useUser } from "../contexts/userContext";
import axios from "axios";
import Posts from "./Posts";
import Navbar from "./Navbar";
import { BookmarkAdd } from "@mui/icons-material";
const API_BASE_URL = "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const SavedPosts = () => {
  const { user, fetchUserDetails } = useUser();
  const [bookmarkGroups, setBookmarkGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        await fetchUserDetails();
      } catch (error) {
        console.error("Error initializing user:", error);
        setError("Failed to authenticate user");
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, [fetchUserDetails]);

  useEffect(() => {
    if (user) {
      fetchBookmarkGroups();
    }
  }, [user]);

  useEffect(() => {
    if (selectedGroup) {
      fetchGroupPosts(selectedGroup._id);
    } else {
      setPosts([]);
    }
  }, [selectedGroup]);

  const fetchBookmarkGroups = async () => {
    try {
      if (!user) {
        setError("Please log in to view bookmarks");
        return;
      }

      const response = await axiosInstance.get("/bookmarks/groups");

      if (response.data) {
        setBookmarkGroups(response.data);
        if (response.data.length > 0 && !selectedGroup) {
          setSelectedGroup(response.data[0]);
        }
        setError(null);
      }
    } catch (error) {
      console.error("Failed to fetch bookmark groups:", error);
      setError(
        error.response?.data?.message || "Failed to fetch bookmark groups"
      );
    }
  };

  const fetchGroupPosts = async (groupId) => {
    setLoading(true);
    try {
      if (!user) {
        setError("Please log in to view posts");
        return;
      }

      const response = await axiosInstance.get(
        `/bookmarks/groups/${groupId}/posts`
      );

      if (response.data && response.data.posts) {
        const processedPosts = response.data.posts.map((post) => ({
          ...post,
          voteCount: post.upvotes?.length - post.downvotes?.length || 0,
          commentt: post.commentt || [],
          time: post.time || post.createdAt,
        }));
        setPosts(processedPosts);
        setError(null);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error("Failed to fetch group posts:", error);
      setError(error.response?.data?.message || "Failed to fetch group posts");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Handler for when a post is removed from bookmarks
  const handlePostRemoved = async (postId) => {
    try {
      await axiosInstance.delete(
        `/bookmarks/groups/${selectedGroup._id}/posts/${postId}`
      );
      setPosts((currentPosts) =>
        currentPosts.filter((post) => post._id !== postId)
      );
    } catch (error) {
      console.error("Failed to remove bookmark:", error);
      setError("Failed to remove post from bookmarks");
    }
  };

  if (loading && !user) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center text-gray-500">
          Please log in to view your saved posts
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="fixed top-0 w-full z-50">
        <Navbar />
      </div>

      <div className="pt-16 pb-8">
        {" "}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800">
              Your Saved Posts
            </h1>
            <p className="text-gray-600 mt-2">
              Organize and manage your bookmarked content
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 max-w-3xl mx-auto">
              {error}
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar - Groups */}
            <div className="md:w-80 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Collections
                  </h3>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {bookmarkGroups.length}
                  </span>
                </div>

                <div className="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto">
                  {bookmarkGroups.length > 0 ? (
                    bookmarkGroups.map((group) => (
                      <button
                        key={group._id}
                        onClick={() => setSelectedGroup(group)}
                        className={`w-full px-4 py-3 text-left rounded-lg transition-all duration-200 flex items-center gap-3
                          ${
                            selectedGroup?._id === group._id
                              ? "bg-green-500 text-white shadow-md"
                              : "hover:bg-green-50 text-gray-700 hover:text-green-700"
                          }`}
                      >
                        <BookmarkAdd className="w-5 h-5" />
                        <span className="font-medium">{group.name}</span>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-green-50 rounded-lg">
                      <BookmarkAdd className="w-12 h-12 text-green-300 mx-auto mb-2" />
                      <p className="text-gray-500">No collections yet</p>
                      <p className="text-sm text-gray-400">
                        Bookmark posts to create collections
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
              {selectedGroup ? (
                loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        {selectedGroup.name}
                      </h2>
                      <p className="text-gray-500 text-sm">
                        {posts.length} saved{" "}
                        {posts.length === 1 ? "post" : "posts"}
                      </p>
                    </div>
                    <Posts posts={posts} onPostRemoved={handlePostRemoved} />
                  </div>
                )
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <BookmarkAdd className="w-16 h-16 text-green-200 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {bookmarkGroups.length > 0
                      ? "Select a collection to view posts"
                      : "Start Your First Collection"}
                  </h3>
                  <p className="text-gray-500">
                    {bookmarkGroups.length > 0
                      ? "Choose a collection from the sidebar to view your saved posts"
                      : "Bookmark posts to create and organize your collections"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedPosts;
