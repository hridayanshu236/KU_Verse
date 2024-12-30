import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  Users,
  Loader,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { fetchRecommendations, addFriend } from "../../utils/userServices";
const RecommendedConnections = ({ onConnect, connections }) => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connecting, setConnecting] = useState(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const itemsPerView = 3;
  const handleProfileClick = (userId, e) => {
    if (e.target.closest("button")) return;
    navigate(`/profile/${userId}`);
  };

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchRecommendations(12);
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
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    } finally {
      setConnecting((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const nextSlide = () => {
    if (currentIndex < recommendations.length - itemsPerView) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="w-full md:w-3/5 lg:w-1/2 bg-white rounded-lg shadow-lg p-6 mt-6">
        <div className="flex items-center justify-center py-8">
          <Loader className="h-8 w-8 animate-spin text-purple-800" />
          <span className="ml-2 text-gray-600">Finding connections...</span>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <div className="w-full md:w-3/5 lg:w-1/2 bg-white rounded-lg shadow-lg p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6 text-purple-700" />
          <h2 className="text-xl font-semibold text-gray-800">
            People You May be interested in.
          </h2>
        </div>
      </div>

      <div className="relative">
        {currentIndex > 0 && (
          <button
            onClick={prevSlide}
            className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>
        )}

        <div className="overflow-hidden" ref={carouselRef}>
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            }}
          >
            {recommendations.map(
              ({ user, similarityScore, skillMatch, mutualConnections }) => (
                <div key={user._id} className="flex-none w-1/3 px-2">
                  <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                    <div
                      className="flex flex-col items-center hover:shadow-md transition-shadow cursor-pointer"
                      onClick={(e) => handleProfileClick(user._id, e)}
                    >
                      <img
                        src={user.profilePicture || "/api/placeholder/96/96"}
                        alt={user.fullName}
                        className="w-24 h-24 rounded-full object-cover mb-3"
                      />
                      <h3 className="font-medium text-gray-900 text-center">
                        {user.fullName}
                      </h3>
                      <p className="text-sm text-gray-500 text-center mb-2">
                        {user.department}
                      </p>
                      {skillMatch > 0 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2">
                          {skillMatch}% skill match
                        </span>
                      )}
                      {mutualConnections > 0 && (
                        <p className="text-xs text-gray-500 mb-3">
                          {mutualConnections} mutual connection
                          {mutualConnections > 1 ? "s" : ""}
                        </p>
                      )}
                      <button
                        onClick={() => handleConnect(user._id)}
                        disabled={connecting.has(user._id)}
                        className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-purple-800 bg-purple-50 rounded-full hover:bg-purple-60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {connecting.has(user._id) ? (
                          <>
                            <Loader className="h-4 w-4 animate-spin mr-2" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Connect
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {currentIndex < recommendations.length - itemsPerView && (
          <button
            onClick={nextSlide}
            className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50"
          >
            <ChevronRight className="h-6 w-6 text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
};

export default RecommendedConnections;
