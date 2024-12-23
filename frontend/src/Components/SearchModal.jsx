import React, { useState, useCallback, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SearchModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  // Debounce search function
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Search users API call
  const searchUsers = async (query) => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/user/users?search=${query}`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((query) => searchUsers(query), 300),
    []
  );

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
    setIsOpen(false);
    setSearchQuery("");
    setUsers([]);
  };

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(true)}
        className="flex items-center bg-gray-100 px-4 py-2 rounded-full cursor-pointer"
      >
        <Search className="h-5 w-5 text-gray-400" />
        <span className="ml-2 text-gray-500">Search KU-Verse...</span>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4"
          >
            <div className="p-3 border-b">
              <div className="relative flex items-center">
                <Search className="h-5 w-5 text-gray-400 absolute left-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search KU-Verse"
                  className="w-full pl-10 pr-8 py-2 bg-gray-100 rounded-full focus:outline-none"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3"
                  >
                    <X className="h-5 w-5 text-gray-400" />
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {loading ? (
                <div className="flex justify-center p-4">
                  <div className="w-6 h-6 border-t-2 border-purple-500 rounded-full animate-spin"></div>
                </div>
              ) : users.length > 0 ? (
                <div>
                  {users.map((user) => (
                    <div
                      key={user._id}
                      onClick={() => handleUserClick(user._id)}
                      className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                    >
                      <img
                        src={user.profilePicture || "/default-avatar.png"}
                        alt={user.fullName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="ml-3">
                        <p className="font-medium text-sm">{user.fullName}</p>
                        <p className="text-xs text-gray-500">
                          {user.department || "Student"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchQuery ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  No results found
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500 text-sm">
                  Try searching for people
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchModal;