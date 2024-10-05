import React, { useState } from "react";
import profile from "../assets/profile.png";
import bhismaPic from "../assets/bhisma.png";
import kadelPic from "../assets/kadel.png";
import sachinPic from "../assets/sachin.png";
import parthPic from "../assets/parth.png";
import defaultPic from "../assets/default.svg";
import chatData from "../assets/dummyChats.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useUser } from "../contexts/userContext";
import {
  faBell,
  faEnvelope,
  faFileArchive,
  faMessage,
} from "@fortawesome/free-regular-svg-icons";
import Navbar from "../components/Navbar";
import ChatInfo from "../components/Chats/ChatInfo";
import ChatList from "../components/Chats/ChatList";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const Chats = () => {
  const { user } = useUser();
  const profilePics = {
    "Bhisma Prasad Bhandari": bhismaPic,
    "Ashraya Kadel": kadelPic,
    "Sachin Shrestha": sachinPic,
    "Parth Pandit": parthPic,
  };

  chatData.forEach((person) => {
    person.profilePic = profilePics[person.name] || defaultPic;
  });

  const [selectedChat, setSelectedChat] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false); 

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setIsChatOpen(true); 
  };

  const handleBackToChatList = () => {
    setIsChatOpen(false); 
  };

  return (
    <>
      <div className="flex flex-col min-h-[100vh] max-h-[100vh]">
        <Navbar />
        <div className="mdd:flex min-h-full justify-between">
          {/* Sidebar on large devices */}
          <div className="border text-[rgb(103,80,164)] text-center hidden mdd:flex flex-col justify-between">
            <div className="p-3">
              <img
                src={user?.avatar || "default_avatar_url"}
                alt="profile"
                className="w-14 h-14 rounded-full"
              />
            </div>
            <div>
              <ul>
                <li className="p-3 cursor-pointer hover:bg-[rgb(237,231,240)]">
                  <FontAwesomeIcon className="w-8 h-8" icon={faMessage} />
                </li>
                <li className="p-3 cursor-pointer hover:bg-[rgb(237,231,240)]">
                  <FontAwesomeIcon className="w-8 h-8" icon={faFileArchive} />
                </li>
              </ul>
            </div>
            <div className="p-3">
              <FontAwesomeIcon
                className="w-8 h-8 cursor-pointer hover:bg-[rgb(237,231,240)]"
                icon={faBell}
              />
            </div>
          </div>

          {/* Conversation list */}
          <div
            className={`flex flex-col border  ${
              isChatOpen ? "hidden" : "block"
            } mdd:flex`}
          >
            <div className="pb-8 pl-4 pt-4 pr-4 border-b">
              <div className="flex">
                <div>
                  <h1 className="text-2xl pb-3 text-center">
                    <FontAwesomeIcon icon={faEnvelope} /> Inbox
                  </h1>
                </div>
                <div className="ml-auto pt-1">
                  <img
                    width="25"
                    height="25"
                    src="https://img.icons8.com/material-two-tone/24/create-new--v1.png"
                    alt="create-new--v1"
                    className="cursor-pointer"
                  />
                </div>
              </div>
              <div className="pt-3">
                <input
                  type="text"
                  placeholder="Search for people or groups"
                  className="border w-full p-4 rounded-3xl bg-[rgb(237,231,240)]"
                />
              </div>
            </div>
            <div className="pt-8 overflow-y-auto">
              <ChatList
                chatData={chatData}
                selectedChat={selectedChat}
                setSelectedChat={handleChatSelect}
              />
            </div>
          </div>

          {/* Chat details */}

          <div
            className={`mdd:flex flex-col flex-grow ${
              isChatOpen ? "flex-col" : "hidden"
            } `}
          >
            {selectedChat ? (
              <>
                {/* Back button for small screens */}
                <div className="flex mdd:hidden p-4">
                 <FontAwesomeIcon icon={faArrowLeft} className="w-6 h-6 cursor-pointer" onClick={handleBackToChatList} />
                </div>
                <div className="flex flex-col justify-between flex-grow h-[80vh]">
                  {/* Chat info */}
                  <ChatInfo selectedChat={selectedChat} handleBackToChatList = {handleBackToChatList} />
                </div>
              </>
            ) : (
              <div>
                <h1 className="text-2xl text-center pt-4">No chat selected</h1>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Chats;
