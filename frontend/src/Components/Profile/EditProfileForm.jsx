import React, { useState } from "react";
import { Edit, KeyRound } from "lucide-react";
import DepartmentSelect from "./DepartmentSelect";
import UpdatePasswordForm from "./UpdatePasswordForm";
import { updateUserProfile } from "../../utils/userServices";

const EditProfileForm = ({ user, onSave, onCancel }) => {
  const [activeTab, setActiveTab] = useState("profile"); // "profile" or "password"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    fullName: user.fullName || "",
    department: user.department || "",
    bio: user.bio || "",
    address: user.address || "",
    phoneNumber: user.phoneNumber || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleDepartmentChange = (department) => {
    setFormData((prev) => ({ ...prev, department }));
  };

   const handleSubmit = async (e) => {
     e.preventDefault();
     try {
       await updateUserProfile(formData);
       onSave();
     } catch (error) {
       console.error("Failed to update profile:", error);
     }
   };


  return (
    <div className="w-full md:w-3/5 lg:w-1/2 bg-white rounded-lg shadow-lg p-6 mt-6">
      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-2 px-1 ${
            activeTab === "profile"
              ? "border-b-2 border-purple-600 text-purple-600 font-medium"
              : "text-gray-500"
          }`}
        >
          <Edit className="w-4 h-4 inline mr-2" />
          Edit Profile
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`pb-2 px-1 ${
            activeTab === "password"
              ? "border-b-2 border-purple-600 text-purple-600 font-medium"
              : "text-gray-500"
          }`}
        >
          <KeyRound className="w-4 h-4 inline mr-2" />
          Change Password
        </button>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {success}
        </div>
      )}

      {/* Profile Edit Form */}
      {activeTab === "profile" ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Department</label>
            <DepartmentSelect
              value={formData.department}
              onChange={handleDepartmentChange}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Write something about yourself"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your address"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your phone number"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      ) : (
        <UpdatePasswordForm onClose={() => setActiveTab("profile")} />
      )}
    </div>
  );
};

export default EditProfileForm;
