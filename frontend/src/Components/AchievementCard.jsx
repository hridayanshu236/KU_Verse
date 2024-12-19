import React from "react";

const AchievementCard = (props) => {
  const achievement = {
    title: "Best Researcher Award 2023",
    description:
      "Awarded for outstanding contributions to mathematical research and academic excellence.",
    date: "December 15, 2023",
    icon: "../src/Assets/award-icon.png",
  };

  const user = {
    Name: "Prof. Perth Bahadur Pandit",
    short_name: "Perth Pandit",
    Department: "Computer Science",
    shortDepart: "D.O.M",
    image: "../src/Assets/parth.png",
  };

  return (
    <div className="flex flex-col items-center justify-center p-2 m-1 border border-gray-200 rounded-lg shadow-md bg-blue-50 min-w-[200px] min-h-[160px] md:min-w-[300px] md:min-h-[220px]">
      {/* User Info */}
      <div className="flex items-center space-x-3 mb-4">
        <img
          src={user.image}
          alt="User Profile"
          className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] rounded-full object-cover"
        />
        <div className="text-left">
          <span className="block text-sm md:text-base font-semibold text-gray-800">
            {user.short_name}
          </span>
          <span className="block text-xs md:text-sm text-gray-600">
            {user.shortDepart}
          </span>
        </div>
      </div>

      {/* Achievement Title */}
      <span className="mt-3 text-sm md:text-lg font-semibold text-gray-800 text-center">
        {achievement.title}
      </span>

      {/* Achievement Description */}
      <span className="mt-2 text-xs md:text-sm text-gray-600 text-center font-light">
        {achievement.description}
      </span>

      {/* Achievement Date */}
      <span className="mt-2 text-xs md:text-sm text-gray-500 italic text-center">
        {achievement.date}
      </span>
    </div>
  );
};

export default AchievementCard;
