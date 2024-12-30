import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchChats, createChat } from "../utils/chatService";
import { useUser } from "../contexts/userContext";
import PropTypes from "prop-types";
import { fetchFriendList } from "../utils/userServices";
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
import { io } from "socket.io-client";
import LoadingSpinner from "../components/Common/LoadingSpinner";

const SIDEBAR_ITEMS = [
  { icon: faMessage, label: "Messages" }
];

const Chats = () => {
  const socketRef = useRef();
  const { user } = useUser();
  const navigate = useNavigate();
  const { chatId } = useParams();

  // State declarations
  const [chats, setChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(!!chatId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [friends, setFriends] = useState([]);
  const [friendSearchTerm, setFriendSearchTerm] = useState("");
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    socketRef.current = io("http://localhost:5000");

    socketRef.current.on("connect", () => {
      console.log("Socket connected");
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Handle real-time message updates
  useEffect(() => {
    if (!socketRef.current) return;

    const handleNewMessage = (message) => {
      console.log("New message received in chat list:", message);
      setChats((prevChats) => {
        const updatedChats = prevChats.map((chat) => {
          if (chat._id === message.chatId) {
            return {
              ...chat,
              lastMessage: {
                _id: message._id,
                message: message.message,
                sender: message.sender,
                time: message.time,
                chatId: message.chatId,
              },
            };
          }
          return chat;
        });

        return updatedChats.sort((a, b) => {
          const timeA = a.lastMessage?.time || a.createdAt;
          const timeB = b.lastMessage?.time || b.createdAt;
          return new Date(timeB) - new Date(timeA);
        });
      });
    };

    socketRef.current.on("message received", handleNewMessage);

    return () => {
      if (socketRef.current) {
        socketRef.current.off("message received", handleNewMessage);
      }
    };
  }, []);

  // Socket join/leave chat room
  useEffect(() => {
    if (selectedChat?._id && socketRef.current) {
      console.log("Joining chat room:", selectedChat._id);
      socketRef.current.emit("join chat", selectedChat._id);

      return () => {
        console.log("Leaving chat room:", selectedChat._id);
        socketRef.current.emit("leave chat", selectedChat._id);
      };
    }
  }, [selectedChat?._id]);

  // Memoized values
  const filteredChats = useMemo(() => {
    if (!searchTerm) return chats;
    return chats.filter((chat) =>
      chat.participants.some((participant) =>
        participant.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [chats, searchTerm]);

  const filteredFriends = useMemo(() => {
    if (!friendSearchTerm) return [];
    return friends.filter(
      (friend) =>
        !selectedFriends.some((selected) => selected._id === friend._id) &&
        friend.fullName.toLowerCase().includes(friendSearchTerm.toLowerCase())
    );
  }, [friends, friendSearchTerm, selectedFriends]);

  // Callbacks
  const loadChats = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchChats();
      setChats(
        data.sort((a, b) => {
          const timeA = a.lastMessage?.time || a.createdAt;
          const timeB = b.lastMessage?.time || b.createdAt;
          return new Date(timeB) - new Date(timeA);
        })
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadFriends = useCallback(async () => {
    try {
      const friendsData = await fetchFriendList();
      setFriends(friendsData);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const handleChatSelect = useCallback(
    (chat) => {
      setSelectedChat(chat);
      setIsChatOpen(true);
      navigate(`/chats/${chat._id}`);
    },
    [navigate]
  );

  const handleBackToChatList = useCallback(() => {
    setIsChatOpen(false);
    navigate("/chats");
  }, [navigate]);

  const toggleModal = useCallback((isOpen) => {
    setIsModalOpen(isOpen);
    if (!isOpen) {
      setSelectedFriends([]);
      setFriendSearchTerm("");
    }
  }, []);

  const updateChatWithNewMessage = useCallback((chatId, newMessage) => {
    console.log("Updating chat with new message:", chatId, newMessage);
    setChats((prevChats) => {
      const updatedChats = prevChats.map((chat) =>
        chat._id === chatId
          ? {
              ...chat,
              lastMessage: {
                _id: newMessage._id,
                message: newMessage.message,
                sender: newMessage.sender,
                time: newMessage.time,
                chatId: chatId,
              },
            }
          : chat
      );
      return updatedChats.sort((a, b) => {
        const timeA = a.lastMessage?.time || a.createdAt;
        const timeB = b.lastMessage?.time || b.createdAt;
        return new Date(timeB) - new Date(timeA);
      });
    });
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleFriendSelect = useCallback((friend) => {
    setSelectedFriends((prev) => [...prev, friend]);
    setFriendSearchTerm("");
  }, []);

  const handleRemoveFriend = useCallback((friendId) => {
    setSelectedFriends((prev) =>
      prev.filter((friend) => friend._id !== friendId)
    );
  }, []);

  const handleCreateChat = useCallback(async () => {
    if (selectedFriends.length === 0 || isCreatingChat) return;

    try {
      setIsCreatingChat(true);
      const participantIds = selectedFriends.map((friend) => friend._id);
      const newChat = await createChat(participantIds);

      setChats((prev) => [newChat, ...prev]);
      setIsModalOpen(false);
      setSelectedFriends([]);
      setFriendSearchTerm("");
      navigate(`/chats/${newChat._id}`);
    } catch (err) {
      setError("Failed to create chat");
    } finally {
      setIsCreatingChat(false);
    }
  }, [selectedFriends, navigate]);

  // Effects
  useEffect(() => {
    loadChats();
    loadFriends();
  }, [loadChats, loadFriends]);

  useEffect(() => {
    if (chatId) {
      const chat = chats.find((c) => c._id === chatId);
      setSelectedChat(chat || null);
      setIsChatOpen(!!chat);
    }
  }, [chatId, chats]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen relative">
      {" "}
      {/* Added relative positioning */}
      <Navbar className="z-50" /> 
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
            isChatOpen ? "hidden mdd:flex" : "flex"
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
              value={searchTerm}
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
                selectedChat={selectedChat}
                setSelectedChat={handleChatSelect}
              />
            )}
          </div>
        </div>

        <main
          className={`flex-grow flex flex-col ${
            isChatOpen ? "flex" : "hidden mdd:flex"
          }`}
        >
          {selectedChat ? (
            <>
              {/* <button
                className="flex-shrink-0 flex mdd:hidden p-4"
                onClick={handleBackToChatList}
              >
                <FontAwesomeIcon icon={faArrowLeft} className="w-6 h-6" />
              </button> */}
              <div className="flex-grow flex flex-col min-h-full relative z-40">
                {" "}
                {/* Ensure ChatInfo has a lower z-index */}
                <ChatInfo
                  selectedChat={selectedChat}
                  handleBackToChatList={handleBackToChatList}
                  onMessageSent={(message) => {
                    console.log("Message sent, updating chat list:", message);
                    updateChatWithNewMessage(selectedChat._id, message);
                  }}
                  handleNewMessage={(message) => {
                    console.log("New message received in chat:", message);
                    updateChatWithNewMessage(selectedChat._id, message);
                  }}
                  socket={socketRef.current}
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
        isOpen={isModalOpen}
        onClose={() => toggleModal(false)}
        title="New Chat"
      >
        {/* Modal content */}
        <div className="p-4">
          <h2 className="text-lg font-medium">Start a New Conversation</h2>
          <div className="relative mt-4">
            <div className="flex flex-wrap gap-2 p-2 border rounded-lg min-h-[42px] focus-within:ring-2 focus-within:ring-[rgb(103,80,164)]">
              {selectedFriends.map((friend) => (
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
                  selectedFriends.length === 0
                    ? "Search for friends"
                    : "Add more friends..."
                }
                value={friendSearchTerm}
                onChange={(e) => setFriendSearchTerm(e.target.value)}
                className="flex-grow min-w-[120px] outline-none bg-transparent"
              />
            </div>
            {friendSearchTerm && filteredFriends.length > 0 && (
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
            disabled={selectedFriends.length === 0 || isCreatingChat}
            className={`mt-4 w-full p-2 rounded-lg text-white transition-colors ${
              selectedFriends.length > 0 && !isCreatingChat
                ? "bg-[rgb(103,80,164)] hover:bg-[rgb(83,60,144)]"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {isCreatingChat ? "Creating..." : "Start Chat"}
          </button>
        </div>
      </Modal>
    </div>
  );
};

// PropTypes validation
Chats.propTypes = {
  selectedChat: PropTypes.shape({
    _id: PropTypes.string,
    participants: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        fullName: PropTypes.string,
        profilePicture: PropTypes.string,
      })
    ),
    isGroupChat: PropTypes.bool,
    chatName: PropTypes.string,
    groupPicture: PropTypes.string,
    lastMessage: PropTypes.shape({
      message: PropTypes.string,
      time: PropTypes.string,
      sender: PropTypes.shape({
        _id: PropTypes.string,
        fullName: PropTypes.string,
      }),
    }),
  }),
};

export default Chats;
