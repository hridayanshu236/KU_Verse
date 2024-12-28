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

const ChatInfo = ({ selectedChat, onMessageSent }) => {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const processedMessages = useRef(new Set());

  const {
    joinChat,
    leaveChat,
    sendMessage: emitMessage,
    onMessageReceived,
    onTyping,
    onStopTyping,
    emitTyping,
    emitStopTyping,
  } = useSocket(user?._id);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Join and leave chat
  useEffect(() => {
    if (selectedChat?._id && user?._id) {
      console.log("Joining chat:", selectedChat._id);
      joinChat(selectedChat._id);
      processedMessages.current.clear();
    }

    return () => {
      if (selectedChat?._id) {
        console.log("Leaving chat:", selectedChat._id);
        leaveChat(selectedChat._id);
        processedMessages.current.clear();
      }
    };
  }, [selectedChat?._id, user?._id, joinChat, leaveChat]);

  // Fetch messages with proper sender handling
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedChat?._id || !user?._id) return;

      setIsLoading(true);
      try {
        const messagesData = await fetchChatMessages(selectedChat._id);
        if (messagesData && Array.isArray(messagesData)) {
          // Ensure each message has the correct sender information
          const processedMessagesData = messagesData.map((msg) => ({
            ...msg,
            // Ensure senderId is always present and correct
            senderId: msg.sender?._id || msg.senderId,
            // Keep the full sender object if needed
            sender: msg.sender || { _id: msg.senderId },
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

  // Handle new messages and typing
  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      console.log("Received message:", newMessage);

      if (newMessage.chatId === selectedChat?._id) {
        if (!processedMessages.current.has(newMessage._id)) {
          processedMessages.current.add(newMessage._id);

          const processedMessage = {
            ...newMessage,
            senderId: newMessage.sender?._id || newMessage.senderId,
            sender: newMessage.sender || { _id: newMessage.senderId },
          };

          setMessages((prev) => [...prev, processedMessage]);
          scrollToBottom();
        }
      }
    };

    const handleTypingStart = () => setIsTyping(true);
    const handleTypingStop = () => setIsTyping(false);

    onMessageReceived(handleNewMessage);
    onTyping(handleTypingStart);
    onStopTyping(handleTypingStop);

    return () => {
      onMessageReceived(null);
      onTyping(null);
      onStopTyping(null);
    };
  }, [onMessageReceived, onTyping, onStopTyping, selectedChat?._id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !selectedChat?._id || !user?._id) return;

    const tempId = `temp-${Date.now()}`;
    const messageData = {
      _id: tempId,
      chatId: selectedChat._id,
      senderId: user._id,
      sender: user, // Include the full user object
      message: inputValue,
      time: new Date().toISOString(),
    };

    // Add to processed messages to prevent duplication
    processedMessages.current.add(tempId);

    // Optimistic update
    setMessages((prev) => [...prev, messageData]);
    setInputValue("");
    scrollToBottom();

    try {
      // Emit via socket first for real-time update
      emitMessage(messageData);

      // Then save to database
      const savedMessage = await sendMessage(messageData);

      // Update the temporary message with the saved one
      processedMessages.current.delete(tempId);
      processedMessages.current.add(savedMessage._id);

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === tempId
            ? {
                ...savedMessage,
                senderId: user._id,
                sender: user, // Ensure sender information is preserved
              }
            : msg
        )
      );

      if (onMessageSent) {
        onMessageSent(savedMessage);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => prev.filter((msg) => msg._id !== tempId));
      processedMessages.current.delete(tempId);
    }
  };

  const handleTyping = (e) => {
    setInputValue(e.target.value);

    if (!selectedChat?._id) return;

    emitTyping(selectedChat._id);

    if (window.typingTimeout) {
      clearTimeout(window.typingTimeout);
    }

    window.typingTimeout = setTimeout(() => {
      emitStopTyping(selectedChat._id);
    }, 2000);
  };

  const addEmoji = (emoji) => {
    setInputValue((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  const displayInfo = React.useMemo(() => {
    let displayName = "Unknown";
    let displayPicture = "";

    if (selectedChat && user) {
      if (selectedChat.isGroupChat) {
        displayName = selectedChat.chatName || "Unnamed Group";
        displayPicture =
          selectedChat.groupPicture || "/default_group_avatar.png";
      } else {
        const otherParticipant = selectedChat.participants?.find(
          (participant) => participant._id !== user._id
        );
        displayName = otherParticipant?.fullName || "Unknown";
        displayPicture =
          otherParticipant?.profilePicture || "/default_avatar.png";
      }
    }

    return { displayName, displayPicture };
  }, [selectedChat, user]);

  // Helper function to determine if a message is from the current user
  const isMessageFromCurrentUser = (message) => {
    return message.senderId === user?._id || message.sender?._id === user?._id;
  };

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
                const isCurrentUser = isMessageFromCurrentUser(msg);
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
              {isTyping && (
                <div className="text-gray-500 text-sm italic mb-4">
                  Typing...
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
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
  );
};

export default ChatInfo;
