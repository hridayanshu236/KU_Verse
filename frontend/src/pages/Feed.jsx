import React from "react";
import Navbar from "../components/Navbar";
import StoryCard from "../Components/StoryCard";
import PostInput from "../Components/PostInput";
import Posts from "../Components/Posts";

const Feed = () => {
  return (
    <>
      <div className="flex flex-col h-screen">
        {/* Navbar */}
        <div className="sticky top-0 z-10">
          <Navbar />
        </div>

        {/* Main Content */}
        <div className="flex flex-row h-full">
          {/* Left Section */}
          <div className="sm:hidden lg:flex flex-1 border-r border-gray-200 p-2">
            Left
          </div>

          {/* Middle Post Section */}
          <div className="flex-[2] w-full px-4">
            <PostInput className="mb-6" />
            <Posts />
            <Posts />
          </div>

          {/* RightSide Chat and Story Section */}
          <div className="sm:hidden lg:flex flex-[0.8] flex-col pl-4  h-screen">
            <div className="flex flex-col h-full ">
              {/* Story Section */}
              <div className="flex flex-col gap-2 overflow-y-auto py-2 sticky top-[30px] mb-3">
                <StoryCard />
                <StoryCard />
                <StoryCard />
                <StoryCard />
              </div>

              {/* Chat Heads */}
              <div className="flex flex-col gap-6 items-center w-[120px] self-end p-2 fixed bottom-0 pt-2">
                <button>
                  <img
                    className="w-[50px] h-[50px] max-w-[60px] rounded-full transform transition-transform duration-200 ease-in-out hover:scale-110 hover:shadow-2xl"
                    src="../src/Assets/parth.png"
                    alt="Rounded avatar"
                  />
                </button>
                <button>
                  <img
                    className="w-[50px] h-[50px] max-w-[60px] rounded-full transform transition-transform duration-200 ease-in-out hover:scale-110 hover:shadow-2xl"
                    src="../src/Assets/profile.png"
                    alt="Rounded avatar"
                  />
                </button>
                <button>
                  <img
                    className="w-[50px] h-[50px] max-w-[60px] rounded-full transform transition-transform duration-200 ease-in-out hover:scale-110 hover:shadow-2xl"
                    src="../src/Assets/bhisma.png"
                    alt="Rounded avatar"
                  />
                </button>
                <button>
                  <img
                    className="w-[50px] h-[50px] max-w-[60px] rounded-full transform transition-transform duration-200 ease-in-out hover:scale-110 hover:shadow-2xl"
                    src="../src/Assets/sachin.png"
                    alt="Rounded avatar"
                  />
                </button>
                <button>
                  <img
                    className="w-[50px] h-[50px] max-w-[60px] rounded-full transform transition-transform duration-200 ease-in-out hover:scale-110 hover:shadow-2xl"
                    src="../src/Assets/kadel.png"
                    alt="Rounded avatar"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Feed;
