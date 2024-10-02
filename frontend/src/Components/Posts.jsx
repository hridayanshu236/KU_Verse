import React, { useState } from "react";

const Posts = () => {
  const randon = 2;
  const [voteCount, setVoteCount] = useState(0);
  function upVote() {
    setVoteCount((prevCount) => prevCount + 1);
  }

  function downVote() {
    setVoteCount((prevCount) => prevCount - 1);
  }
  return (
    <>
      <div className=" bg-slate-50 flex flex-col h-auto w-[640px] rounded p-2">
        <div className="bg-blue-200 flex-1 rounded-t-lg mb-1">
          <div className="items-center flex flex-col p-2 m-1 justify-items-center">
            <img
              src="..\src\Assets\parth.png"
              className="w-[70px] h-[70px] rounded-full"
              alt="Profile_picture"
            />
            <span className="text-black font-semibold">
              Prof.Perth Bahadur Pandit
            </span>
            <span className="text-gray-900 font-light">
              Deparment of Mathematics
            </span>
            <span className="text-gray-400 font-extralight">2 hours ago</span>
          </div>
        </div>
        <div className="  flex-[2] flex items-center justify-center rounded-b-lg">
          <img
            src="..\src\Assets\Post_Components\pencils.jpg"
            alt="Post_profile"
            className="h-[500px] mb-2"
          />
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
    </>
  );
};

export default Posts;
