import React, { useState } from "react";
import { Calendar, Users, MapPin } from "lucide-react";

const EventCard = ({
  title = "Sample Event",
  department = "Computer Science",
  faculty = "Faculty of Engineering",
  date = "2024-12-25",
  location = "Main Auditorium",
  description = "This is a sample event description",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div
      className={`transition-all duration-300 cursor-pointer my-1
        ${
          isExpanded
            ? "bg-gradient-to-r from-green-50 to-white p-4 rounded-lg shadow-md hover:shadow-lg border-l-4 border-l-green-600 border border-gray-100 my-2"
            : " bg-green-100 p-3 hover:bg-green-200 border-b border-gray-100 rounded-md"
        }`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Compact header */}
      <div className="flex items-center gap-3">
        {isExpanded ? (
          <div className="flex-shrink-0 bg-green-100 p-3 rounded-lg">
            <Calendar className="w-12 h-12 text-green-600" />
          </div>
        ) : (
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            {new Date(date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </div>
        )}

        <div className="flex flex-col">
          <h3
            className={`font-semibold ${
              isExpanded ? "text-xl" : "text-base"
            } text-gray-900`}
          >
            {title}
          </h3>
          {!isExpanded && (
            <span className="text-sm text-gray-500">{department}</span>
          )}
        </div>
      </div>

      {/* Expandable content */}
      <div
        className={`grid transition-all duration-300 overflow-hidden
        ${
          isExpanded
            ? "grid-rows-[1fr] opacity-100 mt-4"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex items-start gap-5">
            <div className="w-12" /> {/* Spacing to align with icon */}
            <div className="flex-grow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm bg-green-100 text-green-700">
                    {department}
                  </span>
                  <span className="text-sm text-gray-500">{faculty}</span>
                </div>

                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add your register logic here
                  }}
                >
                  Register Now
                </button>
              </div>

              <p className="text-gray-600 mb-4 leading-relaxed">
                {description}
              </p>

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-green-700">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(date)}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{location}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{department}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center"
                    >
                      <Users className="w-4 h-4 text-gray-500" />
                    </div>
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  +25 people attending
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
