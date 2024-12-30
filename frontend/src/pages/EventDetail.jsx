import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faUsers,
  faClock,
  faLocationDot,
  faCheck,
  faCalendarPlus,
  faArrowLeft,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../components/Navbar";
import { getEventById, registerForEvent } from "../utils/eventServices";
import { format } from "date-fns";

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);


  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const data = await getEventById(eventId);
        if (!data || !data.event) {
          throw new Error("Event data not found");
        }
        setEvent(data.event);
        // Check if the user is in the attendance list
        const isUserRegistered = data.event.attendance?.some(
          (attendee) => attendee._id === data.event.currentUserId
        );
        setIsRegistered(isUserRegistered || data.event.isRegistered);
      } catch (error) {
        console.error("Error loading event details:", error);
        setError(error.message || "Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId]);

  const handleAttendance = async () => {
    if (isRegistering) return;
    try {
      setIsRegistering(true);
      await registerForEvent(eventId);
      const data = await getEventById(eventId);
      if (data && data.event) {
        setEvent(data.event);
        setIsRegistered(!isRegistered); 
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
      alert(error.message || "Failed to update attendance");
    } finally {
      setIsRegistering(false);
    }
  };

  const formatDate = (date) => {
    try {
      return format(new Date(date), "PPP p");
    } catch (error) {
      return "Date not available";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-purple-600 hover:text-purple-800 mb-4"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Go Back
          </button>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error || "Event not found"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-purple-600 hover:text-purple-800 mb-4"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Back 
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {event.photo && (
            <div className="h-64 w-full">
              <img
                src={event.photo}
                alt={event.eventName}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-purple-800 mb-2">
                  {event.eventName}
                </h1>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  {event.eventType}
                </span>
              </div>

              {!event.isCreator && (
                <button
                  onClick={handleAttendance}
                  disabled={isRegistering}
                  className={`flex items-center px-6 py-2 rounded-lg transition-colors duration-200 ${
                    isRegistered
                      ? "bg-green-100 text-green-700"
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  } ${isRegistering ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <FontAwesomeIcon
                    icon={
                      isRegistering
                        ? faClock
                        : isRegistered
                        ? faCheck
                        : faCalendarPlus
                    }
                    className="w-4 h-4 mr-2"
                  />
                  {isRegistering
                    ? "Processing..."
                    : isRegistered
                    ? "Going"
                    : "Register"}
                </button>
              )}
            </div>

            <div className="text-gray-600 mb-6 whitespace-pre-wrap">
              {event.description}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <FontAwesomeIcon icon={faCalendar} className="w-5 h-5 mr-3" />
                  <span>{formatDate(event.date)}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <FontAwesomeIcon icon={faClock} className="w-5 h-5 mr-3" />
                  <span>{event.duration} hours</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <FontAwesomeIcon icon={faUsers} className="w-5 h-5 mr-3" />
                  <span>{event.organizer}</span>
                </div>

                {event.createdBy && (
                  <div className="flex items-center text-gray-600">
                    <FontAwesomeIcon
                      icon={faUserGroup}
                      className="w-5 h-5 mr-3"
                    />
                    <div className="flex items-center">
                      <img
                        src={
                          event.createdBy.profilePicture ||
                          "/default-avatar.png"
                        }
                        alt={event.createdBy.fullName}
                        className="w-6 h-6 rounded-full mr-2"
                      />
                      <span>Created by {event.createdBy.fullName}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {event.location && (
                  <div className="flex items-center text-gray-600">
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      className="w-5 h-5 mr-3"
                    />
                    <span>{event.location}</span>
                  </div>
                )}

                <div className="flex items-center text-gray-600">
                  <FontAwesomeIcon icon={faUsers} className="w-5 h-5 mr-3" />
                  <span>
                    {event.totalAttendees || 0}{" "}
                    {event.totalAttendees === 1 ? "person" : "people"} going
                  </span>
                </div>

                {event.friendsCount > 0 && (
                  <div className="flex items-center text-gray-600">
                    <FontAwesomeIcon
                      icon={faUserGroup}
                      className="w-5 h-5 mr-3"
                    />
                    <span>{event.friendsCount} friends attending</span>
                  </div>
                )}
              </div>
            </div>
            {/* Attendees Section */}
            {event.attendees && event.attendees.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  {event.isCreator ? "All Attendees" : "Friends Attending"}
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({event.attendees.length})
                  </span>
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {event.attendees.map((attendee) => (
                    <div
                      key={attendee._id}
                      className="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <img
                        src={attendee.profilePicture || "/default-avatar.png"}
                        alt={attendee.fullName}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
                      />
                      <div className="ml-3">
                        <span className="text-sm font-medium text-gray-700 block truncate">
                          {attendee.fullName}
                        </span>
                        <span className="text-xs text-gray-500 block truncate">
                          @{attendee.userName}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Event Status Section */}
            <div className="border-t border-gray-200 mt-6 pt-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {new Date(event.date) > new Date()
                      ? "Event starts in"
                      : "Event started"}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    {format(new Date(event.date), "PPP")}
                  </span>
                </div>

                {!event.isCreator && (
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleAttendance}
                      disabled={isRegistering}
                      className={`flex items-center px-6 py-2 rounded-lg transition-colors duration-200 ${
                        isRegistered
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-purple-600 text-white hover:bg-purple-700"
                      } ${
                        isRegistering ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={
                          isRegistering
                            ? faClock
                            : isRegistered
                            ? faCheck
                            : faCalendarPlus
                        }
                        className="w-4 h-4 mr-2"
                      />
                      {isRegistering
                        ? "Processing..."
                        : isRegistered
                        ? "Going"
                        : "Register Now"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Event Location Section (if applicable) */}
            {event.location && (
              <div className="border-t border-gray-200 mt-6 pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Location
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-gray-600">
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      className="w-5 h-5 mr-3 text-purple-600"
                    />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Action Bar */}
            <div className="border-t border-gray-200 mt-6 pt-6 flex justify-between items-center">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-purple-600 transition-colors"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Back 
              </button>

              {event.isCreator && (
                <div className="flex items-center">
                  <span className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg">
                    You created this event
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;