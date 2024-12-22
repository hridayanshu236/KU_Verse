import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchChats, createChat } from "../utils/chatService";
import { fetchFriendList } from "../utils/friendservice";
import { useUser } from "../contexts/userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faEnvelope,
  faFileArchive,
  faMessage,
} from "@fortawesome/free-regular-svg-icons";
import { faArrowLeft, faTimes } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../components/Navbar";
import ChatInfo from "../components/Chats/ChatInfo";
import ChatList from "../components/Chats/ChatList";
import Modal from "../components/Chats/Modal";

const SIDEBAR_ITEMS = [
  { icon: faMessage, label: "Messages" },
  { icon: faFileArchive, label: "Archive" },
];

const Chats = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { chatId } = useParams();

  const [state, setState] = useState({
    chats: [],
    searchTerm: "",
    isLoading: true,
    error: null,
    selectedChat: null,
    isChatOpen: !!chatId,
    isModalOpen: false,
    friends: [],
    friendSearchTerm: "",
    selectedFriends: [], 
    isCreatingChat: false,
  });

  const filteredChats = useMemo(() => {
    if (!state.searchTerm) return state.chats;
    return state.chats.filter((chat) =>
      chat.participants.some((participant) =>
        participant.fullName
          .toLowerCase()
          .includes(state.searchTerm.toLowerCase())
      )
    );
  }, [state.chats, state.searchTerm]);

  const filteredFriends = useMemo(() => {
    if (!state.friendSearchTerm) return [];
    return state.friends.filter(
      (friend) =>
        !state.selectedFriends.some(
          (selected) => selected._id === friend._id
        ) &&
        friend.fullName
          .toLowerCase()
          .includes(state.friendSearchTerm.toLowerCase())
    );
  }, [state.friends, state.friendSearchTerm, state.selectedFriends]);

  const loadChats = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const data = await fetchChats();
      setState((prev) => ({
        ...prev,
        chats: data,
        isLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error.message,
        isLoading: false,
      }));
    }
  }, []);

  const loadFriends = useCallback(async () => {
    try {
      const friends = await fetchFriendList();
      setState((prev) => ({
        ...prev,
        friends,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error.message,
      }));
    }
  }, []);

  const handleChatSelect = useCallback(
    (chat) => {
      setState((prev) => ({ ...prev, selectedChat: chat, isChatOpen: true }));
      navigate(`/chats/${chat._id}`);
    },
    [navigate]
  );

  const handleBackToChatList = useCallback(() => {
    setState((prev) => ({ ...prev, isChatOpen: false }));
    navigate("/chats");
  }, [navigate]);

  const handleSearchChange = useCallback((e) => {
    setState((prev) => ({ ...prev, searchTerm: e.target.value }));
  }, []);

  const handleFriendSelect = useCallback((friend) => {
    setState((prev) => ({
      ...prev,
      selectedFriends: [...prev.selectedFriends, friend],
      friendSearchTerm: "",
    }));
  }, []);

  const handleRemoveFriend = useCallback((friendId) => {
    setState((prev) => ({
      ...prev,
      selectedFriends: prev.selectedFriends.filter(
        (friend) => friend._id !== friendId
      ),
    }));
  }, []);

  const toggleModal = useCallback((isOpen) => {
    setState((prev) => ({
      ...prev,
      isModalOpen: isOpen,
      selectedFriends: [], // Reset selected friends when closing modal
      friendSearchTerm: "",
    }));
  }, []);

  const handleCreateChat = useCallback(async () => {
    if (state.selectedFriends.length === 0 || state.isCreatingChat) return;

    try {
      setState((prev) => ({ ...prev, isCreatingChat: true }));
  
      const participantIds = [
        ...new Set(state.selectedFriends.map((friend) => friend._id)),
      ];
      const newChat = await createChat(participantIds);
      setState((prev) => ({
        ...prev,
        chats: [newChat, ...prev.chats],
        isModalOpen: false,
        selectedFriends: [],
        friendSearchTerm: "",
        isCreatingChat: false,
      }));
      navigate(`/chats/${newChat._id}`);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: "Failed to create chat",
        isCreatingChat: false,
      }));
      console.error("Error creating chat:", error);
    }
  }, [state.selectedFriends, navigate]);


  useEffect(() => {
    loadChats();
    loadFriends();
  }, [loadChats, loadFriends]);

  useEffect(() => {
    if (chatId) {
      const chat = state.chats.find((chat) => chat._id === chatId);
      setState((prev) => ({
        ...prev,
        selectedChat: chat || null,
        isChatOpen: !!chat,
      }));
    }
  }, [chatId, state.chats]);

  if (state.isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  if (state.error)
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {state.error}
      </div>
    );

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-grow overflow-hidden">
        <aside className="hidden mdd:flex flex-col justify-between border text-[rgb(103,80,164)] text-center">
          <div className="p-3">
            <img
              src={user?.profilePicture || "/default-avatar.png"}
              alt={`${user?.fullName || "User"}'s profile`}
              className="w-14 h-14 rounded-full object-cover"
            />
          </div>
          <nav>
            <ul>
              {SIDEBAR_ITEMS.map((item, index) => (
                <li
                  key={index}
                  className="p-3 cursor-pointer hover:bg-[rgb(237,231,240)] transition-colors"
                >
                  <FontAwesomeIcon className="w-8 h-8" icon={item.icon} />
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-3">
            <FontAwesomeIcon
              className="w-8 h-8 cursor-pointer hover:bg-[rgb(237,231,240)] transition-colors"
              icon={faBell}
            />
          </div>
        </aside>

        <div
          className={`flex-shrink-0 w-full mdd:w-80 border ${
            state.isChatOpen ? "hidden mdd:flex" : "flex"
          } flex-col`}
        >
          <header className="flex-shrink-0 p-4 border-b">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl">
                <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                Inbox
              </h1>
              <button
                onClick={() => toggleModal(true)}
                className="p-2 hover:bg-[rgb(237,231,240)] rounded-full transition-colors"
              >
                <img
                  width="25"
                  height="25"
                  src="https://img.icons8.com/material-two-tone/24/create-new--v1.png"
                  alt="Create new chat"
                />
              </button>
            </div>
            <input
              type="text"
              value={state.searchTerm}
              onChange={handleSearchChange}
              placeholder="Search messages"
              className="mt-4 border w-full p-4 rounded-3xl bg-[rgb(237,231,240)] focus:outline-none focus:ring-2 focus:ring-[rgb(103,80,164)]"
            />
          </header>

          <div className="flex-grow overflow-y-auto">
            {filteredChats.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                No chats available
              </div>
            ) : (
              <ChatList
                chatData={filteredChats}
                selectedChat={state.selectedChat}
                setSelectedChat={handleChatSelect}
              />
            )}
          </div>
        </div>

        <main
          className={`flex-grow flex flex-col ${
            state.isChatOpen ? "flex" : "hidden mdd:flex"
          }`}
        >
          {state.selectedChat ? (
            <>
              <button
                className="flex-shrink-0 flex mdd:hidden p-4"
                onClick={handleBackToChatList}
              >
                <FontAwesomeIcon icon={faArrowLeft} className="w-6 h-6" />
              </button>
              <div className="flex-grow flex flex-col min-h-full">
                <ChatInfo
                  selectedChat={state.selectedChat}
                  handleBackToChatList={handleBackToChatList}
                />
              </div>
            </>
          ) : (
            <div className="flex-grow flex items-center justify-center text-gray-500">
              Select a chat to start messaging
            </div>
          )}
        </main>
      </div>

      <Modal
        isOpen={state.isModalOpen}
        onClose={() => toggleModal(false)}
        title="New Chat"
      >
        <div className="p-4">
          <h2 className="text-lg font-medium">Start a New Conversation</h2>
          <div className="relative mt-4">
            <div className="flex flex-wrap gap-2 p-2 border rounded-lg min-h-[42px] focus-within:ring-2 focus-within:ring-[rgb(103,80,164)]">
              {state.selectedFriends.map((friend) => (
                <span
                  key={friend._id}
                  className="flex items-center gap-1 px-2 py-1 bg-[rgb(237,231,240)] rounded-full text-sm"
                >
                  {friend.fullName}
                  <button
                    onClick={() => handleRemoveFriend(friend._id)}
                    className="hover:text-red-500"
                  >
                    <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder={
                  state.selectedFriends.length === 0
                    ? "Search for friends"
                    : "Add more friends..."
                }
                value={state.friendSearchTerm}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    friendSearchTerm: e.target.value,
                  }))
                }
                className="flex-grow min-w-[120px] outline-none bg-transparent"
              />
            </div>
            {state.friendSearchTerm && filteredFriends.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredFriends.map((friend) => (
                  <div
                    key={friend._id}
                    className="flex items-center justify-between py-2 px-3 cursor-pointer hover:bg-gray-50"
                    onClick={() => handleFriendSelect(friend)}
                  >
                    <div className="flex items-center">
                      <img
                        src={friend.profilePicture || "/default-avatar.png"}
                        alt={friend.fullName}
                        className="w-8 h-8 rounded-full mr-3"
                      />
                      <p>{friend.fullName}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleCreateChat}
            disabled={
              state.selectedFriends.length === 0 || state.isCreatingChat
            }
            className={`mt-4 w-full p-2 rounded-lg text-white transition-colors ${
              state.selectedFriends.length > 0 && !state.isCreatingChat
                ? "bg-[rgb(103,80,164)] hover:bg-[rgb(83,60,144)]"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {state.isCreatingChat ? "Creating..." : "Start Chat"}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Chats;
