import React, { useEffect } from "react";
import { useUser } from "../../contexts/userContext";
import { format, isToday, isYesterday, isThisWeek, isThisYear } from "date-fns";

const ChatList = ({ chatData, selectedChat, setSelectedChat }) => {
  const { user } = useUser();

  useEffect(() => {
    console.log("ChatList received chatData:", chatData);
  }, [chatData]);

  if (!chatData || !Array.isArray(chatData) || chatData.length === 0) {
    return <p>No chats available</p>;
  }
   const formatMessageTime = (date) => {
     if (!date) return "";
     const messageDate = new Date(date);

     if (isToday(messageDate)) {
       return format(messageDate, "p"); // e.g., "4:30 PM"
     }
     if (isYesterday(messageDate)) {
       return "Yesterday";
     }
     if (isThisWeek(messageDate)) {
       return format(messageDate, "EEEE"); // e.g., "Monday"
     }
     if (isThisYear(messageDate)) {
       return format(messageDate, "MMM d"); // e.g., "Jan 5"
     }
     return format(messageDate, "MMM d, yyyy"); // e.g., "Jan 5, 2023"
   };


    return (
      <ul>
        {chatData.map((chat) => {
          let displayName;
          let displayPicture;

          if (chat.isGroupChat) {
            displayName = chat.chatName || "Unnamed Group";
            displayPicture = chat.groupPicture || "/default_group_avatar.png";
          } else {
            const otherParticipant = chat.participants?.find(
              (participant) => participant._id !== user?._id
            );
            displayName = otherParticipant?.fullName || "Unknown";
            displayPicture =
              otherParticipant?.profilePicture || "/default_avatar.png";
          }

          const lastMessageTime = chat.lastMessage?.time || chat.createdAt;

          return (
            <li
              key={chat._id}
              onClick={() => setSelectedChat(chat)}
              className={`flex justify-between items-center p-4 cursor-pointer border
              ${
                chat._id === selectedChat?._id
                  ? "bg-[rgb(237,231,240)]"
                  : "bg-white hover:bg-[rgb(237,231,240)]"
              }
            `}
            >
              <div className="flex items-center flex-1">
                <img
                  src={displayPicture}
                  alt="profile"
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default_avatar.png";
                  }}
                />
                <div className="pl-3 flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h1 className="text-lg font-medium truncate">
                      {displayName}
                    </h1>
                    <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                      {formatMessageTime(lastMessageTime)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {chat.lastMessage ? (
                      <>
                        {chat.lastMessage.sender?._id === user?._id
                          ? "You: "
                          : ""}
                        {chat.lastMessage.message}
                      </>
                    ) : (
                      "No messages yet"
                    )}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    );
};

export default ChatList;
