import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import StoryCard from "../Components/StoryCard";
import PostInput from "../Components/PostInput";
import Posts from "../Components/Posts";
import AchievementCard from "../Components/AchievementCard";
import EventCard from "../Components/EventCard";
import ChatInterface from "../Components/ChatInterface";
import {
  fetchPosts,
  createPost,
  upvotePost,
  downvotePost,
  commentOnPost,
} from "../utils/postServices";

const Feed = () => {
  const [activeChatState, setActiveChatState] = useState({
    activeUserId: null,
    chatStates: {},
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Fetch posts on mount
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

  // Upvote a post
  const handleUpvote = async (postId) => {
    let hasError = false;

    // Optimistic UI Update
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId ? { ...post, upvotes: post.upvotes + 1 } : post
      )
    );

    try {
      const updatedPost = await upvotePost(postId);

      // Update only specific fields to avoid double increment
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, upvotes: updatedPost.upvotes } : post
        )
      );
    } catch (error) {
      hasError = true;
      console.error(error.message);
    }

    // Rollback only if there was an error
    if (hasError) {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, upvotes: post.upvotes - 1 } : post
        )
      );
    }
  };

  // Downvote a post
  const handleDownvote = async (postId) => {
    let hasError = false;

    // Optimistic UI Update
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId ? { ...post, downvotes: post.downvotes + 1 } : post
      )
    );

    try {
      const updatedPost = await downvotePost(postId);

      // Update only specific fields to avoid double decrement
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, downvotes: updatedPost.downvotes }
            : post
        )
      );
    } catch (error) {
      hasError = true;
      console.error(error.message);
    }

    // Rollback only if there was an error
    if (hasError) {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, downvotes: post.downvotes - 1 }
            : post
        )
      );
    }
  };

  // Add a comment to a post
  const handleComment = async (postId, comment) => {
    try {
      const updatedPost = await commentOnPost(postId, comment);
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === postId ? updatedPost : post))
      );
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="sticky top-0 z-10">
        <Navbar />
      </div>

      <div className="flex flex-row flex-grow overflow-hidden">
        {/* Left Sidebar */}
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
          </div>
        </div>

        {/* Main Feed Section */}
        <div className="flex-[2] w-full min-w-[600px] px-4 overflow-auto h-full scrollbar-hide">
          <PostInput onPostCreate={handleCreatePost} className="mb-6" />
          {loading ? (
            <div>Loading...</div>
          ) : (
            <Posts key={posts._id} posts={posts} onComment={handleComment} />
          )}
        </div>

        {/* Right Sidebar */}
        <div className="flex flex-[0.8] flex-col pl-4">
          <div className="flex flex-col h-full">
            <div className="flex flex-col gap-4 py-2 pl-10 mb-6 min-w-[150px] h-[50%] overflow-y-auto scrollbar-hide sticky top-[8px]">
              <StoryCard />
              <StoryCard />
              <StoryCard />
              <StoryCard />
            </div>
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
  );
};

export default Feed;
