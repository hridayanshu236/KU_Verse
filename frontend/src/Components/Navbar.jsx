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
  faCalendarAlt,
  faBookmark,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../contexts/userContext";

const Navbar = () => {
  const [profileDropDown, setProfileDropDown] = useState(false);
  const { user, setUser, fetchUserDetails } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) {
        await fetchUserDetails();
      }
    };
    loadUserData();

    const handleClickOutside = (event) => {
      if (!event.target.closest(".profile-dropdown")) {
        setProfileDropDown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [user, fetchUserDetails]);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
      setProfileDropDown(false);
      navigate("/login");
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  return (
    <nav className="bg-white shadow-md px-4 py-3 mdd:flex justify-between items-center relative z-50">
      {/* Left Section */}
      <div className="flex items-center">
        <div>
          <h1 className="text-lg font-bold text-[rgb(103,80,164)]">KU-Verse</h1>
        </div>
        {/* Mobile Search and Profile */}
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

      {/* Desktop Search */}
      <div className="mdd:flex hidden w-1/3">
        <SearchModal />
      </div>

      {/* Navigation Icons */}
      <div className="mdd:flex flex justify-center px-4 text-[rgb(103,80,164)]">
        <NavLink to="/feed" className="relative group">
          <FontAwesomeIcon
            icon={faHome}
            className="w-6 h-6 cursor-pointer px-4 py-2 hover:text-purple-800 transition-colors"
          />
        </NavLink>

        <NavLink to="/events" className="relative group">
          <FontAwesomeIcon
            icon={faCalendarAlt}
            className="w-6 h-6 cursor-pointer px-4 py-2 hover:text-purple-800 transition-colors"
          />
        </NavLink>

        <NavLink to="/chats" className="relative group">
          <FontAwesomeIcon
            icon={faCommentDots}
            className="w-6 h-6 cursor-pointer px-4 py-2 hover:text-purple-800 transition-colors"
          />
        </NavLink>

        <NavLink to="/saved-posts" className="relative group">
          <FontAwesomeIcon
            icon={faBookmark}
            className="w-6 h-6 cursor-pointer px-4 py-2 hover:text-purple-800 transition-colors"
          />
        </NavLink>

        {/* Profile Picture */}
        <div className="mdd:flex hidden px-3 py-1">
          <img
            src={user?.profilePicture}
            alt="profile"
            className="w-8 h-8 object-cover rounded-full cursor-pointer hover:ring-2 hover:ring-purple-600 transition-all"
            onClick={() => setProfileDropDown(!profileDropDown)}
          />
        </div>
      </div>

      {/* Profile Dropdown */}
      {profileDropDown && (
        <div className="profile-dropdown absolute right-8 top-14 text-[rgb(103,80,164)] bg-white mdd:text-xl text-sm shadow-lg p-5 rounded-lg z-50">
          <ul className="flex flex-col">
            <NavLink to="/profile">
              <li className="flex items-center p-2 hover:bg-gray-200 rounded cursor-pointer">
                <img
                  src={user?.profilePicture}
                  alt="profile"
                  className="w-8 h-8 rounded-full"
                />
                <h1 className="pl-4 font-bold">{user?.fullName}</h1>
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
              onClick={handleLogout}
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