import React from "react";
import Navbar from "../components/Navbar";
const Feed = () => {
  return (
    <>
      <div className="flex flex-col">
        <div className="">
          <Navbar />
        </div>
        <div className="flex flex-row h-[100vh]">
          {/* left Section */}
          <div className="flex-1 bg-slate-500">Left</div>
          {/* Middle Post section */}
          <div className="flex-[2] bg-green-500">
            <h1>Middle</h1>
          </div>
          {/* RightSide Chat and Story Section  */}
          <div className="flex-[0.8] flex flex-col bg-yellow-400 pl-4 justify-end">
            {/* Story Section  */}
            <div className="flex-[1.3] flex flex-col bg-blue-400 h-full">
              <div className="flex-1 my-1 border-2 border-x-1 border-black "></div>
              <div className="flex-1 my-1 border-2 border-x-1 border-black"></div>
              <div className="flex-1 my-1 border-2 border-x-1 border-black"></div>
              <div className="flex-1 my-1 border-2 border-x-1 border-black"></div>
              <div className="flex-1 my-1 border-2 border-x-1 border-black"></div>
            </div>
            {/* Chat Heads  */}
            <div className="flex-1 flex flex-col justify-between items-center bg-cyan-400 w-[120px] self-end p-2">
              <button>
                <img
                  className=" min-w[30px] min-h-[30px] max-w-[60px] rounded-full transform transition-transform duration-200 ease-in-out hover:scale-110 hover:shadow-2xl"
                  src="../src/Assets/parth.png"
                  alt="Rounded avatar"
                />
              </button>
              <button>
                <img
                  className=" min-w[30px] min-h-[30px] max-w-[60px] rounded-full transform transition-transform duration-200 ease-in-out hover:scale-110 hover:shadow-2xl"
                  src="../src/Assets/profile.png"
                  alt="Rounded avatar"
                />
              </button>
              <button>
                <img
                  className=" min-w[30px] min-h-[30px] max-w-[60px] rounded-full transform transition-transform duration-200 ease-in-out hover:scale-110 hover:shadow-2xl"
                  src="../src/Assets/bhisma.png"
                  alt="Rounded avatar"
                />
              </button>
              <button>
                <img
                  className=" min-w[30px] min-h-[30px] max-w-[60px] rounded-full transform transition-transform duration-200 ease-in-out hover:scale-110 hover:shadow-2xl"
                  src="../src/Assets/sachin.png"
                  alt="Rounded avatar"
                />
              </button>
              <button>
                <img
                  className=" min-w[30px] min-h-[30px] max-w-[60px] rounded-full transform transition-transform duration-200 ease-in-out hover:scale-110 hover:shadow-2xl"
                  src="../src/Assets/kadel.png"
                  alt="Rounded avatar"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Feed;
