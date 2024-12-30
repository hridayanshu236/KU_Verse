import React, { useState, useEffect } from "react";
import { Bookmark } from "@mui/icons-material";
import axios from "axios";
import { useUser } from "../contexts/userContext";

const API_BASE_URL = "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const BookmarkButton = ({ postId, onBookmark }) => {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [newGroup, setNewGroup] = useState("");
  const [bookmarkGroups, setBookmarkGroups] = useState([]);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
  });
  useEffect(() => {
    if (isOpen && user) {
      fetchBookmarkGroups();
    }
  }, [isOpen, user]);

  const fetchBookmarkGroups = async () => {
    try {
      setLoading(true);
      if (!user) {
        setError("Please log in to view bookmarks");
        return;
      }

      const response = await axiosInstance.get("/bookmarks/groups");

      if (response.data) {
        setBookmarkGroups(response.data);
        setError(null);
      }
    } catch (error) {
      console.error("Failed to fetch bookmark groups:", error);
      setError("Failed to load bookmark groups");
    } finally {
      setLoading(false);
    }
  };

  const createNewGroup = async () => {
    if (!newGroup.trim()) return;

    try {
      setLoading(true);
      if (!user) {
        setError("Please log in to create bookmarks");
        return;
      }

      const groupResponse = await axiosInstance.post("/bookmarks/groups", {
        name: newGroup,
      });

      if (groupResponse.data) {
        await handleBookmark(newGroup);
        await fetchBookmarkGroups();
        setNewGroup("");
        setIsCreatingNew(false);
        setError(null);
      }
    } catch (error) {
      console.error("Failed to create group:", error);
      setError("Failed to create bookmark group");
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async (groupName) => {
    try {
      setLoading(true);
      if (!user) {
        setError("Please log in to bookmark posts");
        return;
      }

      const response = await axiosInstance.post("/bookmarks", {
        postId,
        groupName,
      });

      if (response.status === 200 || response.status === 201) {
        setIsOpen(false);
        onBookmark?.();
        setError(null);
      }
    } catch (error) {
      console.error("Failed to bookmark post:", error);
      if (
        error.response?.status === 400 &&
        error.response?.data?.message?.includes("already")
      ) {
        setNotification({
          show: true,
          message: `Post is already saved in "${groupName}"`,
        });

        setTimeout(() => {
          setNotification({ show: false, message: "" });
        }, 3000);
      } else {
        setError("Failed to bookmark post");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    if (!user) {
      setError("Please log in to use bookmarks");
      return;
    }
    setIsOpen(true);
  };

  return (
    <div className="relative">
      <div
        className="hover:bg-slate-200 w-[40px] h-[40px] md:w-[50px] md:h-[50px] flex items-center justify-center"
        onClick={handleOpenModal}
        role="button"
        tabIndex={0}
      >
        <Bookmark className="w-5 h-5 md:w-6 md:h-6" />
      </div>

      {/* Error Message */}
      {error && (
        <div className="absolute bottom-[-20px] left-0 text-red-500 text-xs whitespace-nowrap z-50">
          {error}
        </div>
      )}

      {/* Already Bookmarked Notification */}
      {notification.show && (
        <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg px-4 py-3 z-50 animate-slide-in">
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0">
              <Bookmark className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-sm text-gray-600">{notification.message}</p>
            <button
              onClick={() => setNotification({ show: false, message: "" })}
              className="ml-4 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Bookmark Modal */}
      {isOpen && user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Save Post</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : isCreatingNew ? (
                <div>
                  <input
                    type="text"
                    value={newGroup}
                    onChange={(e) => setNewGroup(e.target.value)}
                    placeholder="Enter group name"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={createNewGroup}
                      disabled={loading}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                    >
                      Create & Save
                    </button>
                    <button
                      onClick={() => setIsCreatingNew(false)}
                      disabled={loading}
                      className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {bookmarkGroups.map((group) => (
                      <button
                        key={group._id}
                        onClick={() => handleBookmark(group.name)}
                        disabled={loading}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 rounded-md disabled:opacity-50"
                      >
                        {group.name}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setIsCreatingNew(true)}
                    disabled={loading}
                    className="w-full px-4 py-2 text-blue-500 border border-blue-500 rounded-md hover:bg-blue-50 disabled:opacity-50"
                  >
                    Create New Group
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookmarkButton;
