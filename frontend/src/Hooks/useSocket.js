// useSocket.js
import { useEffect, useRef } from "react";
import io from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

export const useSocket = (userId, userName, selectedChat) => {
  const socket = useRef(null);

  useEffect(() => {
    if (!userId) return;

    socket.current = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket"],
      query: { userId, userName },
    });

    socket.current.on("connect", () => {
      console.log("Socket connected");
    });

    socket.current.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
        socket.current = null;
      }
    };
  }, [userId, userName]);

  const joinChat = (chatId) => {
    if (chatId && socket.current) {
      console.log("Joining chat room:", chatId);
      socket.current.emit("join chat", chatId);
    }
  };

  const leaveChat = (chatId) => {
    if (chatId && socket.current) {
      console.log("Leaving chat room:", chatId);
      socket.current.emit("leave chat", chatId);
    }
  };

  const onMessageReceived = (callback) => {
    if (socket.current) {
      // Remove existing listener
      socket.current.off("message received");

      if (callback) {
        socket.current.on("message received", (data) => {
          console.log("Socket received message:", data);
          callback(data);
        });
      }
    }
  };

  const sendMessage = (messageData) => {
    if (socket.current) {
      console.log("Emitting new message:", messageData);
      socket.current.emit("new message", messageData);
    }
  };

  const onTyping = (callback) => {
    if (socket.current) {
      // Remove existing listener before adding new one
      socket.current.off("typing");
      if (callback) {
        socket.current.on("typing", (data) => {
          console.log("Typing event received:", data);
          callback(data);
        });
      }
    }
  };

  const onStopTyping = (callback) => {
    if (socket.current) {
      // Remove existing listener before adding new one
      socket.current.off("stop typing");
      if (callback) {
        socket.current.on("stop typing", (data) => {
          console.log("Stop typing event received:", data);
          callback(data);
        });
      }
    }
  };

  const emitTyping = (data) => {
    if (socket.current) {
      console.log("Emitting typing event:", data);
      socket.current.emit("typing", data);
    }
  };

  const emitStopTyping = (data) => {
    if (socket.current) {
      console.log("Emitting stop typing event:", data);
      socket.current.emit("stop typing", data);
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

export default useSocket;
