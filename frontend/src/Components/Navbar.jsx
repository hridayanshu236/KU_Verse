import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCommentDots,
  faCog,
  faSearch,
  faUser,
  faSignOutAlt,
  faHome,
} from "@fortawesome/free-solid-svg-icons"; 
import profile from "../assets/profile.png";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [profileDropDown, setProfileDropDown] = useState(false);

  return (
    <nav className="bg-white shadow-md px-4 py-3 mdd:flex justify-between items-center ">
      
        <div className="flex items-center ">  
          <div>
            <h1 className="text-lg font-bold text-[rgb(103,80,164)]">
              KU-Verse
            </h1>
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
              src={profile}
              alt="profile"
              className="w-8 h-8 object-cover rounded-full cursor-pointer"
              onClick={() => setProfileDropDown(!profileDropDown)}
            />
          </div>
        </div>
      {/* Search Bar */}
      <div className="mdd:flex hidden items-center bg-gray-100 px-2 py-1 rounded-full w-1/3 ">
        <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent focus:outline-none w-full pl-2 text-gray-700"
        />
      </div>

      <div className="mdd:flex flex justify-center px-4 text-[rgb(103,80,164)]">
        <NavLink to="/feed">
        <FontAwesomeIcon
         icon={faHome} 
         className="w-6 h-6 cursor-pointer px-4 py-2" />
        </NavLink>
        <FontAwesomeIcon
          icon={faBell}
          className="w-6 h-6 cursor-pointer px-4 py-2"
        />
        <NavLink to="/chats">
          <FontAwesomeIcon
            icon={faCommentDots}
            className="w-6 h-6 cursor-pointer px-4 py-2"
          />
        </NavLink>
        <div className="mdd:flex hidden px-3 py-1">
          <img
            src={profile}
            alt="profile"
            className="w-8 h-8 object-cover rounded-full cursor-pointer"
            onClick={() => setProfileDropDown(!profileDropDown)}
          />
        </div>
      </div>

      {profileDropDown && (
        <div className="absolute right-8 top-14 text-[rgb(103,80,164)] bg-white text-xl shadow-lg p-5 rounded-md">
          <ul className="flex flex-col">
            <NavLink to="/profile">
              <li className="flex items-center p-2 hover:bg-gray-200 rounded cursor-pointer">
                <FontAwesomeIcon icon={faUser} className="mr-2" />
                Profile
              </li>
            </NavLink>
            <NavLink to="/settings">
              <li className="flex items-center p-2 hover:bg-gray-200 rounded cursor-pointer">
                <FontAwesomeIcon icon={faCog} className="mr-2" />
                Settings
              </li>
            </NavLink>
            <li className="flex items-center p-2 hover:bg-gray-200 rounded cursor-pointer">
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
              Logout
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
