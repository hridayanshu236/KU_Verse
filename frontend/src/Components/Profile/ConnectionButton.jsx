import React from "react";
import { UserPlus, UserCheck } from "lucide-react";

const ConnectionButton = ({ status, onConnect, onDisconnect }) => {
  if (status === "NOT_CONNECTED") {
    return (
      <button
        onClick={onConnect}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
      >
        <UserPlus className="w-4 h-4" />
        Connect
      </button>
    );
  }

  return (
    <button
      onClick={onDisconnect}
      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
    >
      <UserCheck className="w-4 h-4" />
      Connected
    </button>
  );
};

export default ConnectionButton;
