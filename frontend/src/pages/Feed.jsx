import React from "react";
import Navbar from "../components/Navbar";
import StoryCard from "../Components/StoryCard";
import PostInput from "../Components/PostInput";
import Posts from "../Components/Posts";
import AchievementCard from "../Components/AchievementCard";
import EventCard from "../Components/EventCard";
const Feed = () => {
  return (
    <>
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Navbar */}
        <div className="sticky top-0 z-10">
          <Navbar />
        </div>

        {/* Main Content */}
        <div className="flex flex-row flex-grow overflow-hidden">
          {/* Left Section */}
          <div className="flex flex-[0.7] flex-col border-r border-gray-200 p-2 min-w-[420px]">
            <div className="flex flex-1 flex-col gap-4 py-2 pr-2 mb-6 min-w-[150px]">
              <AchievementCard />
              <AchievementCard />
              <AchievementCard />
            </div>
            <div className="flex flex-1 flex-col gap-4 py-2 pr-2 mb-6 min-w-[150px] overflow-auto scrollbar-hide">
              <EventCard
                title="AI Research Symposium 2024"
                department="Department of Mathematics"
                faculty="Faculty of Science"
                date="2024-12-19"
                location="Main Auditorium"
                description="Join us for our flagship annual symposium featuring cutting-edge research presentations."
              />
              <EventCard
                title="Kadel - 'Ma ta Ready ho' "
                department="Department of Haawagiri"
                faculty="Faculty of Guffadi"
                date="2024-12-19"
                location="Any place"
                description="Join us for Joshheko Kadel."
              />

              <EventCard
                title=" 'CE-2022 in Shambles!' "
                department="Department of Information"
                faculty="Faculty of News"
                date="2024-12-19"
                location="Any place"
                description="Join us for Sham sham Shambala."
              />
              <EventCard
                title="Second Derivative - Dalton"
                department="Department of Mathematics"
                faculty="Faculty of Science"
                date="2024-12-19"
                location="Main Auditorium"
                description="Join us for our flagship annual symposium featuring cutting-edge research presentations."
              />
            </div>
          </div>

          {/* Middle Post Section */}
          <div className="flex-[2] w-full min-w-[600px] px-4 overflow-auto h-full scrollbar-hide">
            <PostInput className="mb-6" />
            <Posts />
            <Posts />
            <Posts textOnly={true} />
          </div>

          {/* Right Section */}
          <div className="flex flex-[0.8] flex-col pl-4">
            <div className="flex flex-col h-full">
              {/* Story Section */}
              <div
                className="flex flex-col gap-4 py-2 pl-10 mb-6 min-w-[150px] 
    h-[50%] overflow-y-auto scrollbar-hide sticky top-[8px] "
              >
                <StoryCard />
                <StoryCard />
                <StoryCard />
                <StoryCard />
              </div>

              {/* Chat Heads */}
              <div
                className="flex flex-col gap-6 items-end min-w-[120px] 
                  max-h-[50%] overflow-y-auto scrollbar-hide pt-6 pr-10"
              >
                <div className="flex flex-col gap-6 min-w-[80px]">
                  <button className="min-w-[50px]">
                    <img
                      className="w-[50px] h-[50px] min-w-[50px] max-w-[60px] 
                        rounded-full transform transition-transform 
                        duration-200 ease-in-out hover:scale-110 
                        hover:shadow-2xl"
                      src="../src/Assets/parth.png"
                      alt="Rounded avatar"
                    />
                  </button>
                  <button className="min-w-[50px]">
                    <img
                      className="w-[50px] h-[50px] min-w-[50px] max-w-[60px] 
                        rounded-full transform transition-transform 
                        duration-200 ease-in-out hover:scale-110 
                        hover:shadow-2xl"
                      src="../src/Assets/profile.png"
                      alt="Rounded avatar"
                    />
                  </button>
                  <button className="min-w-[50px]">
                    <img
                      className="w-[50px] h-[50px] min-w-[50px] max-w-[60px] 
                        rounded-full transform transition-transform 
                        duration-200 ease-in-out hover:scale-110 
                        hover:shadow-2xl"
                      src="../src/Assets/bhisma.png"
                      alt="Rounded avatar"
                    />
                  </button>
                  <button className="min-w-[50px]">
                    <img
                      className="w-[50px] h-[50px] min-w-[50px] max-w-[60px] 
                        rounded-full transform transition-transform 
                        duration-200 ease-in-out hover:scale-110 
                        hover:shadow-2xl"
                      src="../src/Assets/sachin.png"
                      alt="Rounded avatar"
                    />
                  </button>
                  <button className="min-w-[50px]">
                    <img
                      className="w-[50px] h-[50px] min-w-[50px] max-w-[60px] 
                        rounded-full transform transition-transform 
                        duration-200 ease-in-out hover:scale-110 
                        hover:shadow-2xl"
                      src="../src/Assets/kadel.png"
                      alt="Rounded avatar"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Feed;
