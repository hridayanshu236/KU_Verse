import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { fetchClubs } from "../../utils/profileInfo"; // Update the import path

const TagInput = ({ placeholder, onAdd, error, type = "text" }) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    if (type === "club") {
      loadClubs();
    }
  }, [type]);

  const loadClubs = async () => {
    try {
      const response = await fetchClubs();
      setClubs(response.clubs);
    } catch (err) {
      console.error("Error loading clubs:", err);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (type === "club" && value.length > 0) {
      const filtered = clubs.filter((club) =>
        club.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue("");
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (club) => {
    onAdd(club.name);
    setInputValue("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="relative flex-1">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() =>
              type === "club" && inputValue && setShowSuggestions(true)
            }
            placeholder={placeholder}
            className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
              error ? "border-red-500" : "border-gray-200"
            }`}
            autoComplete="off"
          />
          {loading && (
            <div className="absolute right-3 top-2.5">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {suggestions.map((club) => (
            <button
              key={club._id}
              type="button"
              onClick={() => handleSuggestionClick(club)}
              className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
            >
              {club.name}
            </button>
          ))}
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default TagInput;
