import React, { useState } from "react";
import Navbar from "../components/Navbar";
import StoryCard from "../Components/StoryCard";
import PostInput from "../Components/PostInput";
import Posts from "../Components/Posts";
import AchievementCard from "../Components/AchievementCard";
import EventCard from "../Components/EventCard";
import ChatInterface from "../Components/ChatInterface";

const Feed = () => {
  // Track active chat user and chat states
  const [activeChatState, setActiveChatState] = useState({
    activeUserId: null,
    chatStates: {}, // Store message history for each user
  });

  const chatUsers = [
    { id: 1, name: "Parth", avatar: "../src/Assets/parth.png" },
    { id: 2, name: "Profile", avatar: "../src/Assets/profile.png" },
    { id: 3, name: "Bhisma", avatar: "../src/Assets/bhisma.png" },
    { id: 4, name: "Sachin", avatar: "../src/Assets/sachin.png" },
    { id: 5, name: "Kadel", avatar: "../src/Assets/kadel.png" },
  ];

  // Handle chat open/close
  const handleChatClick = (user) => {
    setActiveChatState((prevState) => ({
      activeUserId: prevState.activeUserId === user.id ? null : user.id,
      chatStates: {
        ...prevState.chatStates,
        [user.id]: prevState.chatStates[user.id] || { messages: [] },
      },
    }));
  };

  // Handle chat close
  const handleChatClose = () => {
    setActiveChatState((prevState) => ({
      ...prevState,
      activeUserId: null,
    }));
  };

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
              <div className="flex flex-col gap-4 py-2 pl-10 mb-6 min-w-[150px] h-[50%] overflow-y-auto scrollbar-hide sticky top-[8px]">
                <StoryCard />
                <StoryCard />
                <StoryCard />
                <StoryCard />
              </div>

              {/* Chat Heads */}
              <div className="flex flex-col gap-6 items-end min-w-[120px] max-h-[50%] overflow-y-auto scrollbar-hide pt-6 pr-10">
                <div className="flex flex-col gap-6 min-w-[80px]">
                  {chatUsers.map((user) => (
                    <button
                      key={user.id}
                      className="min-w-[50px]"
                      onClick={() => handleChatClick(user)}
                    >
                      <img
                        className="w-[50px] h-[50px] min-w-[50px] max-w-[60px] 
                          rounded-full transform transition-transform 
                          duration-200 ease-in-out hover:scale-110 
                          hover:shadow-2xl"
                        src={user.avatar}
                        alt={`${user.name}'s avatar`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Chat Interfaces */}
          {chatUsers.map((user) => (
            <ChatInterface
              key={user.id}
              isOpen={activeChatState.activeUserId === user.id}
              onClose={handleChatClose}
              recipient={user}
              chatState={activeChatState.chatStates[user.id]}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Feed;
