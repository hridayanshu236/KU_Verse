
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { editEvent } from "../utils/eventServices";
import { fetchDepartments, fetchClubs } from "../utils/profileInfo";

const EditEventModal = ({ isOpen, onClose, event, onEventUpdated }) => {
  const [formData, setFormData] = useState({
    eventName: "",
    description: "",
    duration: "",
    date: "",
    eventType: "",
    organizer: "",
    photo: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [departments, setDepartments] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [organizersLoading, setOrganizersLoading] = useState(false);

  useEffect(() => {
    if (isOpen && event) {
      setFormData({
        eventName: event.eventName || "",
        description: event.description || "",
        duration: event.duration || "",
        date: event.date ? new Date(event.date).toISOString().slice(0, 16) : "",
        eventType: event.eventType || "",
        organizer: event.organizer || "",
      });
      loadOrganizers();
    }
  }, [isOpen, event]);

  const loadOrganizers = async () => {
    setOrganizersLoading(true);
    try {
      const [deptData, clubsData] = await Promise.all([
        fetchDepartments(),
        fetchClubs(),
      ]);
      setDepartments(deptData?.departments || []);
      setClubs(clubsData?.clubs || []);
    } catch (error) {
      console.error("Error loading organizers:", error);
      setError("Failed to load organizers");
    } finally {
      setOrganizersLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size should be less than 5MB");
        e.target.value = null;
        return;
      }
      setFormData((prev) => ({
        ...prev,
        photo: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "photo" && formData[key]) {
        submitData.append("file", formData[key]);
      } else if (formData[key]) {
        submitData.append(key, formData[key]);
      }
    });

    try {
      const response = await editEvent(event._id, submitData);
      if (onEventUpdated) {
        onEventUpdated(response.event);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update event");
    } finally {
      setLoading(false);
    }
  };

  const renderOrganizerInput = () => {
    if (organizersLoading) {
      return (
        <div className="w-full p-2 border border-gray-300 rounded-md bg-gray-50">
          <span className="text-gray-500">Loading organizers...</span>
        </div>
      );
    }

    switch (formData.eventType) {
      case "department":
        return (
          <select
            name="organizer"
            value={formData.organizer}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>
        );
      case "club":
        return (
          <select
            name="organizer"
            value={formData.organizer}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
            required
          >
            <option value="">Select Club</option>
            {clubs.map((club) => (
              <option key={club._id} value={club.name}>
                {club.name}
              </option>
            ))}
          </select>
        );
      case "other":
        return (
          <input
            type="text"
            name="organizer"
            value={formData.organizer}
            onChange={handleInputChange}
            placeholder="Enter organizer name"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
            required
          />
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FontAwesomeIcon icon={faXmark} className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold text-purple-800 mb-6">Edit Event</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Event Name
            </label>
            <input
              type="text"
              name="eventName"
              value={formData.eventName}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
              required
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
              required
              maxLength={500}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Duration (hours)
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                min="0.5"
                step="0.5"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Date & Time
              </label>
              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Event Type
              </label>
              <select
                name="eventType"
                value={formData.eventType}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="">Select Type</option>
                <option value="department">Department</option>
                <option value="club">Club</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Organizer
              </label>
              {renderOrganizerInput()}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Event Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-xs text-gray-500">
              Maximum file size: 5MB. Supported formats: JPEG, PNG
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Updating...
                </span>
              ) : (
                "Update Event"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventModal;
