import React, { useState, useRef } from "react";
import { Eye, Camera, X } from "lucide-react";
import { updateProfilePicture } from "../../utils/userServices";

const ProfilePicture = ({ src, isCurrentUser, onUpdatePicture }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const newProfilePicUrl = await updateProfilePicture(file);
      onUpdatePicture(newProfilePicUrl);
      setShowMenu(false);
    } catch (error) {
      console.error("Error updating profile picture:", error);
      alert("Failed to update profile picture: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = isCurrentUser
    ? [
        {
          icon: <Eye className="w-5 h-5" />,
          label: "View",
          angle: -45,
          action: () => setShowModal(true),
        },
        {
          icon: <Camera className="w-5 h-5" />,
          label: "Update",
          angle: 45,
          action: () => fileInputRef.current?.click(),
        },
      ]
    : [
        {
          icon: <Eye className="w-5 h-5" />,
          label: "View",
          angle: 0,
          action: () => setShowModal(true),
        },
      ];

  return (
    <div className="relative group">
      <div
        className="relative w-24 h-24 rounded-full shadow-lg overflow-hidden cursor-pointer"
        onMouseEnter={() => setShowMenu(true)}
        onMouseLeave={() => setShowMenu(false)}
      >
        <img
          src={src || "https://via.placeholder.com/150"}
          alt="Profile"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {showMenu && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-14 h-16">
              {menuItems.map((item, index) => {
                const angle = item.angle;
                const radian = (angle * Math.PI) / 180;
                const x = Math.cos(radian) * 24;
                const y = Math.sin(radian) * 24;

                return (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className="absolute p-1.5 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 hover:bg-blue-50 transition-colors duration-200"
                    style={{
                      left: `50%`,
                      top: `50%`,
                      transform: `translate(${x}px, ${y}px)`,
                    }}
                  >
                    <div className="w-4 h-4">{item.icon}</div>
                    <span className="absolute hidden group-hover/item:block whitespace-nowrap bg-black text-white text-xs py-1 px-2 rounded -bottom-6 left-1/2 transform -translate-x-1/2">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />

      {showModal && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] mx-4">
            <button
              onClick={() => setShowModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-blue-400 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={src || "https://via.placeholder.com/400"}
              alt="Profile"
              className="max-w-full max-h-[80vh] rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePicture;
