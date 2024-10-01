import React from "react";

const Posts = () => {
  return (
    <>
      <div className="flex flex-col h-[700px] w-[640px] rounded p-3">
        <div className="bg-blue-200 flex-1 rounded-t-lg">
          <div className="items-center flex flex-col p-2 m-1 justify-items-center">
            <img
              src="./Assets/perth.jpg"
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
        <div className="bg-slate-400 flex-[2] flex items-center justify-center">
          <img
            src="./Assets/pencils.jpg"
            alt="Post_profile"
            className="h-[500px]"
          />
        </div>
        <div className="bg-green-200 flex flex-row justify-between px-2"></div>
      </div>
    </>
  );
};

export default Posts;
