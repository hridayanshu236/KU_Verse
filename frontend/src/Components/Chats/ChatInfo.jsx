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
import { useSocket } from "../../Hooks/useSocket";

const ChatInfo = ({ selectedChat, onMessageSent, handleNewMessage }) => {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const processedMessages = useRef(new Set());
  const typingTimeoutRef = useRef(null);

  const {
    joinChat,
    leaveChat,
    sendMessage: emitMessage,
    onMessageReceived,
    onTyping,
    onStopTyping,
    emitTyping,
    emitStopTyping,
  } = useSocket(user?._id, user?.fullName, selectedChat);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Join chat when selected chat changes
  useEffect(() => {
    if (selectedChat?._id && user?._id) {
      console.log("Joining chat:", selectedChat._id);
      joinChat(selectedChat._id);
      processedMessages.current.clear();
      setTypingUsers(new Set());

      return () => {
        console.log("Leaving chat:", selectedChat._id);
        leaveChat(selectedChat._id);
      };
    }
  }, [selectedChat?._id, user?._id]);
useEffect(() => {
  console.log("Current messages:", messages);
}, [messages]);
  // Load initial messages
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedChat?._id || !user?._id) return;

      setIsLoading(true);
      try {
        const messagesData = await fetchChatMessages(selectedChat._id);
        if (messagesData && Array.isArray(messagesData)) {
          const processedMessagesData = messagesData.map((msg) => ({
            ...msg,
            senderId: msg.sender?._id || msg.senderId,
          }));
          setMessages(processedMessagesData);
          scrollToBottom();
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [selectedChat?._id, user?._id]);

  // Handle socket events
useEffect(() => {
  // In ChatInfo.jsx
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !selectedChat?._id || !user?._id) return;

    const messageData = {
      chatId: selectedChat._id,
      senderId: user._id,
      sender: {
        _id: user._id,
        fullName: user.fullName,
      },
      message: inputValue.trim(),
      time: new Date().toISOString(),
    };

    // Clear typing and input
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      emitStopTyping({
        chatId: selectedChat._id,
        userId: user._id,
        userName: user.fullName,
      });
    }
    setInputValue("");

    try {
      const savedMessage = await sendMessage(messageData);

      // Update messages in current chat
      setMessages((prev) => [
        ...prev,
        {
          ...savedMessage,
          sender: { _id: user._id, fullName: user.fullName },
        },
      ]);

      // Emit through socket
      emitMessage({
        ...savedMessage,
        chatId: selectedChat._id,
        sender: {
          _id: user._id,
          fullName: user.fullName,
        },
      });

      // Update chat list
      if (onMessageSent) {
        onMessageSent(savedMessage);
      }

      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleTypingStart = (data) => {
    if (data.chatId === selectedChat?._id && data.userId !== user?._id) {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.add(data.userName);
        return newSet;
      });
    }
  };

  const handleTypingStop = (data) => {
    if (data.chatId === selectedChat?._id && data.userId !== user?._id) {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(data.userName);
        return newSet;
      });
    }
  };

  // Set up socket event listeners if chat and user are available
  if (selectedChat?._id && user?._id) {
    console.log("Setting up message listeners for chat:", selectedChat._id);
    onMessageReceived(handleNewMessage);
    onTyping(handleTypingStart);
    onStopTyping(handleTypingStop);
  }

  // Cleanup function
  return () => {
    console.log("Cleaning up message listeners");
    onMessageReceived(null);
    onTyping(null);
    onStopTyping(null);
  };
}, [selectedChat?._id, user?._id]);
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !selectedChat?._id || !user?._id) return;

    const messageData = {
      chatId: selectedChat._id,
      senderId: user._id,
      sender: {
        _id: user._id,
        fullName: user.fullName,
      },
      message: inputValue.trim(),
      time: new Date().toISOString(),
    };

    // Clear typing indicators
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      emitStopTyping({
        chatId: selectedChat._id,
        userId: user._id,
        userName: user.fullName,
      });
    }

    // Clear input immediately
    setInputValue("");

    try {
      // First save to database
      const savedMessage = await sendMessage(messageData);

      // Update local state with saved message
      setMessages((prev) => [
        ...prev,
        {
          ...savedMessage,
          sender: { _id: user._id, fullName: user.fullName },
        },
      ]);

      // Emit through socket with saved message ID
      emitMessage({
        ...savedMessage,
        chatId: selectedChat._id,
        sender: {
          _id: user._id,
          fullName: user.fullName,
        },
      });

      // Scroll to bottom after message is added
      setTimeout(scrollToBottom, 100);

      if (onMessageSent) {
        onMessageSent(savedMessage);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleTyping = (e) => {
    setInputValue(e.target.value);

    if (!selectedChat?._id || !user?._id) return;

    // Log the typing event being emitted
    console.log("Emitting typing event for chat:", selectedChat._id);

    emitTyping({
      chatId: selectedChat._id,
      userId: user._id,
      userName: user.fullName,
    });

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      console.log("Emitting stop typing event for chat:", selectedChat._id);
      emitStopTyping({
        chatId: selectedChat._id,
        userId: user._id,
        userName: user.fullName,
      });
    }, 3000);
  };

  const addEmoji = (emoji) => {
    setInputValue((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  const displayInfo = React.useMemo(() => {
    let displayName = "Unknown";
    let displayPicture = "/default_avatar.png";

    if (selectedChat && user) {
      if (selectedChat.isGroupChat) {
        displayName = selectedChat.chatName || "Unnamed Group";
        displayPicture =
          selectedChat.groupPicture || "/default_group_avatar.png";
      } else {
        const otherParticipant = selectedChat.participants?.find(
          (participant) => participant._id !== user._id
        );
        displayName = otherParticipant?.fullName || "Unknown User";
        displayPicture =
          otherParticipant?.profilePicture || "/default_avatar.png";
      }
    }

    return { displayName, displayPicture };
  }, [selectedChat, user]);

  if (!selectedChat || !user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-row justify-between p-2 border-b">
        <div className="flex flex-row items-center">
          <img
            src={displayInfo.displayPicture}
            alt="profile"
            className="w-14 h-14 rounded-full cursor-pointer"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/default_avatar.png";
            }}
          />
          <h1 className="font-semibold pl-2">{displayInfo.displayName}</h1>
        </div>
        <FontAwesomeIcon
          className="w-6 h-6 p-2 cursor-pointer text-[rgb(103,80,164)]"
          icon={faBars}
        />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500">Loading messages...</p>
            </div>
          ) : (
            <>
              {messages.map((msg, index) => {
                const isCurrentUser =
                  msg.senderId === user?._id || msg.sender?._id === user?._id;
                return (
                  <div
                    key={msg._id || `temp-${index}`}
                    className={`flex ${
                      isCurrentUser ? "justify-end" : "justify-start"
                    } mb-2`}
                  >
                    <div
                      className={`max-w-[70%] p-2 rounded-lg ${
                        isCurrentUser ? "bg-blue-500 text-white" : "bg-gray-300"
                      }`}
                    >
                      <p>{msg.message || "Message content unavailable"}</p>
                      <p
                        className={`text-xs ${
                          isCurrentUser ? "text-gray-200" : "text-gray-500"
                        } text-right`}
                      >
                        {msg.time
                          ? new Date(msg.time).toLocaleTimeString()
                          : ""}
                      </p>
                    </div>
                  </div>
                );
              })}
              {typingUsers.size > 0 && (
                <div className="flex items-center space-x-2 bg-gray-100 p-3 rounded-lg mb-2">
                  <div className="flex space-x-1">
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                  <span className="text-gray-600 text-sm">
                    {Array.from(typingUsers).join(", ")}{" "}
                    {typingUsers.size === 1 ? "is" : "are"} typing...
                  </span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <div className="flex p-4 border-t">
          <div className="p-2 relative">
            <FontAwesomeIcon
              className="w-6 h-6 cursor-pointer text-[rgb(103,80,164)]"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              icon={faSmile}
            />
            {showEmojiPicker && (
              <div className="absolute bottom-14 z-50">
                <Picker onEmojiSelect={addEmoji} />
              </div>
            )}
          </div>
          <form onSubmit={handleSendMessage} className="flex-grow flex">
            <input
              type="text"
              value={inputValue}
              onChange={handleTyping}
              placeholder="Type a message"
              className="border rounded-xl p-2 w-full focus:outline-none focus:ring-2 focus:ring-[rgb(103,80,164)]"
            />
            <button
              type="submit"
              className="p-2 text-[rgb(103,80,164)] hover:text-[rgb(83,60,144)] transition-colors"
              disabled={!inputValue.trim()}
            >
              <FontAwesomeIcon
                className="w-6 h-6 cursor-pointer"
                icon={faPaperPlane}
              />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInfo;

       