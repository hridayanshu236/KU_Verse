import React, { useEffect } from "react";
import { useUser } from "../../contexts/userContext";
import { format } from "date-fns";

const ChatList = ({ chatData, selectedChat, setSelectedChat }) => {
  const { user } = useUser();

  useEffect(() => {
    console.log("ChatList received chatData:", chatData);
  }, [chatData]);

  if (!chatData || !Array.isArray(chatData) || chatData.length === 0) {
    return <p>No chats available</p>;
  }

  return (
    <ul>
      {chatData.map((chat) => {
        let displayName;
        let displayPicture;

        if (chat.isGroupChat) {
          displayName = chat.chatName || "Unnamed Group";
          displayPicture = chat.groupPicture || "default_group_avatar_url";
        } else {
          if (user && Array.isArray(chat.participants)) {
            const otherParticipant = chat.participants.find(
              (participant) => participant._id !== user._id
            );

            displayName = otherParticipant?.fullName || "Unknown";
            displayPicture =
              otherParticipant?.profilePicture || "default_avatar_url";
          } else {
            displayName = "Unknown";
            displayPicture = "default_avatar_url";
          }
        }

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
            <div className="flex items-center">
              <img
                src={displayPicture}
                alt="profile"
                className="w-12 h-12 rounded-full"
              />
              <div className="pl-3">
                <h1 className="text-lg">{displayName}</h1>
                <p className="text-sm truncate">
                  {chat.lastMessage
                    ? chat.lastMessage.message
                    : "No messages yet"}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-sm">
                {chat.lastMessage
                  ? format(new Date(chat.lastMessage.time), "p")
                  : ""}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default ChatList;
