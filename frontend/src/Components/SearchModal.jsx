import React, { useState, useCallback, useEffect, useRef } from "react";
import { Search, X, Users, Calendar, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from 'date-fns';

const SearchModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("all"); // "all", "people", "events"
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const modalRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Handle clicks outside modal to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const searchContent = async (query) => {
    if (!query.trim()) {
      setUsers([]);
      setEvents([]);
      return;
    }

    try {
      setLoading(true);
      const promises = [];

      if (searchType === "all" || searchType === "people") {
        promises.push(
          fetch(`http://localhost:5000/api/user/users?search=${query}`, {
            credentials: "include",
          })
        );
      }

      if (searchType === "all" || searchType === "events") {
        promises.push(
          fetch(`http://localhost:5000/api/event/searchevents?search=${query}`, {
            credentials: "include",
          })
        );
      }

      const responses = await Promise.all(promises);
      const results = await Promise.all(responses.map((r) => r.json()));

      if (searchType === "all") {
        setUsers(results[0].users || []);
        setEvents(results[1].events || []);
      } else if (searchType === "people") {
        setUsers(results[0].users || []);
        setEvents([]);
      } else {
        setUsers([]);
        setEvents(results[0].events || []);
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((query) => searchContent(query), 300),
    [searchType]
  );

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      debouncedSearch(query);
    } else {
      setUsers([]);
      setEvents([]);
    }
  };

  const addToRecentSearches = (item) => {
    const newRecents = [
      item,
      ...recentSearches.filter(
        (recent) => recent.id !== item.id || recent.type !== item.type
      ),
    ].slice(0, 5);

    setRecentSearches(newRecents);
    localStorage.setItem("recentSearches", JSON.stringify(newRecents));
  };

  const handleUserClick = (user) => {
    addToRecentSearches({
      id: user._id,
      type: "user",
      name: user.fullName,
      image: user.profilePicture,
      department: user.department,
    });
    navigate(`/profile/${user._id}`);
    handleClose();
  };

  const handleEventClick = (event) => {
    addToRecentSearches({
      id: event._id,
      type: "event",
      name: event.eventName,
      date: event.date,
    });
    navigate(`/events/${event._id}`);
    handleClose();
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchQuery("");
    setUsers([]);
    setEvents([]);
  };

  const formatEventDate = (date) => {
    const eventDate = new Date(date);
    return formatDistanceToNow(eventDate, { addSuffix: true });
  };

  return (
    <div className="relative">
      {/* Search Trigger Button */}
      <div
        onClick={() => setIsOpen(true)}
        className="flex items-center bg-gray-100 px-4 py-2 rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
      >
        <Search className="h-5 w-5 text-gray-400" />
        <span className="ml-2 text-gray-500">Search KU-Verse...</span>
      </div>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20 px-4">
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden"
          >
            {/* Search Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative flex items-center">
                <Search className="h-5 w-5 text-gray-400 absolute left-3" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search for people or events..."
                  className="w-full pl-10 pr-8 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 hover:bg-gray-200 rounded-full p-1"
                  >
                    <X className="h-4 w-4 text-gray-400" />
                  </button>
                )}
              </div>

              {/* Search Filters */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setSearchType("all")}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    searchType === "all"
                      ? "bg-purple-100 text-purple-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSearchType("people")}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 transition-colors ${
                    searchType === "people"
                      ? "bg-purple-100 text-purple-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Users className="h-4 w-4" />
                  People
                </button>
                <button
                  onClick={() => setSearchType("events")}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 transition-colors ${
                    searchType === "events"
                      ? "bg-purple-100 text-purple-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  Events
                </button>
              </div>
            </div>

            {/* Search Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                </div>
              ) : (
                <div className="p-2">
                  {/* No Query - Show Recent Searches */}
                  {!searchQuery && recentSearches.length > 0 && (
                    <div className="mb-4">
                      <h3 className="px-3 py-2 text-sm font-medium text-gray-500">
                        Recent Searches
                      </h3>
                      {recentSearches.map((item) => (
                        <div
                          key={`${item.type}-${item.id}`}
                          onClick={() => {
                            if (item.type === "user") {
                              handleUserClick({ _id: item.id, ...item });
                            } else {
                              handleEventClick({ _id: item.id, ...item });
                            }
                          }}
                          className="flex items-center px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                        >
                          {item.type === "user" ? (
                            <>
                              <img
                                src={item.image || "/default-avatar.png"}
                                alt={item.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <div className="ml-3">
                                <p className="font-medium text-sm">
                                  {item.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {item.department}
                                </p>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                <Calendar className="h-5 w-5 text-purple-600" />
                              </div>
                              <div className="ml-3">
                                <p className="font-medium text-sm">
                                  {item.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatEventDate(item.date)}
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Users Section */}
                  {(searchType === "all" || searchType === "people") &&
                    users.length > 0 && (
                      <div className="mb-4">
                        <h3 className="px-3 py-2 text-sm font-medium text-gray-500">
                          People
                        </h3>
                        {users.map((user) => (
                          <div
                            key={user._id}
                            onClick={() => handleUserClick(user)}
                            className="flex items-center px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                          >
                            <img
                              src={user.profilePicture || "/default-avatar.png"}
                              alt={user.fullName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="ml-3">
                              <p className="font-medium text-sm">
                                {user.fullName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {user.department || "Student"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  {/* Events Section */}
                  {(searchType === "all" || searchType === "events") &&
                    events.length > 0 && (
                      <div className="mb-4">
                        <h3 className="px-3 py-2 text-sm font-medium text-gray-500">
                          Events
                        </h3>
                        {events.map((event) => (
                          <div
                            key={event._id}
                            onClick={() => handleEventClick(event)}
                            className="flex items-center px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                          >
                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                              <Calendar className="h-5 w-5 text-purple-600" />
                            </div>
                            <div className="ml-3 flex-grow">
                              <p className="font-medium text-sm">
                                {event.eventName}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>{formatEventDate(event.date)}</span>
                                {event.eventType && (
                                  <>
                                    <span>•</span>
                                    <span className="capitalize">
                                      {event.eventType}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="text-xs text-gray-500">
                              {event.totalAttendees} attending
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  {/* No Results */}
                  {searchQuery &&
                    !loading &&
                    users.length === 0 &&
                    events.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-8 px-4">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                          <Search className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-center">
                          No results found for "{searchQuery}"
                        </p>
                        <p className="text-sm text-gray-400 text-center mt-1">
                          Try searching with different keywords or filters
                        </p>
                      </div>
                    )}

                  {/* Empty State */}
                  {!searchQuery && !recentSearches.length && (
                    <div className="flex flex-col items-center justify-center py-8 px-4">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <Search className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-center">
                        Search for people or events
                      </p>
                      <p className="text-sm text-gray-400 text-center mt-1">
                        Try searching by name, department, or event type
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer - Keyboard Shortcuts */}
            {/* <div className="border-t border-gray-200 px-4 py-3">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-gray-100 rounded-md">↑</kbd>
                    <kbd className="px-2 py-1 bg-gray-100 rounded-md">↓</kbd>
                    <span className="ml-1">to navigate</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-gray-100 rounded-md">↵</kbd>
                    <span className="ml-1">to select</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-gray-100 rounded-md">esc</kbd>
                  <span className="ml-1">to close</span>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchModal;