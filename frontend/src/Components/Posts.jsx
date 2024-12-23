import React from "react";
import Post_Action from "./Post_Action";

const Posts = ({ posts, onComment }) => {
  const captionPostStyle = () => {
    return props.captionPresent
      ? "bg-green-100 flex-1 rounded-t-lg mb-1 flex justify-start"
      : "bg-green-100 flex-1 rounded-t-lg mb-1";
  };
  const captionPost = () => {
    return (
      <div className="items-center flex flex-col p-2 m-1 justify-center border-r-black border-r-2">
        <img
          src="../src/Assets/parth.png"
          className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] rounded-full"
          alt="Profile_picture"
        />
        <span className="text-black font-semibold text-sm md:text-base">
          {props.captionPresent ? user.short_name : user.Name}
        </span>
        <span className="text-gray-900 font-light text-xs md:text-sm">
          {props.captionPresent ? user.shortDepart : user.Department}
        </span>
        <span className="text-gray-400 font-extralight text-xs">
          2 hours ago
        </span>
      </div>
    );
  };
  return (
    <div className="flex flex-col gap-4 w-full">
      {!posts || posts.length === 0 ? (
        <div className="text-center text-gray-500">No posts available</div>
      ) : (
        posts.map((post) => (
          <div
            key={post._id}
            className="flex justify-center my-2 w-full px-2 md:px-4 min-w-[400px]"
          >
            <div className="flex flex-col h-auto w-full max-w-[640px] min-w-[280px] rounded p-2 border border-gray-200 shadow-sm">
              {/* Caption Section */}
              <div className="bg-green-100 flex-1 rounded-t-lg mb-1 flex justify-center">
                <div className="items-center flex flex-col p-2 m-1 justify-center">
                  <img
                    src={post.user?.image || "/default-profile-image.png"}
                    className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] rounded-full"
                    alt="Profile_picture"
                  />
                  <span className="text-black font-semibold text-sm md:text-base w-full text-center overflow-hidden text-ellipsis whitespace-nowrap">
                    {post.user?.short_name || post.user?.Name || "Anonymous"}
                  </span>
                  <span className="text-gray-900 font-light text-xs md:text-sm w-full text-center overflow-hidden text-ellipsis whitespace-nowrap">
                    {post.user?.shortDepart ||
                      post.user?.Department ||
                      "No Department"}
                  </span>
                  <span className="text-gray-400 font-extralight text-xs">
                    {post.createdAt
                      ? new Date(post.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Time unavailable"}
                  </span>
                </div>
              </div>

              {/* Post Content Section */}
              <div className="flex-[2] flex items-center justify-center rounded-b-lg">
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
              <Post_Action
                userProfile={post.user || {}}
                postId={post._id}
                upvotes={post.upvotes?.length || 0}
                downvotes={post.downvotes?.length || 0}
                comments={post.comments || []}
                onComment={(comment) => onComment(post._id, comment)}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Posts;
