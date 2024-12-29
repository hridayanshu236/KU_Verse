import React from "react";

const ErrorMessage = ({ message }) => (
  <div className="flex justify-center items-center h-screen">
    <div className="text-red-500">{message}</div>
  </div>
);

export default ErrorMessage;
