import React, { useState, useEffect } from "react";
import { getEventsForYou } from "../utils/eventServices";
import { useNavigate } from "react-router-dom";

const EventsForYou = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await getEventsForYou();
        console.log("EventsForYou -> response", response);
        setEvents(response.events || []);
      } catch (error) {
        setError("Failed to load recommended events");
        console.error("Error loading events:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold text-purple-800 mb-3">
          Events For You
        </h2>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold text-purple-800 mb-3">
          Events For You
        </h2>
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold text-purple-800 mb-3">
        Events For You
      </h2>
      {events.length === 0 ? (
        <p className="text-gray-500 text-sm">No recommended events found</p>
      ) : (
        <div className="space-y-4">
          {events.slice(0, 3).map((event) => (
            <div
              key={event._id}
              onClick={() => handleEventClick(event._id)}
              className="p-4 bg-gradient-to-r from-purple-50 to-white rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-purple-900">
                    {event.eventName}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {event.description}
                  </p>
                </div>
                {event.photo && (
                  <img
                    src={event.photo}
                    alt={event.eventName}
                    className="w-16 h-16 rounded-lg object-cover ml-4"
                  />
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                  {event.eventType}
                </span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {new Date(event.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {event.friendsCount > 0 && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {event.friendsCount} friends going
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsForYou;
