import { useEffect, useRef } from "react";
import io from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

export const useSocket = (userId) => {
  const socket = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    socket.current = io(SOCKET_URL);

    // Connect and authenticate
    if (userId) {
      socket.current.emit("setup", userId);
    }

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [userId]);

  const joinChat = (chatId) => {
    if (chatId && socket.current) {
      socket.current.emit("join chat", chatId);
    }
  };

  const leaveChat = (chatId) => {
    if (chatId && socket.current) {
      socket.current.emit("leave chat", chatId);
    }
  };

  const sendMessage = (messageData) => {
    if (socket.current) {
      socket.current.emit("new message", messageData);
    }
  };

  const onMessageReceived = (callback) => {
    if (socket.current) {
      socket.current.on("message received", callback);
    }
  };

  const onTyping = (callback) => {
    if (socket.current) {
      socket.current.on("typing", callback);
    }
  };

  const onStopTyping = (callback) => {
    if (socket.current) {
      socket.current.on("stop typing", callback);
    }
  };

  const emitTyping = (chatId) => {
    if (socket.current) {
      socket.current.emit("typing", chatId);
    }
  };

  const emitStopTyping = (chatId) => {
    if (socket.current) {
      socket.current.emit("stop typing", chatId);
    }
  };

  return {
    socket: socket.current,
    joinChat,
    leaveChat,
    sendMessage,
    onMessageReceived,
    onTyping,
    onStopTyping,
    emitTyping,
    emitStopTyping,
  };
};
