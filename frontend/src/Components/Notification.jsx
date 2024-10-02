import React from "react";
import notificationsData from "../assets/dummyNotification.json";
import profile_1 from "../assets/default.svg";
const Notification = () => {
    return (
      <>
        <ul className="text-gray-700">
          {notificationsData.notifications.map((notification) => (
            <li
              key={notification.id}
              className="flex items-center p-2 hover:bg-gray-100 rounded"
            >
              <img
                src={profile_1}
                alt={notification.from.name}
                className="w-10 h-10 object-cover rounded-full mr-3"
              />
              <div>
                <p className="text-sm font-bold">{notification.message}</p>
                <p className="text-xs text-gray-500">{notification.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </>
    );
};
export default Notification;
