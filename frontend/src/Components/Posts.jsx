import React, { useState, useEffect } from "react";
import {
  upvotePost,
  downvotePost,
  commentOnPost,
  fetchCommentsByPostId,
} from "../utils/postServices";
import {
  ArrowUpward,
  ArrowDownward,
  Comment,
  Share,
} from "@mui/icons-material";
import BookmarkButton from "./BookmarkButton";
import { useUser } from "../contexts/userContext";
const CommentSection = ({ userProfile, postId, comments, onComment }) => {
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onComment(postId, comment);
      setComment("");
    }
  };
  const { user } = useUser();
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
        {comments.map((comment) => (
          <div key={comment._id} className="flex gap-3">
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
          </div>
        ))}
      </div>
    </div>
  );
};

const Posts = ({ posts: initialPosts }) => {
  const [localPosts, setLocalPosts] = useState(
    initialPosts.map((post) => ({
      ...post,
      voteCount:
        post.voteCount || post.upvotes?.length - post.downvotes?.length || 0,
    }))
  );

  const handleVote = async (postId, isUpvote) => {
    const voteFunction = isUpvote ? upvotePost : downvotePost;

    try {
      const updatedPost = await voteFunction(postId);

      setLocalPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                voteCount: updatedPost.voteCount,
                upvotes: updatedPost.upvotes,
                downvotes: updatedPost.downvotes,
              }
            : post
        )
      );
    } catch (error) {
      console.error(`Failed to ${isUpvote ? "upvote" : "downvote"}:`, error);
    }
  };

  const handleComment = async (postId, comment) => {
    try {
      const newComment = await commentOnPost(postId, comment);
      setLocalPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, commentt: [...post.commentt, newComment] }
            : post
        )
      );
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  // Update localPosts when initialPosts changes
  useEffect(() => {
    setLocalPosts(
      initialPosts.map((post) => ({
        ...post,
        voteCount:
          post.voteCount || post.upvotes?.length - post.downvotes?.length || 0,
      }))
    );
  }, [initialPosts]);

  return (
    <div className="flex flex-col gap-4 w-full">
      {localPosts.length === 0 ? (
        <div className="text-center text-gray-500">No posts available</div>
      ) : (
        localPosts.map((post) => {
          const [showComments, setShowComments] = useState(false);
          const userHasUpvoted = post.upvotes?.includes(
            localStorage.getItem("userId")
          );
          const userHasDownvoted = post.downvotes?.includes(
            localStorage.getItem("userId")
          );

          useEffect(() => {
            if (showComments) {
              fetchCommentsByPostId(post._id)
                .then((comments) => {
                  setLocalPosts((prevPosts) =>
                    prevPosts.map((p) =>
                      p._id === post._id ? { ...p, commentt: comments } : p
                    )
                  );
                })
                .catch((error) =>
                  console.error("Failed to fetch comments:", error)
                );
            }
          }, [showComments, post._id]);
          return (
            <div
              key={post._id}
              className="flex justify-center my-2 w-full px-2 md:px-4 min-w-[400px]"
            >
              <div className="flex flex-col h-auto w-full max-w-[640px] min-w-[280px] rounded p-2 border border-gray-200 shadow-sm">
                {/* User Info Section - Keep as is */}
                <div className="bg-green-100 flex-1 rounded-t-lg mb-1 flex justify-center">
                  <div className="items-center flex flex-col p-2 m-1 justify-center">
                    <img
                      src={post.user.profilePicture || "/api/placeholder/70/70"}
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
                        <p className="text-gray-800 text-center font-semibold  text-sm md:text-base leading-relaxed">
                          {post.caption}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Post Content Section */}
                <div className="flex-[2] flex items-center justify-center rounded-b-lg">
                  {post.image?.url && (
                    <img
                      src={post.image.url}
                      alt="Post content"
                      className="min-h-[300px] min-w-[300px] max-h-[500px] w-full h-auto object-contain"
                    />
                  )}
                </div>

                {/* Action Buttons Section - Keep as is */}
                <div className="flex flex-row justify-between px-2 items-center mt-2">
                  <button
                    type="button"
                    className={`hover:bg-slate-200 w-[40px] h-[40px] md:w-[50px] md:h-[50px] flex items-center justify-center ${
                      userHasUpvoted ? "text-blue-500" : ""
                    }`}
                    onClick={() => handleVote(post._id, true)}
                    disabled={userHasUpvoted}
                  >
                    <ArrowUpward className="w-5 h-5 md:w-6 md:h-6" />
                  </button>

                  <span className="text-blue-500 font-semibold mx-2 text-sm md:text-base">
                    {typeof post.voteCount === "number" ? post.voteCount : 0}
                  </span>

                  <button
                    type="button"
                    className={`hover:bg-slate-200 w-[40px] h-[40px] md:w-[50px] md:h-[50px] flex items-center justify-center ${
                      userHasDownvoted ? "text-red-500" : ""
                    }`}
                    onClick={() => handleVote(post._id, false)}
                    disabled={userHasDownvoted}
                  >
                    <ArrowDownward className="w-5 h-5 md:w-6 md:h-6" />
                  </button>

                  <button
                    type="button"
                    className="hover:bg-slate-200 w-[40px] h-[40px] md:w-[50px] md:h-[50px] flex items-center justify-center"
                    onClick={() => setShowComments(!showComments)}
                  >
                    <Comment className="w-5 h-5 md:w-6 md:h-6" />
                  </button>

                  <button
                    type="button"
                    className="hover:bg-slate-200 w-[40px] h-[40px] md:w-[50px] md:h-[50px] flex items-center justify-center"
                  >
                    <Share className="w-5 h-5 md:w-6 md:h-6" />
                  </button>

                  <BookmarkButton postId={post._id} onBookmark={() => {}} />
                </div>

                {/* Comments Section - Keep as is */}
                {showComments && (
                  <CommentSection
                    userProfile={post.user}
                    postId={post._id}
                    comments={post.commentt || []}
                    onComment={handleComment}
                  />
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Posts;
