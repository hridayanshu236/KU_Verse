import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaSignInAlt,
  FaUserPlus,
  FaInfoCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const NavbarLanding = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white text-[rgb(103,80,164)] shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link to="/" className="hover:text-purple-800 transition-colors">
            KUVerse
          </Link>
        </div>
        <div className="hidden mdd:flex space-x-6 items-center">
          <Link
            to="/login"
            className="flex items-center hover:text-purple-800 transition-colors font-semibold rounded-md px-3 py-2"
          >
            <FaSignInAlt className="mr-2" />
            Login
          </Link>
          <Link
            to="/signup"
            className="flex items-center hover:text-purple-800 transition-colors font-semibold rounded-md px-3 py-2"
          >
            <FaUserPlus className="mr-2" />
            Signup
          </Link>
          <Link
            to="/about"
            className="flex items-center hover:text-purple-800 transition-colors font-semibold rounded-md px-3 py-2"
          >
            <FaInfoCircle className="mr-2" />
            About Us
          </Link>
        </div>
        <div className="mdd:hidden flex items-center">
          <button onClick={toggleMenu} className="focus:outline-none">
            {isOpen ? (
              <FaTimes className="w-6 h-6" />
            ) : (
              <FaBars className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="mdd:hidden bg-white text-[rgb(103,80,164)]">
          <div className="px-4 py-2">
            <Link
              to="/login"
              className="flex items-center py-2 hover:text-purple-800 transition-colors font-semibold rounded-md px-3 py-2"
              onClick={toggleMenu}
            >
              <FaSignInAlt className="mr-2" />
              Login
            </Link>
            <Link
              to="/signup"
              className="flex items-center py-2 hover:text-purple-800 transition-colors font-semibold rounded-md px-3 py-2"
              onClick={toggleMenu}
            >
              <FaUserPlus className="mr-2" />
              Signup
            </Link>
            <Link
              to="/about"
              className="flex items-center py-2 hover:text-purple-800 transition-colors font-semibold rounded-md px-3 py-2"
              onClick={toggleMenu}
            >
              <FaInfoCircle className="mr-2" />
              About Us
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavbarLanding;
