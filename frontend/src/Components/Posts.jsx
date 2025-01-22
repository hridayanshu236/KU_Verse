import React, { useState, useEffect } from "react";
import {
  upvotePost,
  downvotePost,
  commentOnPost,
  fetchCommentsByPostId,
  deletePost,
  deleteComment,
} from "../utils/postServices";
import {
  Trash,
  ArrowUp,
  ArrowDown,
  MessageSquare,
  Share2,
  MoreHorizontal,
} from "lucide-react";
import BookmarkButton from "./BookmarkButton";
import { useUser } from "../contexts/userContext";
import axios from "axios";
import EditModal from "./EditModal";

const API_BASE_URL = "http://localhost:5000/api/post"; // Ensure this URL is correct for your backend

const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this post? This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 transition-colors text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 transition-colors text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
const CommentSection = ({
  userProfile,
  postId,
  comments,
  onComment,
  onDeleteComment,
}) => {
  const [comment, setComment] = useState("");
  const { user } = useUser();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onComment(postId, comment);
      setComment("");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await onDeleteComment(postId, commentId);
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 mt-2 border-t border-gray-200">
      <div className="flex gap-3 mb-4">
        <img
          src={user.profilePicture || "/api/placeholder/32/32"}
          alt="Profile"
          className="w-8 h-8 rounded-full"
        />
        <form onSubmit={handleSubmit} className="flex-1">
          <div className="flex gap-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 rounded-full px-4 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              type="submit"
              className="px-4 py-2 text-blue-600 font-semibold hover:bg-blue-50 rounded-full"
            >
              Post
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-3">
        {comments?.map((comment) => (
          <div key={comment._id} className="flex gap-3 items-center">
            <img
              src={comment.user?.profilePicture || "/api/placeholder/32/32"}
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1">
              <div className="bg-gray-100 rounded-2xl px-4 py-2">
                <div className="font-semibold">
                  {comment.user?.fullName || "Anonymous"}
                </div>
                <div>{comment.comment}</div>
              </div>
              <div className="text-xs text-gray-500 mt-1 ml-4">
                {new Date(comment.time).toLocaleString()}
              </div>
            </div>
            {/* Show delete button if current user owns the comment */}
            {comment.user?._id === user?._id && (
              <button
                onClick={() => handleDeleteComment(comment._id)}
                className="text-red-500 hover:text-red-700 ml-2 text-sm"
              >
                <Trash className="h-5 w-5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const Posts = ({ posts: initialPosts }) => {
  const { user } = useUser();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [postToEdit, setPostToEdit] = useState(null);
  const [menuOpen, setMenuOpen] = useState({});
  const [localPosts, setLocalPosts] = useState(() =>
    initialPosts.map((post) => ({
      ...post,
      voteCount:
        post.voteCount ??
        (post.upvotes?.length || 0) - (post.downvotes?.length || 0),
      userVoteStatus: post.upvotes?.includes(user?._id)
        ? "upvoted"
        : post.downvotes?.includes(user?._id)
        ? "downvoted"
        : "none",
      showComments: false,
      commentt: post.commentt || [],
      time: post.time || new Date().toISOString(),
    }))
  );

  useEffect(() => {
    if (!user) {
      console.log("User Context is not available.");
    }
  }, [user]);

  useEffect(() => {
    if (!initialPosts || !user) return;

    const processedPosts = initialPosts.map((post) => ({
      ...post,
      voteCount:
        post.voteCount ??
        (post.upvotes?.length || 0) - (post.downvotes?.length || 0),
      userVoteStatus: post.upvotes?.includes(user?._id)
        ? "upvoted"
        : post.downvotes?.includes(user?._id)
        ? "downvoted"
        : "none",
      showComments: false,
      commentt: post.commentt || [],
      time: post.time || new Date().toISOString(),
    }));

    setLocalPosts(processedPosts);
  }, [initialPosts, user]);

  const handleDeleteClick = (postId) => {
    setPostToDelete(postId);
    setIsDeleteModalOpen(true);
    setMenuOpen({});
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;

    try {
      await deletePost(postToDelete);
      setLocalPosts((prevPosts) =>
        prevPosts.filter((post) => post._id !== postToDelete)
      );
      setIsDeleteModalOpen(false);
      setPostToDelete(null);
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setPostToDelete(null);
  };

  const handleEditClick = (post) => {
    setPostToEdit(post);
    setIsEditModalOpen(true);
    setMenuOpen({});
  };
  const handleDeleteComment = async (postId, commentId) => {
    try {
      await deleteComment(postId, commentId);
      setLocalPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                commentt: post.commentt.filter(
                  (comment) => comment._id !== commentId
                ),
              }
            : post
        )
      );
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };
  const handleEditSubmit = async (formData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/editpost/${postToEdit._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      setLocalPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postToEdit._id
            ? { ...post, ...response.data.post, user: post.user }
            : post
        )
      );

      setIsEditModalOpen(false);
      setPostToEdit(null);
    } catch (error) {
      console.error("Failed to edit post:", error);
    }
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    setPostToEdit(null);
  };

  const handleVote = async (postId, isUpvote) => {
    const currentPost = localPosts.find((post) => post._id === postId);
    if (!currentPost) return;

    const previousState = { ...currentPost };

    const newVoteStatus = isUpvote ? "upvoted" : "downvoted";
    const oppositeVoteStatus = isUpvote ? "downvoted" : "upvoted";
    const isRemovingVote = currentPost.userVoteStatus === newVoteStatus;

    setLocalPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post._id !== postId) return post;

        let updatedVoteCount = post.voteCount;
        if (isRemovingVote) {
          updatedVoteCount += isUpvote ? -1 : 1;
        } else {
          updatedVoteCount +=
            post.userVoteStatus === oppositeVoteStatus
              ? isUpvote
                ? 1
                : -1
              : isUpvote
              ? 1
              : -1;
        }

        return {
          ...post,
          voteCount: updatedVoteCount,
          userVoteStatus: isRemovingVote ? "none" : newVoteStatus,
        };
      })
    );

    try {
      const voteFunction = isUpvote ? upvotePost : downvotePost;
      const updatedPost = await voteFunction(postId);

      setLocalPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                voteCount: updatedPost.voteCount,
                userVoteStatus: updatedPost.upvotes.includes(user._id)
                  ? "upvoted"
                  : updatedPost.downvotes.includes(user._id)
                  ? "downvoted"
                  : "none",
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error updating vote:", error);
      setLocalPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === postId ? previousState : post))
      );
    }
  };

  const handleComment = async (postId, commentText) => {
    try {
      const response = await commentOnPost(postId, commentText);

      const newComment = {
        _id: response._id,
        comment: commentText,
        time: new Date().toISOString(),
        user: {
          _id: user._id,
          fullName: user.fullName,
          profilePicture: user.profilePicture,
          department: user.department,
        },
      };

      setLocalPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post._id === postId) {
            return {
              ...post,
              commentt: [...(post.commentt || []), newComment],
            };
          }
          return post;
        })
      );
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const toggleComments = async (postId) => {
    const post = localPosts.find((p) => p._id === postId);

    setLocalPosts((prevPosts) =>
      prevPosts.map((p) =>
        p._id === postId
          ? {
              ...p,
              showComments: !p.showComments,
            }
          : p
      )
    );

    if (!post.showComments && (!post.commentt || post.commentt.length === 0)) {
      try {
        const comments = await fetchCommentsByPostId(postId);
        setLocalPosts((prevPosts) =>
          prevPosts.map((p) =>
            p._id === postId ? { ...p, commentt: comments } : p
          )
        );
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    }
  };

  const handleMenuToggle = (postId) => {
    setMenuOpen((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  useEffect(() => {
    setLocalPosts(
      initialPosts.map((post) => ({
        ...post,
        voteCount:
          post.voteCount ??
          (post.upvotes?.length || 0) - (post.downvotes?.length || 0),
        userVoteStatus: post.upvotes?.includes(user?._id)
          ? "upvoted"
          : post.downvotes?.includes(user?._id)
          ? "downvoted"
          : "none",
        showComments: false,
        commentt: post.commentt || [],
      }))
    );
  }, [initialPosts, user?._id]);

  return (
    <>
      <div className="flex flex-col gap-4 w-full">
        {localPosts.length === 0 ? (
          <div className="text-center text-gray-500">No posts available</div>
        ) : (
          localPosts.map((post) => {
            const currentUser = useUser();
            const isPostOwner = () => {
              if (post?.user?.id && currentUser?.user?._id) {
                return (
                  post.user.id.toString() === currentUser.user._id.toString()
                );
              }
              return false;
            };
            return (
              <div
                key={post._id}
                className="flex justify-center my-2 w-full px-2 md:px-4 min-w-[400px]"
              >
                <div className="flex flex-col h-auto w-full max-w-[640px] min-w-[280px] rounded p-2 border border-gray-200 shadow-sm">
                  {isEditModalOpen &&
                  postToEdit &&
                  post._id === postToEdit._id ? (
                    <EditModal
                      isOpen={isEditModalOpen}
                      onClose={handleEditCancel}
                      onSubmit={handleEditSubmit}
                      initialData={postToEdit}
                    />
                  ) : (
                    <>
                      <div className="bg-green-100 flex-1 rounded-t-lg mb-1 flex justify-center relative">
                        {isPostOwner() && (
                          <div className="absolute top-2 right-2">
                            <div className="relative">
                              <button
                                type="button"
                                className="p-2 rounded-full hover:bg-gray-200"
                                onClick={() => handleMenuToggle(post._id)}
                              >
                                <MoreHorizontal className="w-5 h-5 text-gray-500" />
                              </button>
                              {menuOpen[post._id] && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                  <button
                                    type="button"
                                    onClick={() => handleEditClick(post)}
                                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteClick(post._id)}
                                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        <div className="items-center flex flex-col p-2 m-1 justify-center">
                          <img
                            src={
                              post.user.profilePicture ||
                              "/api/placeholder/70/70"
                            }
                            className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] rounded-full"
                            alt="Profile_picture"
                          />
                          <span className="text-black font-semibold text-sm md:text-base w-full text-center overflow-hidden text-ellipsis whitespace-nowrap">
                            {post.user.fullName}
                          </span>
                          <span className="text-gray-900 font-light text-xs md:text-sm w-full text-center overflow-hidden text-ellipsis whitespace-nowrap">
                            {post.user.department}
                          </span>
                          <span className="text-gray-400 font-extralight text-xs">
                            {post.time
                              ? new Date(post.time).toLocaleString()
                              : "Time unavailable"}
                          </span>
                          {post.caption && (
                            <div className="border-t border-green-100 pt-2">
                              <p className="text-gray-800 text-center font-semibold text-sm md:text-base leading-relaxed">
                                {post.caption}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex-[2] flex items-center justify-center rounded-b-lg">
                        {post.image?.url && (
                          <img
                            src={post.image.url}
                            alt="Post content"
                            className="min-h-[300px] min-w-[300px] max-h-[500px] w-full h-auto object-contain"
                          />
                        )}
                      </div>

                      <div className="flex flex-row justify-between px-2 items-center mt-2">
                        <button
                          type="button"
                          className={`hover:bg-slate-200 w-[40px] h-[40px] md:w-[50px] md:h-[50px] flex items-center justify-center rounded-full
                            ${
                              post.userVoteStatus === "upvoted"
                                ? "bg-blue-100"
                                : ""
                            }`}
                          onClick={() => handleVote(post._id, true)}
                        >
                          <ArrowUp
                            className={`w-5 h-5 md:w-6 md:h-6 
                              ${
                                post.userVoteStatus === "upvoted"
                                  ? "text-blue-500"
                                  : "text-gray-500"
                              }`}
                          />
                        </button>

                        <span
                          className={`font-semibold mx-2 text-sm md:text-base
                            ${
                              post.userVoteStatus === "upvoted"
                                ? "text-blue-500"
                                : post.userVoteStatus === "downvoted"
                                ? "text-red-500"
                                : "text-gray-500"
                            }`}
                        >
                          {post.voteCount}
                        </span>

                        <button
                          type="button"
                          className={`hover:bg-slate-200 w-[40px] h-[40px] md:w-[50px] md:h-[50px] flex items-center justify-center rounded-full
                            ${
                              post.userVoteStatus === "downvoted"
                                ? "bg-red-100"
                                : ""
                            }`}
                          onClick={() => handleVote(post._id, false)}
                        >
                          <ArrowDown
                            className={`w-5 h-5 md:w-6 md:h-6 
                              ${
                                post.userVoteStatus === "downvoted"
                                  ? "text-red-500"
                                  : "text-gray-500"
                              }`}
                          />
                        </button>

                        <button
                          type="button"
                          className="hover:bg-slate-200 w-[40px] h-[40px] md:w-[50px] md:h-[50px] flex items-center justify-center"
                          onClick={() => toggleComments(post._id)}
                        >
                          <MessageSquare className="w-5 h-5 md:w-6 md:h-6" />
                        </button>

                        <button
                          type="button"
                          className="hover:bg-slate-200 w-[40px] h-[40px] md:w-[50px] md:h-[50px] flex items-center justify-center"
                        >
                          <Share2 className="w-5 h-5 md:w-6 md:h-6" />
                        </button>

                        <BookmarkButton
                          postId={post._id}
                          onBookmark={() => {}}
                        />
                      </div>

                      {post.showComments && (
                        <CommentSection
                          userProfile={post.user}
                          postId={post._id}
                          comments={post.commentt || []}
                          onComment={handleComment}
                          onDeleteComment={handleDeleteComment} // Pass the handleDeleteComment function
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default Posts;
