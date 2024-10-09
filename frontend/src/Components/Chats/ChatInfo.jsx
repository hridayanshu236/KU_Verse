import React, { useState, useEffect } from "react";
import { useUser } from "../../contexts/userContext";
import Picker from "@emoji-mart/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faSmile,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const ChatInfo = ({ selectedChat }) => {
  const { user } = useUser();
  const [inputValue, setInputValue] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (selectedChat) {
      fetchChatMessages();
    }
  }, [selectedChat]);

  const fetchChatMessages = async () => {
    if (!selectedChat || !selectedChat._id) return;
    try {
      const response = await axios.get(
        `http://localhost:5000/api/chat/${selectedChat._id}/messages`,
        { withCredentials: true }
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  // Emoji picker function
  const addEmoji = (e) => {
    let emoji = e.native;
    setInputValue(inputValue + emoji);
  };

  let displayName = "Unknown";
  let displayPicture = "";

  if (selectedChat && user) {
    if (selectedChat.isGroupChat) {
   
      displayName = selectedChat.chatName || "Unnamed Group";
      displayPicture = selectedChat.groupPicture || "default_group_avatar_url";
    } else {
      const otherParticipant = selectedChat.participants.find(
        (participant) => participant._id !== user._id
      );
      displayName = otherParticipant?.fullName || "Unknown";
      displayPicture = otherParticipant?.profilePicture || "default_avatar_url";
    }
  }

  if (!selectedChat || !user) {
    return <div>Loading chat information...</div>;
  }

  return (
    <>
      {/* Chat header */}
      <div className="flex flex-row justify-between p-2 border-b">
        <div className="flex flex-row items-center">
          <img
            src={displayPicture}
            alt="profile"
            className="w-14 h-14 rounded-full cursor-pointer"
          />
          <h1 className="font-semibold pl-2">{displayName}</h1>
        </div>
        <div className="text-[rgb(103,80,164)]">
          <FontAwesomeIcon
            className="w-6 h-6 p-2 cursor-pointer"
            icon={faBars}
          />
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex flex-col h-[300px] overflow-y-auto p-4 mt-auto justify-end">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${
              msg.sender._id === user._id ? "justify-end" : ""
            } mb-2`}
          >
            <div
              className={`max-w-[70%] p-2 rounded-lg ${
                msg.sender._id === user._id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300"
              }`}
            >
              <p>{msg.message}</p>
              <p className="text-xs text-gray-500 text-right">
                {new Date(msg.time).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message input and emoji picker */}
      <div className="flex p-4">
        <div className="p-2">
          <FontAwesomeIcon
            className="w-6 h-6 cursor-pointer text-[rgb(103,80,164)]"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            icon={faSmile}
          />
          {showEmojiPicker && (
            <div className="absolute bottom-14">
              <Picker onEmojiSelect={addEmoji} />
            </div>
          )}
        </div>
        <div className="flex-grow">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message"
            className="border rounded-xl p-2 w-full"
          />
        </div>
        <div className="p-2 text-blue-800">
          <FontAwesomeIcon
            className="w-6 h-6 cursor-pointer"
            icon={faPaperPlane}
          />
        </div>
      </div>
    </>
  );
};

export default ChatInfo;
