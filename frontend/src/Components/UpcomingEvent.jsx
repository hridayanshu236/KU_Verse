import React, { useState, useEffect } from "react";
import { getRegisteredEvents } from "../utils/eventServices";
import { useNavigate } from "react-router-dom";

const UpcomingEvents = ({ limit, className }) => {
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
        const data = await getRegisteredEvents();
        // Sort by date and take only upcoming events
        const upcomingEvents = data.events
          .filter((event) => new Date(event.date) > new Date())
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, limit || 10);
        setEvents(upcomingEvents);
      } catch (error) {
        setError("Failed to load events");
        console.error("Error loading events:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [limit]);

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
        <h2 className="text-lg font-semibold text-purple-800 mb-3">
          Upcoming Events
        </h2>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
        <h2 className="text-lg font-semibold text-purple-800 mb-3">
          Upcoming Events
        </h2>
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
        <h2 className="text-lg font-semibold text-purple-800 mb-3">
          Upcoming Events
        </h2>
        <p className="text-gray-500 text-sm">No upcoming events</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      <h2 className="text-lg font-semibold text-purple-800 mb-3">
        Upcoming Events
      </h2>
      <div className="space-y-3">
        {events.map((event) => (
          <div
            key={event._id}
            onClick={() => handleEventClick(event._id)}
            className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <h3 className="font-medium text-gray-800">{event.eventName}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {new Date(event.date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
            <p className="text-sm text-gray-500 mt-1">{event.organizer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEvents;
