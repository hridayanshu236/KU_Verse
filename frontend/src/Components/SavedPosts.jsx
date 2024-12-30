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
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="fixed top-0 w-full z-50 shadow-sm">
        <Navbar />
      </div>

      <div className="pt-20 pb-12 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-purple-800 mb-3">
              Your Saved Posts
            </h1>
            <p className="text-purple-600 text-lg">
              Organize and manage your bookmarked content
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-8 mx-auto">
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8 w-full">
            {/* Sidebar */}
            <div className="lg:w-1/4 w-full">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24 border border-purple-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-purple-800">
                    Collections
                  </h3>
                  <span className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
                    {bookmarkGroups.length}
                  </span>
                </div>

                <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-2">
                  {bookmarkGroups.length > 0 ? (
                    bookmarkGroups.map((group) => (
                      <button
                        key={group._id}
                        onClick={() => setSelectedGroup(group)}
                        className={`w-full px-5 py-4 text-left rounded-xl transition-all duration-200 flex items-center gap-3
                          ${
                            selectedGroup?._id === group._id
                              ? "bg-purple-600 text-white shadow-lg"
                              : "hover:bg-purple-50 text-gray-700 hover:text-purple-800 hover:shadow-sm"
                          }`}
                      >
                        <BookmarkAdd className="w-5 h-5" />
                        <span className="font-medium">{group.name}</span>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-10 bg-purple-50 rounded-xl px-6">
                      <BookmarkAdd className="w-16 h-16 text-purple-300 mx-auto mb-4" />
                      <p className="text-purple-800 font-medium mb-2">
                        No collections yet
                      </p>
                      <p className="text-sm text-purple-600">
                        Bookmark posts to create collections
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:w-3/4 w-full">
              {selectedGroup ? (
                loading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                      <h2 className="text-2xl font-semibold text-purple-800 mb-2">
                        {selectedGroup.name}
                      </h2>
                      <p className="text-purple-600">
                        {posts.length} saved{" "}
                        {posts.length === 1 ? "post" : "posts"}
                      </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md">
                      <Posts posts={posts} onPostRemoved={handlePostRemoved} />
                    </div>
                  </div>
                )
              ) : (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                  <BookmarkAdd className="w-20 h-20 text-purple-200 mx-auto mb-6" />
                  <h3 className="text-2xl font-semibold text-purple-800 mb-3">
                    {bookmarkGroups.length > 0
                      ? "Select a collection to view posts"
                      : "Start Your First Collection"}
                  </h3>
                  <p className="text-purple-600 text-lg max-w-md mx-auto">
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
