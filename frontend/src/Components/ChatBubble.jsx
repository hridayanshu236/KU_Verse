// ChatBubble.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const ChatBubble = ({ chat }) => {
  const navigate = useNavigate();

  const otherParticipant = chat.participants.find(
    (p) => p._id !== localStorage.getItem("userId")
  );

  const getLastMessagePreview = (message) => {
    if (!message) return "No messages yet";
    return message.length > 20 ? `${message.substring(0, 20)}...` : message;
  };

   const formatMessageTime = (dateString) => {
     try {
       if (!dateString) return "";
       const date = new Date(dateString);
       if (isNaN(date.getTime())) return "";

       // For messages within the last 24 hours
       const now = new Date();
       const diffInHours = (now - date) / (1000 * 60 * 60);

       if (diffInHours < 24) {
         const hours = date.getHours().toString().padStart(2, "0");
         const minutes = date.getMinutes().toString().padStart(2, "0");
         return `${hours}:${minutes}`;
       }

       // For older messages
       return formatDistanceToNow(date, { addSuffix: true });
     } catch (error) {
       console.error("Error formatting date:", error);
       return "";
     }
   };

  const handleChatClick = () => {
    navigate(`/chats/${chat._id}`);
  };

  return (
    <button
      onClick={handleChatClick}
      className="w-[50px] relative group transition-all duration-200"
    >
      <div className="relative">
        <img
          src={otherParticipant?.profilePicture}
          alt={otherParticipant?.fullName || "User"}
          className="w-[50px] h-[50px] rounded-full object-cover border-2 border-white shadow-md 
          hover:scale-110 transition-transform duration-200"
        />
        {/* {chat.lastMessage && (
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-medium">1</span>
          </div>
        )} */}
      </div>

      {/* Hover Preview */}
      {/* <div
        className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-lg shadow-xl 
        border border-gray-200 p-3 opacity-0 group-hover:opacity-100 transition-opacity 
        duration-200 pointer-events-none z-100"
      >
        <div className="flex items-center mb-2">
          <img
            src={otherParticipant?.profilePicture }
            alt={otherParticipant?.fullName || "User"}
            className="w-8 h-8 rounded-full object-cover mr-2"
          />
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {otherParticipant?.fullName || "Unknown User"}
            </h4>
          </div>
        </div>
        {chat.lastMessage && (
          <>
            <p className="text-xs text-gray-600 mb-1">
              {getLastMessagePreview(chat.lastMessage.message)}
            </p>
            <p className="text-xs text-gray-400">
              {formatMessageTime(chat.lastMessage.createdAt)}
            </p>
          </>
        )}
      </div> */}
    </button>
  );
};

export default ChatBubble;
