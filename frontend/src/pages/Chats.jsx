import React, { useState } from "react";
import profile from "../assets/profile.png";
import bhismaPic from "../assets/bhisma.png";
import kadelPic from "../assets/kadel.png";
import sachinPic from "../assets/sachin.png";
import parthPic from "../assets/parth.png";
import defaultPic from "../assets/default.svg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faCross, faDoorClosed, faPhone, faVideo } from "@fortawesome/free-solid-svg-icons";
import {
  faBell,
  faEnvelope,
  faFileArchive,
  faMessage,
  faPaperPlane,
  faSmile,
} from "@fortawesome/free-regular-svg-icons";

const Chats = () => {
  const chatData = [
    {
      name: "Bhisma Prasad Bhandari",
      profilePic: bhismaPic,
      messages: [
        {
          text: "K cha dai?",
          sender: "Bhisma Prasad Bhandari",
          time: "12:24",
        },
        {
          text: "Sanchai Chhau?",
          sender: "Bhisma Prasad Bhandari",
          time: "12:25",
        },
      ],
    },
    {
      name: "Ashraya Kadel",
      profilePic: kadelPic,
      messages: [
        { text: "Hi how are you?", sender: "Ashraya Kadel", time: "12:26" },
        { text: "Let's meet up.", sender: "You", time: "12:27" },
      ],
    },
    {
      name: "Sachin Shrestha",
      profilePic: sachinPic,
      messages: [
        {
          text: "What are you doing?",
          sender: "Sachin Shrestha",
          time: "12:28",
        },
      ],
    },
    {
      name: "Parth Pandit",
      profilePic: parthPic,
      messages: [
        { text: "Hi, how are you?", sender: "Parth Pandit", time: "12:29" },
        { text: "Let's catch up!", sender: "You", time: "12:30" },
      ],
    },
    {
      name: "Cristiano Ronaldo",
      profilePic: defaultPic,
      messages: [
        {
          text: "I scored another goal!",
          sender: "Cristiano Ronaldo",
          time: "14:15",
        },
        {
          text: "Keep pushing yourself.",
          sender: "Cristiano Ronaldo",
          time: "14:20",
        },
      ],
    },
    {
      name: "Lionel Messi",
      profilePic: defaultPic,
      messages: [
        {
          text: "The game was amazing.",
          sender: "Lionel Messi",
          time: "15:00",
        },
        { text: "Let's discuss tactics.", sender: "You", time: "15:05" },
      ],
    },
    {
      name: "Prakalpa Satyal",
      profilePic: defaultPic,
      messages: [
        {
          text: "Can we catch up this weekend?",
          sender: "Prakalpa Satyal",
          time: "11:00",
        },
        { text: "Sure! Looking forward to it.", sender: "You", time: "11:05" },
      ],
    },
    {
      name: "Aryaman Giri",
      profilePic: defaultPic,
      messages: [
        {
          text: "How's the new project going?",
          sender: "Aryaman Giri",
          time: "13:45",
        },
        { text: "It's going great, thanks!", sender: "You", time: "13:50" },
      ],
    },
    {
      name: "Alexa Smith",
      profilePic: defaultPic,
      messages: [
        {
          text: "I loved your recent post.",
          sender: "Alexa Smith",
          time: "10:30",
        },
        { text: "Thanks a lot!", sender: "You", time: "10:35" },
      ],
    },
    {
      name: "Jason Taylor",
      profilePic: defaultPic,
      messages: [
        {
          text: "Are you coming to the event?",
          sender: "Jason Taylor",
          time: "16:30",
        },
        { text: "Yes, see you there!", sender: "You", time: "16:35" },
      ],
    },
    {
      name: "Nina Patel",
      profilePic: defaultPic,
      messages: [
        {
          text: "I need some advice on this task.",
          sender: "Nina Patel",
          time: "17:00",
        },
        { text: "Let's talk later today.", sender: "You", time: "17:10" },
      ],
    },
  ];

  const [selectedChat, setSelectedChat] = useState(chatData[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      {/* Footer on small devices */}
      <div className="mdd:hidden fixed bottom-0 left-0 right-0 bg-[rgb(237,231,240)] bg-opacity-80 flex items-center justify-center text-[rgb(103,80,164)]">
        <div className="p-3">
          <FontAwesomeIcon
            className="w-8 h-8 cursor-pointer"
            icon={faMessage}
          />
        </div>
        <div className="p-3">
          <FontAwesomeIcon
            className="w-8 h-8 cursor-pointer"
            icon={faFileArchive}
          />
        </div>
      </div>
      <div className="mdd:flex min-h-[100vh] mdd:max-h-[100vh]">
        {/* Sidebar for < medium devices */}
        <div
          className={`fixed flex flex-col justify-between min-h-[100vh] bg-[rgb(237,231,240)] bg-opacity-95 transition-transform duration-300 ease-in-out transform ${
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
        )
        }

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
                className="w-5 h-5 p-2 cursor-pointer sm:hidden"
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
          </div>
        </div>

        {/* Chat details */}
        <div className="mdd:flex flex-col flex-grow justify-between hidden ">
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
              <FontAwesomeIcon
                className="w-6 h-6 p-2 cursor-pointer"
                icon={faPhone}
              />
              <FontAwesomeIcon
                className="w-6 h-6 p-2 cursor-pointer"
                icon={faVideo}
              />
              <FontAwesomeIcon
                className="w-6 h-6 p-2 cursor-pointer"
                icon={faBars}
              />
            </div>
          </div>
          <div className="flex flex-col h-[300px] overflow-y-auto p-4 mt-auto justify-end  ">
            {selectedChat.messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "You" ? "justify-end" : ""
                } mb-2`}
              >
                <div
                  className={`max-w-[70%] p-2 rounded-lg ${
                    msg.sender === "You"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className="text-xs text-gray-500 text-right">{msg.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex p-4">
            <div className="p-2">
              <FontAwesomeIcon
                className="w-6 h-6 cursor-pointer"
                icon={faSmile}
              />
            </div>
            <div className="flex-grow">
              <input
                type="text"
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
        </div>
      </div>
    </>
  );
};

export default Chats;
