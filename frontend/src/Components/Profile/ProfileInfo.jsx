import React from "react";
import { EditIcon } from "lucide-react";
import ProfilePicture from "./ProfilePicture";
import ConnectionButton from "./ConnectionButton";

const ProfileInfo = ({
  user,
  isCurrentUser,
  connectionStatus,
  onConnect,
  onDisconnect,
  onEdit,
  onUpdatePicture,
}) => (
  <div className="w-full md:w-3/5 lg:w-1/2 bg-white rounded-lg shadow-lg p-6 mt-6">
    <div className="flex items-center gap-6">
      <div className="w-24">
        <ProfilePicture
          src={user.profilePicture}
          isCurrentUser={isCurrentUser}
          onUpdatePicture={onUpdatePicture}
        />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">
              {user.fullName}
            </h1>
            <p className="text-md text-gray-600 font-medium mt-1">
              {user.department}
            </p>
          </div>
          {!isCurrentUser && (
            <ConnectionButton
              status={connectionStatus}
              onConnect={onConnect}
              onDisconnect={onDisconnect}
            />
          )}
          {isCurrentUser && (
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            >
              <EditIcon className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>
        <p className="text-gray-700 mt-3">{user.bio || "No bio available."}</p>
        <div className="space-y-2 mt-2">
          <p className="text-gray-600">
            <strong>Address:</strong> {user.address || "N/A"}
          </p>
          <p className="text-gray-600">
            <strong>Phone:</strong> {user.phoneNumber || "N/A"}
          </p>
          <p className="text-gray-600">
            <strong>Email:</strong> {user.email || "N/A"}
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default ProfileInfo;
