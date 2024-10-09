import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useUser } from "../contexts/userContext";
import {
  faBell,
  faEnvelope,
  faFileArchive,
  faMessage,
} from "@fortawesome/free-regular-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../components/Navbar";
import ChatInfo from "../components/Chats/ChatInfo";
import ChatList from "../components/Chats/ChatList";

const Chats = () => {
  const { user } = useUser();
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { chatId } = useParams();
  const [selectedChat, setSelectedChat] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(!!chatId);

  const fetchChats = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/chat/mychats",
        { withCredentials: true }
      );
      setChats(response.data);
    } catch (error) {
      setError("Failed to fetch chats. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setIsChatOpen(true);
    navigate(`/chats/${chat._id}`);
  };

  const handleBackToChatList = () => {
    setIsChatOpen(false);
    navigate("/chats");
  };

  useEffect(() => {
    if (chatId) {
      const chat = chats.find((chat) => chat._id === chatId);
      setSelectedChat(chat || null);
      setIsChatOpen(!!chat);
    }
  }, [chatId, chats]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-grow overflow-hidden">
        {/* Sidebar on large devices */}
        <div className="hidden mdd:flex flex-col justify-between border text-[rgb(103,80,164)] text-center ">
          <div className="p-3">
            <img
              src={user?.profilePicture || "default_avatar_url"}
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
          className={`flex-shrink-0 w-full mdd:w-80 border ${
            isChatOpen ? "hidden mdd:flex" : "flex"
          } flex-col`}
        >
          <div className="flex-shrink-0 pb-8 pl-4 pt-4 pr-4 border-b">
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
          <div className="flex-grow overflow-y-auto">
            {chats.length === 0 ? (
              <h1 className="text-2xl text-center pt-4">No chats available</h1>
            ) : (
              <ChatList
                chatData={chats}
                selectedChat={selectedChat}
                setSelectedChat={handleChatSelect}
              />
            )}
          </div>
        </div>

        {/* Chat details */}
        <div
          className={`flex-grow flex flex-col ${
            isChatOpen ? "flex" : "hidden mdd:flex"
          }`}
        >
          {selectedChat ? (
            <>
              {/* Back button for small screens */}
              <div className="flex-shrink-0 flex mdd:hidden p-4">
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  className="w-6 h-6 cursor-pointer"
                  onClick={handleBackToChatList}
                />
              </div>
              <div className="flex-grow flex flex-col">
                <ChatInfo
                  selectedChat={selectedChat}
                  handleBackToChatList={handleBackToChatList}
                />
              </div>
            </>
          ) : (
            <div className="flex-grow flex items-center justify-center">
              <h1 className="text-2xl text-center">No chat selected</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chats;
