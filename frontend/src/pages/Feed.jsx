import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import StoryCard from "../Components/StoryCard";
import PostInput from "../Components/PostInput";
import Posts from "../Components/Posts";
import AchievementCard from "../Components/AchievementCard";
import EventCard from "../Components/EventCard";
import ChatBubble from "../components/ChatBubble";
import {fetchChats} from "../utils/chatService";
import ChatInterface from "../Components/ChatInterface";
import { fetchPosts, createPost } from "../utils/postServices";
import EventsForYou from "../components/EventsForYou";
import UpcomingEvents from "../components/UpcomingEvent";
import { useUser } from "../contexts/userContext";
import SidebarRecommendations from "../components/SidebarRecommendation";
const Feed = () => {
  const [chats, setChats] = useState([]);
  const [chatLoading, setChatLoading] = useState(true);
  const { user } = useUser();
  useEffect(() => {
    loadChats();
  }, []);
  const [activeChatState, setActiveChatState] = useState({
    activeUserId: null,
    chatStates: {},
  });
   const loadChats = async () => {
     try {
       setChatLoading(true);
       const userChats = await fetchChats();
       // Sort chats by last message timestamp
       const sortedChats = userChats
         .filter(
           (chat) =>
             chat &&
             chat._id &&
             Array.isArray(chat.participants) &&
             chat.participants.length > 0
         )
         .sort((a, b) => {
           const dateA = a.lastMessage?.time
             ? new Date(a.lastMessage.time)
             : new Date(0);
           const dateB = b.lastMessage?.time
             ? new Date(b.lastMessage.time)
             : new Date(0);
           return dateB - dateA; // Sort descending (newest first)
         });
       setChats(sortedChats);
     } catch (error) {
       console.error("Failed to load chats:", error);
       setChats([]);
     } finally {
       setChatLoading(false);
     }
   };
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const handleSidebarConnect = async (userId) => {
    try {
      console.log("Connected with user:", userId);
    } catch (error) {
      console.error("Failed to connect:", error);
    }
  };
  const chatUsers = [
    { id: 1, name: "Parth", avatar: "../src/Assets/parth.png" },
    { id: 2, name: "Profile", avatar: "../src/Assets/profile.png" },
    { id: 3, name: "Bhisma", avatar: "../src/Assets/bhisma.png" },
    { id: 4, name: "Sachin", avatar: "../src/Assets/sachin.png" },
    { id: 5, name: "Kadel", avatar: "../src/Assets/kadel.png" },
  ];

  const handleChatClick = (user) => {
    setActiveChatState((prevState) => ({
      activeUserId: prevState.activeUserId === user.id ? null : user.id,
      chatStates: {
        ...prevState.chatStates,
        [user.id]: prevState.chatStates[user.id] || { messages: [] },
      },
    }));
  };

  const handleChatClose = () => {
    setActiveChatState((prevState) => ({
      ...prevState,
      activeUserId: null,
    }));
  };

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const postsData = await fetchPosts();
        setPosts(postsData);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load posts:", error.message);
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  const handleCreatePost = async (newPost) => {
    try {
      const createdPost = await createPost(newPost);
      setPosts((prevPosts) => [createdPost, ...prevPosts]);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Increased z-index for navbar and added shadow */}
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <Navbar />
      </div>

      <div className="flex flex-row flex-grow overflow-hidden">
        {/* Left Sidebar */}
        <div className="hidden mdd:flex mdd:flex-[0.7] flex-col border-r border-gray-200 p-2 min-w-[420px]">
          <div className="flex flex-1 flex-col gap-4 py-2 pr-2 mb-6 min-w-[150px]">
            <EventsForYou />
          </div>
          <div className="flex flex-1 flex-col gap-4 py-2 pr-2 mb-6 min-w-[150px] overflow-auto scrollbar-hide">
            <UpcomingEvents />
          </div>
        </div>

        {/* Main Feed Section */}
        <div className="flex-1 w-full mdd:flex-[2] mdd:min-w-[600px] px-4 overflow-auto h-full scrollbar-hide">
          <PostInput onPostCreate={handleCreatePost} user={user} className="mb-6" />
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            <Posts key={posts._id} posts={posts} />
          )}
        </div>

        <div className="hidden mdd:flex mdd:flex-[0.8] flex-col pl-4">
          <div className="flex flex-col h-full">
            <div className="sticky top-[20px] z-40">
              {" "}
              <SidebarRecommendations onConnect={handleSidebarConnect} />
            </div>

            {/* Chat Bubbles Section */}
            <div className="flex flex-col gap-6 items-end min-w-[120px] overflow-y-auto scrollbar-hide pt-6 pr-10 mt-4">
              <div className="flex flex-col gap-6 min-w-[80px] relative z-[50]">
                {chatLoading ? (
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  </div>
                ) : chats.length > 0 ? (
                  chats.map((chat) => <ChatBubble key={chat._id} chat={chat} />)
                ) : (
                  <div className="text-center text-gray-500 text-sm">
                    No recent chats
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
