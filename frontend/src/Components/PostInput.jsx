import React from "react";
import { Camera, Video, SmileIcon } from "lucide-react";
const PostInput = () => {
  return (
    <>
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center gap-3 mb-4">
          <img
            src=""
            alt=""
            className="w-10 h-10 rounded-full bg-emerald-100 flex-shrink-0"
          />
          <input
            type="text"
            placeholder="What's on your mind?"
            className="w-full bg-emerald-50 rounded-full px-6 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300 text-gray-700"
          />
        </div>
        <div></div>
      </div>
    </>
  );
};

export default PostInput;
