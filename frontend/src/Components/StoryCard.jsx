import React from "react";

const StoryCard = () => {
  return (
    <>
      <div>
        <div className="relative max-h-[120px] bg-green-100 rounded-sm shadow-lg p-4 mb-4 py-2 border-y-2">
          {/* Foreground Content */}
          <div className="relative z-10 text-center">
            {/* Profile Image */}
            <img
              src="../src/Assets/parth.png"
              alt="Profile"
              className="w-[40px] h-[40px] mx-auto rounded-full shadow-lg mb-4"
            />

            {/* Name and Department */}
            <h3 className="text-lg font-semibold text-gray-900">
              Prof. Perth Bahadur Pandit
            </h3>
            <p className="text-purple-700 text-sm italic">
              Department of Mathematics
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default StoryCard;
