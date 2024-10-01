import React, { useState } from "react";
import profile from "../assets/profile.png";
import bhismaPic from "../assets/bhisma.png";
import kadelPic from "../assets/kadel.png";
import sachinPic from "../assets/sachin.png";
import parthPic from "../assets/parth.png";
import defaultPic from "../assets/default.svg";
import Picker from "@emoji-mart/react";
import chatData from "../assets/dummyChats.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faCross,
  faDoorClosed,
  faPhone,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import {
  faBell,
  faEnvelope,
  faFileArchive,
  faMessage,
  faPaperPlane,
  faSmile,
} from "@fortawesome/free-regular-svg-icons";
import Navbar from "../components/Navbar";
import ChatInfo from "../components/Chats/ChatInfo";
import ChatList from "../components/Chats/ChatList";

const Chats = () => {
  const profilePics = {
    "Bhisma Prasad Bhandari": bhismaPic,
    "Ashraya Kadel": kadelPic,
    "Sachin Shrestha": sachinPic,
    "Parth Pandit": parthPic,
  };

  chatData.forEach((person) => {
    person.profilePic = profilePics[person.name] || defaultPic;
  });

  const [selectedChat, setSelectedChat] = useState(chatData[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const addEmoji = (e) => {
    let emoji = e.native;
    setInputValue(inputValue + emoji);
  };

  return (
    <>
      <div className="flex flex-col min-h-[100vh] max-h-[100vh]">
        <Navbar />
        <div className="mdd:flex min-h-full justify-between">
          {/* Sidebar for < medium devices */}
          <div
            className={`fixed flex flex-col justify-between min-h-[100vh] bg-[rgb(237,231,240)] text-[rgb(103,80,164)] bg-opacity-95 transition-transform duration-300 ease-in-out transform ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="p-3 pt-10 mt-5">
              <img
                src={profile}
                alt="profile"
                className="w-14 h-14 rounded-full"
              />
            </div>
            <div className="p-3 flex flex-col">
              <FontAwesomeIcon
                className="w-8 h-8 cursor-pointer p-4"
                icon={faMessage}
              />
              <FontAwesomeIcon
                className="w-8 h-8 cursor-pointer p-4"
                icon={faFileArchive}
              />
            </div>
            <div className="p-3 text-[rgb(103,80,164)] ">
              <FontAwesomeIcon
                className="w-8 h-8 cursor-pointer hover:bg-[rgb(237,231,240)]"
                icon={faBell}
              />
            </div>
          </div>
          {isSidebarOpen && (
            <div className="fixed left-2 font-bold p-3 text-[rgb(103,80,164)] ">
              <button
                onClick={() => {
                  setIsSidebarOpen(!isSidebarOpen);
                }}
              >
                X{" "}
              </button>
            </div>
          )}

          {/* Sidebar on large devices */}
          <div className=" border text-[rgb(103,80,164)] text-center hidden mdd:flex flex-col justify-between ">
            <div className="p-3">
              <img
                src={profile}
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
            <div className="p-3 ">
              <FontAwesomeIcon
                className="w-8 h-8 cursor-pointer hover:bg-[rgb(237,231,240)]"
                icon={faBell}
              />
            </div>
          </div>
          
          {/* Conversation list */}
          <div className="flex flex-col border ">
            {" "}
            <div className="pb-8 pl-4 pt-4 pr-4 border-b">
              <div className="flex">
                <FontAwesomeIcon
                  className="w-5 h-5 p-2 cursor-pointer mdd:hidden"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  icon={faBars}
                />

                <h1 className="text-2xl pb-3 text-center">
                  <FontAwesomeIcon icon={faEnvelope} /> Inbox
                </h1>
              </div>

              <div className="pt-3">
                {" "}
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
                setSelectedChat={setSelectedChat}
              />
            </div>
          </div>
          {/* Chat details */}
          <div className="mdd:flex flex-col flex-grow justify-between hidden ">
            <ChatInfo selectedChat={selectedChat} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Chats;
