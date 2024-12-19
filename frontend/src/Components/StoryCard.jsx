import React from "react";

const StoryCard = (props) => {
  const user = {
    name: "Prof. Perth Bahadur Pandit",
    department: "Department of Mathematics",
    profileImage: "../src/Assets/parth.png",
  };

  return (
    <div className="flex flex-col items-center justify-center p-2  border border-gray-200 rounded-lg shadow-md bg-green-100 min-w-[240px] min-h-[100px] md:min-w-[300px] md:min-h-[120px]">
      {/* Profile Image */}
      <img
        src={user.profileImage}
        alt="Profile"
        className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] rounded-full object-cover"
      />

      {/* User Name */}
      <span className="mt-2 text-sm md:text-base font-semibold text-black text-center">
        {user.name}
      </span>

      {/* Department */}
      <span className="text-xs md:text-sm text-gray-700 font-light text-center">
        {user.department}
      </span>
    </div>
  );
};

export default StoryCard;
