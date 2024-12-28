import React, { useState } from "react";

const TagInput = ({ placeholder, onAdd, error }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
          error ? "border-red-500" : "border-gray-200"
        }`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </form>
  );
};

export default TagInput;
