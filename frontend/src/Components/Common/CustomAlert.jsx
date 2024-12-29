import React from "react";

const CustomAlert = ({ children }) => (
  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
    <div className="flex">
      <div className="flex-1">
        <p className="text-sm text-red-700">{children}</p>
      </div>
    </div>
  </div>
);

export default CustomAlert;
