import React, { useState, useEffect } from "react";
import {
  upvotePost,
  downvotePost,
  commentOnPost,
  fetchCommentsByPostId,
} from "../utils/postServices";

const CommentSection = ({ userProfile, postId, comments, onComment }) => {
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onComment(postId, comment);
      setComment("");
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 mt-2 border-t border-gray-200">
      <div className="flex gap-3 mb-4">
        <img
          src={userProfile.profilePicture || "/api/placeholder/32/32"}
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

const Posts = ({ posts }) => {
  const [localPosts, setLocalPosts] = useState(posts);

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

  const fetchComments = async (postId) => {
    try {
      const comments = await fetchCommentsByPostId(postId);
      setLocalPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, commentt: comments } : post
        )
      );
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {!localPosts || localPosts.length === 0 ? (
        <div className="text-center text-gray-500">No posts available</div>
      ) : (
        localPosts.map((post) => {
          const [showComments, setShowComments] = useState(false);
          const [voteStatus, setVoteStatus] = useState(null);
          const [voteCount, setVoteCount] = useState(
            (post.upvotes?.length || 0) - (post.downvotes?.length || 0)
          );
          const [isVoting, setIsVoting] = useState(false);

          const handleUpvote = async () => {
            if (voteStatus === "upvoted" || isVoting) return;
            setIsVoting(true);

            setVoteCount((prev) => prev + 1);
            setVoteStatus("upvoted");

            try {
              await upvotePost(post._id);
            } catch (error) {
              console.error("Failed to upvote:", error);
              setVoteCount((prev) => prev - 1);
              setVoteStatus(null);
            } finally {
              setIsVoting(false);
            }
          };

          const handleDownvote = async () => {
            if (voteStatus === "downvoted" || isVoting) return;
            setIsVoting(true);

            setVoteCount((prev) => prev - 1);
            setVoteStatus("downvoted");

            try {
              await downvotePost(post._id);
            } catch (error) {
              console.error("Failed to downvote:", error);
              setVoteCount((prev) => prev + 1);
              setVoteStatus(null);
            } finally {
              setIsVoting(false);
            }
          };

          useEffect(() => {
            if (showComments) {
              fetchComments(post._id);
            }
          }, [showComments]);

          return (
            <div
              key={post._id}
              className="flex justify-center my-2 w-full px-2 md:px-4 min-w-[400px]"
            >
              <div className="flex flex-col h-auto w-full max-w-[640px] min-w-[280px] rounded p-2 border border-gray-200 shadow-sm">
                {/* User Info Section */}
                <div className="bg-green-100 flex-1 rounded-t-lg mb-1 flex justify-center">
                  <div className="items-center flex flex-col p-2 m-1 justify-center">
                    <img
                      src={post.user.profilePicture}
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
                  </div>
                </div>

                {/* Post Content Section */}
                <div className="flex-[2] flex items-center justify-center rounded-b-lg">
                  {console.log(post)}
                  {post.image?.url ? (
                    <img
                      src={post.image.url}
                      alt="Post content"
                      className="min-h-[300px] min-w-[300px] max-h-[500px] w-full h-auto object-contain"
                    />
                  ) : (
                    <div className="font-sans font-medium text-justify p-4 leading-8">
                      <p>{post.caption || "No content available"}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons Section */}
                <div className="flex flex-row justify-between px-2 items-center">
                  <button
                    type="button"
                    className="hover:bg-slate-200 w-[40px] h-[40px] md:w-[50px] md:h-[50px] flex items-center justify-center"
                    onClick={handleUpvote}
                  >
                    <img
                      src="../src/Assets/Post_Components/circle-arrow-up.png"
                      alt="Upvote"
                      className="w-5 h-5 md:w-6 md:h-6"
                    />
                  </button>

                  <span className="text-blue-500 font-semibold mx-2 text-sm md:text-base">
                    {voteCount}
                  </span>

                  <button
                    type="button"
                    className="hover:bg-slate-200 w-[40px] h-[40px] md:w-[50px] md:h-[50px] flex items-center justify-center"
                    onClick={handleDownvote}
                  >
                    <img
                      src="../src/Assets/Post_Components/circle-arrow-down.png"
                      alt="Downvote"
                      className="w-5 h-5 md:w-6 md:h-6"
                    />
                  </button>

                  <button
                    type="button"
                    className="hover:bg-slate-200 w-[40px] h-[40px] md:w-[50px] md:h-[50px] flex items-center justify-center"
                    onClick={() => setShowComments(!showComments)}
                  >
                    <img
                      src="../src/Assets/Post_Components/message-circle.png"
                      alt="Comment"
                      className="w-5 h-5 md:w-6 md:h-6"
                    />
                  </button>

                  <button
                    type="button"
                    className="hover:bg-slate-200 w-[40px] h-[40px] md:w-[50px] md:h-[50px] flex items-center justify-center"
                  >
                    <img
                      src="../src/Assets/Post_Components/share-2.png"
                      alt="Share"
                      className="w-5 h-5 md:w-6 md:h-6"
                    />
                  </button>

                  <button
                    type="button"
                    className="hover:bg-slate-200 w-[40px] h-[40px] md:w-[50px] md:h-[50px] flex items-center justify-center"
                  >
                    <img
                      src="../src/Assets/Post_Components/bookmark-plus.png"
                      alt="Bookmark"
                      className="w-5 h-5 md:w-6 md:h-6"
                    />
                  </button>
                </div>

                {showComments && (
                  <CommentSection
                    userProfile={post.user || {}}
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
