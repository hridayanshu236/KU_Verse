import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  faBell,
  faCommentDots,
  faCog,
  faSearch,
  faUser,
  faSignOutAlt,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import Notification from "./Notification";
import { useUser } from "../contexts/userContext";

const Navbar = () => {
  const [profileDropDown, setProfileDropDown] = useState(false);
  const [NotificationDropDown, setNotificationDropDown] = useState(false);
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
    <nav className="bg-white shadow-md px-4 py-3 mdd:flex justify-between items-center ">
      <div className="flex items-center ">
        <div>
          <h1 className="text-lg font-bold text-[rgb(103,80,164)]">KU-Verse</h1>
        </div>
        <div className="mdd:hidden flex items-center ml-auto bg-gray-100 px-2 py-1 rounded-full w-1/3 ">
          <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-full pl-2 text-gray-700"
          />
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
      <div className="mdd:flex hidden items-center bg-gray-100 px-2 py-1 rounded-full w-1/3 ">
        <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent focus:outline-none w-full pl-2 text-gray-700"
        />
      </div>

      <div className="mdd:flex flex justify-center px-4 text-[rgb(103,80,164)] ">
        <NavLink to="/feed">
          <FontAwesomeIcon
            icon={faHome}
            className="w-6 h-6 cursor-pointer px-4 py-2"
          />
        </NavLink>
        <div className="relative">
          <FontAwesomeIcon
            icon={faBell}
            className="w-6 h-6 cursor-pointer px-4 py-2"
            onClick={() => setNotificationDropDown(!NotificationDropDown)}
          />
          {NotificationDropDown && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white shadow-lg text-[rgb(103,80,164)] mdd:text-xl text-sm p-5 rounded-lg cursor-pointer">
              <Notification />
            </div>
          )}
        </div>
        <NavLink to="/chats">
          <FontAwesomeIcon
            icon={faCommentDots}
            className="w-6 h-6 cursor-pointer px-4 py-2"
          />
        </NavLink>
        <div className="mdd:flex hidden px-3 py-1">
          <img
            src={user?.profilePicture || "default_avatar_url"}
            alt="profile"
            className="w-8 h-8 object-cover rounded-full cursor-pointer"
            onClick={() => setProfileDropDown(!profileDropDown)}
          />
        </div>
      </div>
      {profileDropDown && (
        <div className="absolute right-8 top-14 text-[rgb(103,80,164)] bg-white mdd:text-xl text-sm shadow-lg p-5 rounded-lg">
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
