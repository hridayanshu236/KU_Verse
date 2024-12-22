import React, { useState } from "react";
import { X, Send, Mic, Image as ImageIcon, FileText } from "lucide-react";

const ChatInterface = ({ isOpen, onClose, recipient }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    if (inputText.trim()) {
      setMessages([
        ...messages,
        { type: "text", content: inputText, timestamp: new Date() },
      ]);
      setInputText("");
    }
  };

  const handleVoiceMessage = () => {
    setMessages([
      ...messages,
      { type: "voice", content: "Voice message", timestamp: new Date() },
    ]);
  };

  const handleImageUpload = () => {
    setMessages([
      ...messages,
      { type: "image", content: "Image uploaded", timestamp: new Date() },
    ]);
  };

  const handleDocumentUpload = () => {
    setMessages([
      ...messages,
      { type: "document", content: "Document uploaded", timestamp: new Date() },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute bottom-0 right-36 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
      {/* Chat Header */}
      <div className="p-1 bg-gradient-to-r from-blue-500 to-green-300 text-white flex items-center rounded-t-lg">
        <img
          src={recipient.avatar}
          alt={recipient.name}
          className="w-8 h-8 rounded-full mr-3 border-2 border-white"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-sm truncate">{recipient.name}</h3>
          <span className="text-xs text-blue-200">Active Now</span>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-blue-600 bg-blue-700 rounded-full focus:outline-none transition-all"
        >
          <X size={16} />
        </button>
      </div>

      {/* Messages Container */}
      <div className="h-72 overflow-y-auto p-3 space-y-3 bg-gray-50">
        {messages.map((msg, index) => (
          <div key={index} className="flex flex-col">
            <div className="bg-blue-100 p-3 rounded-xl shadow-md self-end max-w-[80%] text-sm">
              <p>{msg.content}</p>
              <span className="text-xs text-gray-400 block mt-1 text-right">
                {msg.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-3 bg-gray-100 border-t border-gray-300">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-md hover:opacity-90 focus:outline-none transition-all"
          >
            <Send size={16} />
          </button>
        </div>

        {/* Additional Options */}
        <div className="flex justify-center space-x-4 mt-2">
          <button
            onClick={handleVoiceMessage}
            className="p-2 text-gray-500 hover:text-blue-600 focus:outline-none transition-all"
            title="Send voice message"
          >
            <Mic size={18} />
          </button>
          <button
            onClick={handleImageUpload}
            className="p-2 text-gray-500 hover:text-blue-600 focus:outline-none transition-all"
            title="Send image"
          >
            <ImageIcon size={18} />
          </button>
          <button
            onClick={handleDocumentUpload}
            className="p-2 text-gray-500 hover:text-blue-600 focus:outline-none transition-all"
            title="Send document"
          >
            <FileText size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
