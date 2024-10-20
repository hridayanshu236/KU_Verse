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
      ? "bg-blue-200 flex-1 rounded-t-lg mb-1 flex justify-start"
      : "bg-blue-200 flex-1 rounded-t-lg mb-1 ";
  };

  const user = {
    Name: "Prof. Perth Bahadur Pandit",
    short_name: "Perth Pandit",
    Department: "Computer Science",
    shortDepart: "D.O.M",
  };
  const textPost = () => {
    return props.textOnly ? (
      <>
        <div className=" font-sans font-medium text-justify p-4 leading-8">
          <p>{user_text}</p>
        </div>
      </>
    ) : (
      <>
        {" "}
        <img
          src="..\src\Assets\Post_Components\pencils.jpg"
          alt="Post_profile"
          className="h-[500px] mb-2"
        />
      </>
    );
  };

  const captionPost = () => {
    return props.captionPresent ? (
      <div className="items-center flex flex-col p-2 m-1 justify-center border-r-black border-r-2">
        <img
          src="../src/Assets/parth.png"
          className="w-[70px] h-[70px] rounded-full"
          alt="Profile_picture"
        />
        <span className="text-black font-semibold">{user.short_name}</span>
        <span className="text-gray-900 font-light">{user.shortDepart}</span>
        <span className="text-gray-400 font-extralight">2 hours ago</span>
      </div>
    ) : (
      <div className="items-center flex flex-col p-2 m-1 justify-center border-r-black border-r-2">
        <img
          src="../src/Assets/parth.png"
          className="w-[70px] h-[70px] rounded-full"
          alt="Profile_picture"
        />
        <span className="text-black font-semibold">{user.Name}</span>
        <span className="text-gray-900 font-light">{user.Department}</span>
        <span className="text-gray-400 font-extralight">2 hours ago</span>
      </div>
    );
  };
  return (
    <div className="flex justify-center my-2">
      <div className=" flex flex-col h-auto w-[640px] rounded p-2">
        <div className={captionPostStyle()}>{captionPost()}</div>
        <div className="  flex-[2] flex items-center justify-center rounded-b-lg">
          {textPost()}
        </div>
        <div className="flex  flex-row justify-between px-2">
          <button
            type=""
            className=" hover:bg-slate-200 w-[50px]"
            onClick={upVote}
          >
            {" "}
            <div className="flex justify-center">
              <img
                src="..\src\Assets\Post_Components\circle-arrow-up.png"
                alt="Comment_box"
              />
            </div>
          </button>
          <span className=" text-blue-500 font-semibold">{voteCount}</span>
          <button
            type=""
            className=" hover:bg-slate-200 w-[50px]"
            onClick={downVote}
          >
            {" "}
            <div className="flex justify-center">
              <img
                src="..\src\Assets\Post_Components\circle-arrow-down.png"
                alt="Comment_box"
              />
            </div>
          </button>
          <button type="" className=" hover:bg-slate-200 w-[50px]">
            {" "}
            <div className="flex justify-center">
              <img
                src="..\src\Assets\Post_Components\message-circle.png"
                alt="Comment_box"
              />
            </div>
          </button>
          <button type="" className=" hover:bg-slate-200 w-[50px]">
            {" "}
            <div className="flex justify-center">
              <img
                src="..\src\Assets\Post_Components\share-2.png"
                alt="Comment_box"
              />
            </div>
          </button>
          <button type="" className=" hover:bg-slate-200 w-[50px]">
            {" "}
            <div className="flex justify-center">
              <img
                src="..\src\Assets\Post_Components\bookmark-plus.png"
                alt="Comment_box"
              />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Posts;
