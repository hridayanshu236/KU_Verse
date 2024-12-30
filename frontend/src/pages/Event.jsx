import React, { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
import { format, isValid } from "date-fns";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faCalendar,
  faUsers,
  faClock,
  faLocationDot,
  faXmark,
  faCheck,
  faCalendarPlus,
  faUser,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../components/Navbar";
import CreateEventModal from "../components/CreateEventModal";
import {
  fetchFeedEvents,
  getAllEvents,
  getMyEvents,
  registerForEvent,
  getRegisteredEvents,
  getEventsForYou,
} from "../utils/eventServices";
import { useUser } from "../contexts/userContext";

const Events = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState("");
  const { user } = useUser();
  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };
  const tabs = [
    "Events For You",
    "All Events",
    "My Events",
    "Registered Events",
  ];

  useEffect(() => {
    loadEvents();
  }, [activeTab]);

  const loadEvents = async () => {
    setLoading(true);
    setError("");
    try {
      let eventsData;
      switch (activeTab) {
        case 0: // Events For You
          eventsData = await getEventsForYou();
          break;
        case 1: // All Events
          eventsData = await getAllEvents();
          break;
        case 2:
          eventsData = await getMyEvents();
          break;
        case 3:
          eventsData = await getRegisteredEvents();
          break;
        default:
          eventsData = await getAllEvents();
      }
      setEvents(eventsData?.events || []);
    } catch (error) {
      console.error("Failed to load events:", error);
      setError(error.response?.data?.message || "Failed to load events");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEventCreated = (newEvent) => {
    setEvents((prev) => [newEvent, ...prev]);
    loadEvents();
  };

  const formatEventDate = (date) => {
    const eventDate = new Date(date);
    if (!isValid(eventDate)) {
      return "Invalid date";
    }
    return format(eventDate, "PPP p");
  };

  const AttendeesList = ({ attendees, title, isCompact = false }) => {
    if (!attendees?.length) return null;

    return (
      <div className="mt-2 mb-3">
        {title && (
          <h4 className="text-xs font-medium text-gray-700 mb-1.5">{title}</h4>
        )}
        <div className="flex flex-wrap gap-1.5">
          {isCompact ? (
            <div className="flex items-center">
              <div className="flex -space-x-2">
                {attendees.slice(0, 3).map((attendee) => (
                  <img
                    key={attendee._id}
                    src={attendee.profilePicture || "/default-avatar.png"}
                    alt={attendee.fullName}
                    className="w-6 h-6 rounded-full border-2 border-white"
                  />
                ))}
              </div>
              {attendees.length > 3 && (
                <span className="ml-2 text-xs text-gray-600">
                  +{attendees.length - 3} more
                </span>
              )}
            </div>
          ) : (
            attendees.map((attendee) => (
              <div
                key={attendee._id}
                className="flex items-center bg-gray-50 rounded-full px-2 py-0.5"
              >
                <img
                  src={attendee.profilePicture || "/default-avatar.png"}
                  alt={attendee.fullName}
                  className="w-5 h-5 rounded-full mr-1.5"
                />
                <span className="text-xs text-gray-700">
                  {attendee.fullName}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const EventCard = ({ event }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const isCreator = event.isCreator;
    const isRegistered = event.attendance?.some(
      (attendee) => attendee._id === user?._id
    );

    const handleAttendance = async (e, eventId) => {
      e.stopPropagation(); // Prevent event bubbling to parent click handler
      if (isRegistering) return;
      setIsRegistering(true);
      try {
        await registerForEvent(eventId);
        loadEvents();
      } catch (error) {
        alert(error.response?.data?.message || "Failed to update attendance");
      } finally {
        setIsRegistering(false);
      }
    };

    const renderAttendees = () => {
      if (isCreator) {
        return (
          <AttendeesList
            attendees={event.attendees}
            title={`Attendees (${event.totalAttendees})`}
          />
        );
      }

      if (event.friendsCount > 0) {
        return (
          <AttendeesList
            attendees={event.attendees}
            title={`Friends Going (${event.friendsCount})`}
            isCompact={true}
          />
        );
      }

      return null;
    };

    return (
      <div
        onClick={() => handleEventClick(event._id)}
        className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] duration-300 cursor-pointer"
      >
        {event.photo && (
          <div className="h-40 overflow-hidden">
            <img
              src={event.photo}
              alt={event.eventName}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-bold text-purple-800">
              {event.eventName}
            </h3>
            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
              {event.eventType}
            </span>
          </div>

          <p className="text-gray-600 mb-3 text-sm line-clamp-2">
            {event.description}
          </p>

          <div className="space-y-1.5 mb-3">
            <div className="flex items-center text-gray-500 text-sm">
              <FontAwesomeIcon icon={faCalendar} className="w-4 h-4 mr-2" />
              <span>{formatEventDate(event.date)}</span>
            </div>

            <div className="flex items-center text-gray-500 text-sm">
              <FontAwesomeIcon icon={faClock} className="w-4 h-4 mr-2" />
              <span>{event.duration} hours</span>
            </div>

            <div className="flex items-center text-gray-500 text-sm">
              <FontAwesomeIcon icon={faUsers} className="w-4 h-4 mr-2" />
              <span>{event.organizer}</span>
            </div>

            {event.createdBy && (
              <div className="flex items-center text-gray-500 text-sm">
                <FontAwesomeIcon icon={faUserGroup} className="w-4 h-4 mr-2" />
                <span>Created by: {event.createdBy.fullName}</span>
              </div>
            )}

            <div className="flex items-center text-gray-500 text-sm">
              <FontAwesomeIcon icon={faUsers} className="w-4 h-4 mr-2" />
              <span>
                {event.totalAttendees || 0}{" "}
                {event.totalAttendees === 1 ? "person" : "people"} going
              </span>
            </div>
          </div>

          {renderAttendees()}

          {/* Prevent event propagation for buttons */}
          {!isCreator && (
            <button
              onClick={(e) => {
                e.stopPropagation(); // Stop click event from bubbling up
                handleAttendance(e, event._id);
              }}
              disabled={isRegistering}
              className={`flex items-center justify-center w-full py-2 px-4 rounded-lg transition-colors duration-200 ${
                isRegistered
                  ? "bg-green-100 text-green-700"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              } ${isRegistering ? "opacity-50" : ""}`}
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
                : "Interested"}
            </button>
          )}

          {isCreator && (
            <div
              onClick={(e) => e.stopPropagation()} // Stop propagation for creator badge
              className="flex items-center justify-center w-full bg-gray-100 text-gray-600 py-2 px-4 rounded-lg"
            >
              <FontAwesomeIcon icon={faUser} className="w-4 h-4 mr-2" />
              Your Event
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-purple-800">Events</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faPlus} className="w-5 h-5" />
            Create Event
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <Tab.Group onChange={setActiveTab}>
          <Tab.List className="flex space-x-4 border-b border-gray-200 mb-8">
            {tabs.map((tab) => (
              <Tab
                key={tab}
                className={({ selected }) =>
                  `px-4 py-2 text-sm font-medium focus:outline-none whitespace-nowrap
                  ${
                    selected
                      ? "text-purple-600 border-b-2 border-purple-600"
                      : "text-gray-500 hover:text-purple-600"
                  }`
                }
              >
                {tab}
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels>
            {tabs.map((_, idx) => (
              <Tab.Panel key={idx}>
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                  </div>
                ) : events.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                      <EventCard key={event._id} event={event} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-12">
                    <FontAwesomeIcon
                      icon={faCalendar}
                      className="w-16 h-16 mx-auto mb-4 text-gray-400"
                    />
                    <h3 className="text-lg font-medium mb-2">
                      No events found
                    </h3>
                    <p>There are no events to display at this time.</p>
                  </div>
                )}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>

      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEventCreated={handleEventCreated}
      />
    </div>
  );
};

export default Events;
