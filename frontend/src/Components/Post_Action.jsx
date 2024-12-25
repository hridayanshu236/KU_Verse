import React, { useState } from "react";
import { upvotePost, downvotePost } from "../utils/postServices";

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
          src={userProfile.image}
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
              src={comment.user.image}
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1">
              <div className="bg-gray-100 rounded-2xl px-4 py-2">
                <div className="font-semibold">{comment.user.name}</div>
                <div>{comment.text}</div>
              </div>
              <div className="text-xs text-gray-500 mt-1 ml-4">
                {new Date(comment.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Post_Action = ({
  userProfile,
  postId,
  upvotes,
  downvotes,
  comments,
  onUpvote,
  onDownvote,
  onComment,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [voteStatus, setVoteStatus] = useState(null); // 'upvoted' or 'downvoted'
  const [voteCount, setVoteCount] = useState(upvotes - downvotes);
  const [isVoting, setIsVoting] = useState(false); // Prevent spam clicks

  const handleUpvote = async () => {
    if (voteStatus === "upvoted" || isVoting) return;
    setIsVoting(true);

    // Optimistically update UI
    setVoteCount((prev) => prev + 1);
    setVoteStatus("upvoted");

    try {
      await upvotePost(postId);
    } catch (error) {
      console.error("Failed to upvote:", error);
      // Revert if API fails
      setVoteCount((prev) => prev - 1);
      setVoteStatus(null);
    } finally {
      setIsVoting(false);
    }
  };

  const handleDownvote = async () => {
    if (voteStatus === "downvoted" || isVoting) return;
    setIsVoting(true);

    // Optimistically update UI
    setVoteCount((prev) => prev - 1);
    setVoteStatus("downvoted");

    try {
      await downvotePost(postId);
    } catch (error) {
      console.error("Failed to downvote:", error);
      // Revert if API fails
      setVoteCount((prev) => prev + 1);
      setVoteStatus(null);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <>
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
        {/* Share Button */}
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

        {/* Bookmark Button */}
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
          userProfile={userProfile}
          postId={postId}
          comments={comments}
          onComment={onComment}
        />
      )}
    </>
  );
};

export default Post_Action;
