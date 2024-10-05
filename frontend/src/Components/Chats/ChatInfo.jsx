import React, { useState } from "react";
import Picker from "@emoji-mart/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faSmile, faPhone, faVideo, faBars } from "@fortawesome/free-solid-svg-icons";

const ChatInfo = ({ selectedChat }) => {
  const [inputValue, setInputValue] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const addEmoji = (e) => {
    let emoji = e.native;
    setInputValue(inputValue + emoji);
  };

  return (
    <>
      <div className="flex flex-row justify-between p-2 border-b">
        
        <div className="flex flex-row items-center">
          <img
            src={selectedChat.profilePic}
            alt="profile"
            className="w-14 h-14 rounded-full cursor-pointer"
          />
          <h1 className="font-semibold pl-2">{selectedChat.name}</h1>
        </div>
        <div className="text-[rgb(103,80,164)]">
          {/* <FontAwesomeIcon
            className="w-6 h-6 p-2 cursor-pointer"
            icon={faPhone}
          />
          <FontAwesomeIcon
            className="w-6 h-6 p-2 cursor-pointer"
            icon={faVideo}
          /> */}
          <FontAwesomeIcon
            className="w-6 h-6 p-2 cursor-pointer"
            icon={faBars}
          />
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex flex-col h-[300px] overflow-y-auto p-4 mt-auto justify-end">
        {selectedChat.messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === "You" ? "justify-end" : ""} mb-2`}
          >
            <div
              className={`max-w-[70%] p-2 rounded-lg ${
                msg.sender === "You" ? "bg-blue-500 text-white" : "bg-gray-300"
              }`}
            >
              <p>{msg.text}</p>
              <p className="text-xs text-gray-500 text-right">{msg.time}</p>
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
