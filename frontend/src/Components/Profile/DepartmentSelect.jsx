import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { fetchDepartments } from "../../utils/profileInfo";

const DepartmentSelect = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const data = await fetchDepartments();
      setDepartments(data.departments);
    } catch (err) {
      setError("Failed to load departments");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full p-2 text-left border rounded text-gray-500">
        Loading departments...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-2 text-left border rounded text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2 text-left border rounded flex justify-between items-center"
      >
        <span>{value || "Select Department"}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {departments.map((dept) => (
            <button
              key={dept.id}
              type="button"
              onClick={() => {
                onChange(dept.name);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left hover:bg-blue-50 ${
                value === dept.name ? "bg-blue-50" : ""
              }`}
            >
              {dept.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DepartmentSelect;
