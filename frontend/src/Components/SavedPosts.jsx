import React, { useState, useEffect } from "react";
import { Bookmark } from "@mui/icons-material";
import {
  addPostToBookmarkGroup,
  getGroupPosts,
} from "../utils/bookmarkServices";

export const BookmarkButton = ({ postId, onBookmark }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [newGroup, setNewGroup] = useState("");
  const [bookmarkGroups, setBookmarkGroups] = useState([]);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const handleBookmark = async (groupName) => {
    try {
      await addPostToBookmarkGroup(postId, groupName);
      setIsOpen(false);
      onBookmark?.();
    } catch (error) {
      console.error("Failed to bookmark post:", error);
    }
  };

  const createNewGroup = async () => {
    if (!newGroup.trim()) return;
    try {
      const response = await fetch(
        "http://localhost:5000/api/bookmarks/groups",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newGroup,
          }),
        }
      );

      if (response.ok) {
        const group = await response.json();
        setBookmarkGroups([...bookmarkGroups, group]);
        handleBookmark(newGroup);
      } else {
        console.error("Failed to create group:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to create group:", error);
    }
  };

  return (
    <>
      <div
        className="hover:bg-slate-200 w-[40px] h-[40px] md:w-[50px] md:h-[50px] flex items-center justify-center"
        onClick={() => setIsOpen(true)}
        role="button"
        tabIndex={0}
      >
        <Bookmark className="w-5 h-5 md:w-6 md:h-6" />
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md w-96">
            <h2 className="text-xl font-bold mb-4">Save Post</h2>
            <div className="space-y-4">
              {isCreatingNew ? (
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
                      className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                      Create & Save
                    </button>
                    <button
                      onClick={() => setIsCreatingNew(false)}
                      className="px-4 py-2 bg-gray-200 rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    {bookmarkGroups.map((group) => (
                      <button
                        key={group._id}
                        onClick={() => handleBookmark(group.name)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 rounded-md"
                      >
                        {group.name}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setIsCreatingNew(true)}
                    className="w-full px-4 py-2 text-blue-500 border border-blue-500 rounded-md"
                  >
                    Create New Group
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const SavedPosts = () => {
  const [bookmarkGroups, setBookmarkGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchBookmarkGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchGroupPosts(selectedGroup._id);
    }
  }, [selectedGroup]);

  const fetchBookmarkGroups = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/bookmarks/groups"
      );
      if (response.ok) {
        const groups = await response.json();
        setBookmarkGroups(groups);
      } else {
        console.error("Failed to fetch bookmark groups:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to fetch bookmark groups:", error);
    }
  };

  const fetchGroupPosts = async (groupId) => {
    try {
      const posts = await getGroupPosts(groupId);
      setPosts(posts);
    } catch (error) {
      console.error("Failed to fetch group posts:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="border-b pb-4 mb-4">
          <h2 className="text-2xl font-bold">Saved Posts</h2>
        </div>
        <div className="flex gap-4">
          {/* Sidebar with groups */}
          <div className="w-64 border-r pr-4">
            <h3 className="font-semibold mb-4">Groups</h3>
            <div className="space-y-2">
              {bookmarkGroups.map((group) => (
                <button
                  key={group._id}
                  onClick={() => setSelectedGroup(group)}
                  className={`w-full px-4 py-2 text-left rounded-md ${
                    selectedGroup?._id === group._id
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {group.name}
                </button>
              ))}
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1">
            {selectedGroup ? (
              posts.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {posts.map((post) => (
                    <div
                      key={post._id}
                      className="border rounded-lg p-4 hover:shadow-md"
                    >
                      {/* Reuse the existing post display logic */}
                      <div className="flex items-start gap-4">
                        <img
                          src={
                            post.user.profilePicture || "/api/placeholder/48/48"
                          }
                          alt="Profile"
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <h4 className="font-semibold">
                            {post.user.fullName}
                          </h4>
                          <p className="text-gray-600">{post.caption}</p>
                          {post.image?.url && (
                            <img
                              src={post.image.url}
                              alt="Post content"
                              className="mt-2 rounded-lg max-h-48 object-cover"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  No saved posts in this group
                </div>
              )
            ) : (
              <div className="text-center text-gray-500">
                Select a group to view saved posts
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { SavedPosts };
