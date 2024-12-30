import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import SearchModal from "./SearchModal";
import {
  faCommentDots,
  faCog,
  faSignOutAlt,
  faHome,
  faCalendarAlt, // Added for events
  faBookmark, // Added for saved posts
} from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../contexts/userContext";

const Navbar = () => {
  const [profileDropDown, setProfileDropDown] = useState(false);
  const { user, fetchUserDetails } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      fetchUserDetails();
    }
  }, [user, fetchUserDetails]);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
      console.log("Logout successful");
      navigate("/login");
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  return (
    <nav className="bg-white shadow-md px-4 py-3 mdd:flex justify-between items-center relative z-50">
      <div className="flex items-center">
        <div>
          <h1 className="text-lg font-bold text-[rgb(103,80,164)]">KU-Verse</h1>
        </div>
        <div className="mdd:hidden flex ml-auto w-1/3">
          <SearchModal />
        </div>
        <div className="mdd:hidden px-3 py-1">
          <img
            src={user?.profilePicture}
            alt="profile"
            className="w-8 h-8 object-cover rounded-full cursor-pointer"
            onClick={() => setProfileDropDown(!profileDropDown)}
          />
        </div>
      </div>

      <div className="mdd:flex hidden w-1/3">
        <SearchModal />
      </div>

      <div className="mdd:flex flex justify-center px-4 text-[rgb(103,80,164)]">
        {/* Home Icon */}
        <NavLink to="/feed">
          <FontAwesomeIcon
            icon={faHome}
            className="w-6 h-6 cursor-pointer px-4 py-2 hover:text-purple-800 transition-colors"
          />
        </NavLink>

        {/* Events Icon */}
        <NavLink to="/events">
          <FontAwesomeIcon
            icon={faCalendarAlt}
            className="w-6 h-6 cursor-pointer px-4 py-2 hover:text-purple-800 transition-colors"
          />
        </NavLink>

        {/* Messages Icon */}
        <NavLink to="/chats">
          <FontAwesomeIcon
            icon={faCommentDots}
            className="w-6 h-6 cursor-pointer px-4 py-2 hover:text-purple-800 transition-colors"
          />
        </NavLink>

        {/* Saved Posts Icon */}
        <NavLink to="/saved-posts">
          <FontAwesomeIcon
            icon={faBookmark}
            className="w-6 h-6 cursor-pointer px-4 py-2 hover:text-purple-800 transition-colors"
          />
        </NavLink>

        {/* Profile Picture */}
        <div className="mdd:flex hidden px-3 py-1">
          <img
            src={user?.profilePicture || "default_avatar_url"}
            alt="profile"
            className="w-8 h-8 object-cover rounded-full cursor-pointer hover:ring-2 hover:ring-purple-600 transition-all"
            onClick={() => setProfileDropDown(!profileDropDown)}
          />
        </div>
      </div>

      {/* Profile Dropdown */}
      {profileDropDown && (
        <div className="absolute right-8 top-14 text-[rgb(103,80,164)] bg-white mdd:text-xl text-sm shadow-lg p-5 rounded-lg z-50">
          <ul className="flex flex-col">
            <NavLink to="/profile">
              <li className="flex items-center p-2 hover:bg-gray-200 rounded cursor-pointer">
                <img
                  src={user?.profilePicture || "default_avatar_url"}
                  alt="profile"
                  className="w-8 h-8 rounded-full"
                />
                <h1 className="pl-4 font-bold">
                  {user?.fullName || "Profile Name"}
                </h1>
              </li>
            </NavLink>
            <NavLink to="/settings">
              <li className="flex items-center p-2 hover:bg-gray-200 rounded cursor-pointer">
                <FontAwesomeIcon icon={faCog} className="mr-2" />
                <h1 className="pl-4 font-bold">Settings</h1>
              </li>
            </NavLink>
            <li
              className="flex items-center p-2 hover:bg-gray-200 rounded cursor-pointer"
              onClick={() => handleLogout()}
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
              <h1 className="pl-4 font-bold">Logout</h1>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
