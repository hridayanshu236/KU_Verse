import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLinkedin,
  faFacebook,
  faInstagram,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelope,
  faPhone,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";

const Footerlanding = () => {
  const currentYear = new Date().getFullYear();
  const currentDate = new Date("2025-01-04T09:37:03Z");

  return (
    <footer className="bg-gradient-to-r from-purple-800 to-purple-900 text-white py-10">
      <div className="container mx-auto px-6 space-y-10">
        {/* Main Footer Content - Horizontal Layout */}
        <div className="flex flex-col max-mdd:flex-col mdd:flex-row justify-between items-start mdd:items-center gap-10">
          {/* Brand and Social */}
          <div className="flex flex-col items-start mdd:items-center gap-6">
            <h3 className="text-3xl font-bold font-playfair">KU Verse</h3>
            <div className="flex space-x-8">
              <a href="#" className="hover:text-purple-400 transition-colors">
                <FontAwesomeIcon icon={faGithub} className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-purple-400 transition-colors">
                <FontAwesomeIcon icon={faLinkedin} className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-purple-400 transition-colors">
                <FontAwesomeIcon icon={faInstagram} className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex flex-wrap justify-center gap-8">
            <span className="flex items-center gap-3">
              <FontAwesomeIcon
                icon={faLocationDot}
                className="text-purple-300"
              />
              <span className="text-sm">Kathmandu, Nepal</span>
            </span>
            <span className="flex items-center gap-3">
              <FontAwesomeIcon icon={faPhone} className="text-purple-300" />
              <span className="text-sm">+977 9876543210</span>
            </span>
            <span className="flex items-center gap-3">
              <FontAwesomeIcon icon={faEnvelope} className="text-purple-300" />
              <span className="text-sm">Kuverse69@gmail.com</span>
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-purple-700/50"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col mdd:flex-row justify-between items-center gap-8">
          <div className="flex flex-col mdd:flex-row items-center gap-4">
            <p className="text-sm text-purple-200">
              © {currentYear} KU Verse. All rights reserved.
            </p>
            <p className="text-xs text-purple-300">
              Last updated: {currentYear}
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="#"
              className="text-sm text-purple-200 hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm text-purple-200 hover:text-white transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-sm text-purple-200 hover:text-white transition-colors"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footerlanding;
