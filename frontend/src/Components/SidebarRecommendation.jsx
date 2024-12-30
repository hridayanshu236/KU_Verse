import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Users, Loader, UserX } from "lucide-react";
import { fetchRecommendations, addFriend } from "../utils/userServices";

const SidebarRecommendations = ({ onConnect }) => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connecting, setConnecting] = useState(new Set());

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchRecommendations(5); // Reduced number for sidebar
      setRecommendations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (userId) => {
    try {
      setConnecting((prev) => new Set([...prev, userId]));
      await addFriend(userId);
      onConnect?.(userId);
      setRecommendations((prev) =>
        prev.filter((rec) => rec.user._id !== userId)
      );
    } catch (err) {
      console.error(err.message);
    } finally {
      setConnecting((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const handleProfileClick = (userId, e) => {
    if (e.target.closest("button")) return;
    navigate(`/profile/${userId}`);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center justify-center py-4">
          <Loader className="h-6 w-6 animate-spin text-purple-600" />
          <span className="ml-2 text-gray-600">Finding connections...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center text-center">
          <div className="bg-red-50 p-3 rounded-full mb-3">
            <UserX className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-sm text-gray-500 max-w-[200px]">
            {error || "Failed to load recommendations"}
          </p>
          <button
            onClick={loadRecommendations}
            className="mt-4 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center text-center">
          <div className="bg-purple-50 p-3 rounded-full mb-3">
            <UserX className="h-8 w-8 text-purple-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            All Caught Up!
          </h2>
          <p className="text-sm text-gray-500 max-w-[200px]">
            We don't have any new recommendations for you at the moment.
          </p>
          <div className="mt-4 p-3 bg-purple-50 rounded-lg w-full">
            <p className="text-xs text-purple-600 font-medium">
              Check back later for new connections!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 relative">
      <div className="flex items-center space-x-2 mb-4">
        <Users className="h-5 w-5 text-purple-600" />
        <h2 className="text-lg font-semibold text-gray-800">
          Suggested Connections
        </h2>
      </div>

      <div className="space-y-4">
        {recommendations.map(({ user, skillMatch, mutualConnections }) => (
          <div
            key={user._id}
            className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors relative z-10"
          >
            <div
              className="flex items-center cursor-pointer"
              onClick={(e) => handleProfileClick(user._id, e)}
            >
              <img
                src={user.profilePicture || "/default-avatar.png"}
                alt={user.fullName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="ml-3 flex-1">
                <h3 className="font-medium text-gray-900 text-sm">
                  {user.fullName}
                </h3>
                <p className="text-xs text-gray-500">{user.department}</p>
                {mutualConnections > 0 && (
                  <p className="text-xs text-purple-600 mt-1">
                    {mutualConnections} mutual connection
                    {mutualConnections > 1 ? "s" : ""}
                  </p>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleConnect(user._id);
                }}
                disabled={connecting.has(user._id)}
                className="ml-2 p-2 text-purple-600 hover:bg-purple-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {connecting.has(user._id) ? (
                  <Loader className="h-5 w-5 animate-spin" />
                ) : (
                  <UserPlus className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarRecommendations;
