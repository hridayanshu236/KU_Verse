
import React from "react";

const ChatList = ({ chatData, selectedChat, setSelectedChat }) => {
  return (
      <ul>
        {chatData.map((chat, index) => (
          <li
            key={index}
            onClick={() => setSelectedChat(chat)}
            className={`flex justify-between items-center p-4 cursor-pointer border 
              ${
                chat.name === selectedChat.name
                  ? "bg-[rgb(237,231,240)]"
                  : "bg-white hover:bg-[rgb(237,231,240)]"
              }
            `}
          >
            <div className="flex items-center">
              <img
                src={chat.profilePic}
                alt="profile"
                className="w-12 h-12 rounded-full"
              />
              <div className="pl-3">
                <h1 className="text-lg">{chat.name}</h1>
                <p className="text-sm">
                  {chat.messages[chat.messages.length - 1].text}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-sm">
                {chat.messages[chat.messages.length - 1].time}
              </p>
            </div>
          </li>
        ))}
      </ul>
  );
};

export default ChatList;
