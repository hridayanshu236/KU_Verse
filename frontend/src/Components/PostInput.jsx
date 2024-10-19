import React from "react";
import { Camera, Video, School } from "lucide-react";
const PostInput = () => {
  return (
    <>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-4 m-2">
        <div className="flex items-center gap-3 mb-4">
          <img
            src="../src/Assets/parth.png"
            alt=""
            className="w-10 h-10 rounded-full bg-emerald-100 flex-shrink-0"
          />
          <input
            type="text"
            placeholder="Something New for KU-Verse?"
            className="w-full bg-emerald-50 rounded-full px-6 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300 text-gray-700"
          />
        </div>
        <div className="flex flex-row justify-between  pt-2 border-t border-emerald-100">
          <button className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-emerald-50 transition-colors">
            <Video className="w-5 h-5 text-emerald-600" />
            <span className="text-sm text-gray-600">GO live!</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-emerald-50 transition-colors">
            <Camera className="w-5 h-5 text-emerald-600" />
            <span className="text-sm text-gray-600">Photo/Video</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-emerald-50 transition-colors">
            <School className="w-5 h-5 text-emerald-600" />
            <span className="text-sm text-gray-600">Achievements</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default PostInput;
