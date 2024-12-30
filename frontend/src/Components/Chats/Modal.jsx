// src/components/Modal.js
import React, { useEffect } from "react";

const Modal = ({ isOpen, onClose, title, children }) => {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          {/* Modal Content */}
          <div
            className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all w-11/12 md:w-1/3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">{title}</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800 transition-colors"
              >
                &times;
              </button>
            </div>

            {/* Body */}
            <div className="p-4">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
