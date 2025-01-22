
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
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../components/Navbar";
import EditEventModal from "../components/EditEventModal";
import {
  getEventById,
  registerForEvent,
  deleteEvent,
} from "../utils/eventServices";
import { format } from "date-fns";

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const data = await getEventById(eventId);
      if (!data || !data.event) {
        throw new Error("Event data not found");
      }
      setEvent(data.event);
      setIsRegistered(
        data.event.attendance?.some(
          (attendee) => attendee._id === data.event.currentUserId
        ) || data.event.isRegistered
      );
    } catch (error) {
      console.error("Error loading event details:", error);
      setError(error.message || "Failed to load event details");
    } finally {
      setLoading(false);
    }
  };

  const handleAttendance = async () => {
    if (isRegistering) return;
    try {
      setIsRegistering(true);
      await registerForEvent(eventId);
      await fetchEventDetails();
      setIsRegistered(!isRegistered);
    } catch (error) {
      console.error("Error updating attendance:", error);
      alert(error.response?.data?.message || "Failed to update attendance");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteEvent(eventId);
      navigate("/events");
    } catch (error) {
      console.error("Error deleting event:", error);
      alert(error.response?.data?.message || "Failed to delete event");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEventUpdated = (updatedEvent) => {
    setEvent(updatedEvent);
    setShowEditModal(false);
  };

  const formatEventDate = (date) => {
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
          Back to Events
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
                    className={`w-4 h-4 mr-2 ${
                      isRegistering ? "animate-spin" : ""
                    }`}
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

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <FontAwesomeIcon icon={faCalendar} className="w-5 h-5 mr-3" />
                  <span>{formatEventDate(event.date)}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <FontAwesomeIcon icon={faClock} className="w-5 h-5 mr-3" />
                  <span>{event.duration} hours</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <FontAwesomeIcon icon={faUsers} className="w-5 h-5 mr-3" />
                  <span>{event.organizer}</span>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
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

            {/* Creator Actions */}
            {event.isCreator && (
              <div className="border-t border-gray-200 mt-6 pt-6 flex justify-end space-x-4">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="flex items-center px-6 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                >
                  <FontAwesomeIcon icon={faEdit} className="w-4 h-4 mr-2" />
                  Edit Event
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center px-6 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                >
                  <FontAwesomeIcon
                    icon={isDeleting ? faClock : faTrash}
                    className={`w-4 h-4 mr-2 ${
                      isDeleting ? "animate-spin" : ""
                    }`}
                  />
                  {isDeleting ? "Deleting..." : "Delete Event"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Edit Modal */}
        <EditEventModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          event={event}
          onEventUpdated={handleEventUpdated}
        />
      </div>
    </div>
  );
};

export default EventDetails;
