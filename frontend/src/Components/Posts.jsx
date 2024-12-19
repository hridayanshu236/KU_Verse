import React, { useState } from "react";

const Posts = (props) => {
  const [voteCount, setVoteCount] = useState(0);

  function upVote() {
    setVoteCount((prevCount) => prevCount + 1);
  }

  function downVote() {
    setVoteCount((prevCount) => prevCount - 1);
  }

  const user_text =
    "Mathematics is often described as the language of the universe, providing a framework for understanding patterns, structures, and relationships in the world around us. It spans a vast range of topics, from basic arithmetic to advanced fields like calculus, algebra, and topology. At its core, math seeks to uncover truths through logical reasoning and abstract thinking.";

  const captionPostStyle = () => {
    return props.captionPresent
      ? "bg-green-100 flex-1 rounded-t-lg mb-1 flex justify-start"
      : "bg-green-100 flex-1 rounded-t-lg mb-1";
  };

  const user = {
    Name: "Prof. Perth Bahadur Pandit",
    short_name: "Perth Pandit",
    Department: "Computer Science",
    shortDepart: "D.O.M",
  };

  const textPost = () => {
    return props.textOnly ? (
      <div className="font-sans font-medium text-justify p-4 leading-8">
        <p>{user_text}</p>
      </div>
    ) : (
      <img
        src="..\src\Assets\Post_Components\pencils.jpg"
        alt="Post_profile"
        className="min-h-[300px] min-w-[300px] max-h-[500px] w-full h-auto object-contain"
      />
    );
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
    <div className="flex justify-center my-2 w-full px-2 md:px-4">
      <div className="flex flex-col h-auto w-full max-w-[640px] min-w-[280px] rounded p-2 border border-gray-200 shadow-sm">
        {/* Caption Section */}
        <div className={captionPostStyle()}>{captionPost()}</div>

        {/* Post Content Section */}
        <div className="flex-[2] flex items-center justify-center rounded-b-lg">
          {textPost()}
        </div>

        {/* Action Buttons Section */}
        <div className="flex flex-row justify-between px-2 items-center">
          <button
            type="button"
            className="hover:bg-slate-200 w-[40px] h-[40px] md:w-[50px] md:h-[50px] flex items-center justify-center"
            onClick={upVote}
          >
            <img
              src="..\src\Assets\Post_Components\circle-arrow-up.png"
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
            onClick={downVote}
          >
            <img
              src="..\src\Assets\Post_Components\circle-arrow-down.png"
              alt="Downvote"
              className="w-5 h-5 md:w-6 md:h-6"
            />
          </button>
          <button
            type="button"
            className="hover:bg-slate-200 w-[40px] h-[40px] md:w-[50px] md:h-[50px] flex items-center justify-center"
          >
            <img
              src="..\src\Assets\Post_Components\message-circle.png"
              alt="Comment"
              className="w-5 h-5 md:w-6 md:h-6"
            />
          </button>
          <button
            type="button"
            className="hover:bg-slate-200 w-[40px] h-[40px] md:w-[50px] md:h-[50px] flex items-center justify-center"
          >
            <img
              src="..\src\Assets\Post_Components\share-2.png"
              alt="Share"
              className="w-5 h-5 md:w-6 md:h-6"
            />
          </button>
          <button
            type="button"
            className="hover:bg-slate-200 w-[40px] h-[40px] md:w-[50px] md:h-[50px] flex items-center justify-center"
          >
            <img
              src="..\src\Assets\Post_Components\bookmark-plus.png"
              alt="Bookmark"
              className="w-5 h-5 md:w-6 md:h-6"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Posts;
