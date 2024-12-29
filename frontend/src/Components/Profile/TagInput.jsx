import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { fetchClubs, fetchSkills } from "../../utils/profileInfo";

const TagInput = ({ placeholder, onAdd, error, type = "text" }) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [clubs, setClubs] = useState([]);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    if (type === "club") {
      loadClubs();
    } else if (type === "skill") {
      loadSkills();
    }
  }, [type]);

  const loadClubs = async () => {
    try {
      setLoading(true);
      const response = await fetchClubs();
      const clubsWithIds = (response.clubs || []).map((club, index) => ({
        ...club,
        _id: club._id || `club-${index}`,
      }));
      setClubs(clubsWithIds);
    } catch (err) {
      console.error("Error loading clubs:", err);
      setClubs([]);
    } finally {
      setLoading(false);
    }
  };

  const loadSkills = async () => {
    try {
      setLoading(true);
      const response = await fetchSkills();
      const skillsWithIds = (response.skills || []).map((skill, index) => ({
        ...skill,
        _id: skill._id || `skill-${index}`,
      }));
      setSkills(skillsWithIds);
    } catch (err) {
      console.error("Error loading skills:", err);
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length > 0) {
      let filtered = [];
      if (type === "club") {
        filtered = clubs.filter((club) =>
          club?.name?.toLowerCase().includes(value.toLowerCase())
        );
      } else if (type === "skill") {
        filtered = skills.filter((skill) =>
          skill?.name?.toLowerCase().includes(value.toLowerCase())
        );
      }
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

  const handleSuggestionClick = (item) => {
    if (item?.name) {
      onAdd(item.name);
      setInputValue("");
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
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
              (type === "club" || type === "skill") &&
              inputValue &&
              setShowSuggestions(true)
            }
            onBlur={handleBlur}
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

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {suggestions.map(
            (item, index) =>
              item && (
                <button
                  key={item._id || `suggestion-${type}-${index}`}
                  type="button"
                  onClick={() => handleSuggestionClick(item)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 focus:bg-blue-50 focus:outline-none flex items-center gap-2"
                >
                  <span>{item.name}</span>
                  {item.category && (
                    <span className="text-xs text-gray-500">
                      ({item.category})
                    </span>
                  )}
                </button>
              )
          )}
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default TagInput;
