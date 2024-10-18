import React from "react";

const StoryCard = () => {
  return (
    <>
      <div className="flex-1 my-1 border-2 border-x-1 border-black flex items-center justify-center min-h-screen bg-gray-100">
        <div className="relative w-80 p-6 bg-green-100 rounded-lg shadow-lg">
          {/* Background Image (blurred) */}
          <div
            className="absolute inset-0 bg-cover bg-center blur-md opacity-50 rounded-lg"
            style={{
              backgroundImage: `url('/api/placeholder/400/400')`,
            }}
          />

          {/* Foreground Content */}
          <div className="relative z-10 text-center">
            {/* Profile Image */}
            <img
              src="/api/placeholder/100/100"
              alt="Profile"
              className="w-24 h-24 mx-auto rounded-full shadow-lg mb-4"
            />

            {/* Name and Department */}
            <h3 className="text-lg font-semibold text-gray-900">
              Prof. Perth Bahadur Pandit
            </h3>
            <p className="text-purple-700 text-sm italic">
              Department of Mathematics
            </p>

            {/* Time Ago */}
            <p className="text-gray-500 text-xs mt-2">2 hours ago</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default StoryCard;
