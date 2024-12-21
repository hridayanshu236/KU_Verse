import React, { useState, useEffect, useRef } from "react";
import { useUser } from "../../contexts/userContext";
import Picker from "@emoji-mart/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fetchChatMessages, sendMessage } from "../../utils/messageService";
import {
  faPaperPlane,
  faSmile,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000";
var socket;

const ChatInfo = ({ selectedChat }) => {
  const { user } = useUser();
  const [inputValue, setInputValue] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedChat || !selectedChat._id) return;
      try {
        const messagesData = await fetchChatMessages(selectedChat._id);
        setMessages(messagesData);
      } catch (error) {
        console.error("Error fetching chat messages:", error);
      }
    };
    loadMessages();
  }, [selectedChat]);

  useEffect(() => {
    socket = io(ENDPOINT);
    if (selectedChat?._id) {
      socket.emit("setup", selectedChat);
    }

    return () => {
      socket.disconnect();
    };
  }, [selectedChat]);

  const addEmoji = (e) => {
    let emoji = e.native;
    setInputValue(inputValue + emoji);
  };

  useEffect(() => {
    socket.on("message received", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("message received");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !selectedChat?._id) return;

    try {
      const messageData = {
        chatId: selectedChat._id,
        senderId: user._id,
        message: inputValue,
      };

      socket.emit("send message", messageData);

      await sendMessage(messageData);
      setInputValue("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
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
      
      <div className="flex flex-col mdd:h-[70vh] h-[full]  overflow-y-auto p-4 mt-auto">
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
        <div ref={messagesEndRef} />{" "}
        {/* This empty div will be used to scroll to the bottom */}
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
        <form onSubmit={handleSendMessage} className="flex-grow flex">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message"
            className="border rounded-xl p-2 w-full"
          />
          <div className="p-2 text-blue-800">
            <FontAwesomeIcon
              className="w-6 h-6 cursor-pointer"
              icon={faPaperPlane}
              onClick={handleSendMessage}
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default ChatInfo;
