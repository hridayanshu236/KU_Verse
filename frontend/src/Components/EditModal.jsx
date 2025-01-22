import React, { useState, useEffect } from "react";

const EditModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [caption, setCaption] = useState(initialData.caption);

  useEffect(() => {
    if (isOpen) {
      setCaption(initialData.caption);
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("caption", caption);
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-purple-700">
          Edit Post
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Caption</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full p-2 mt-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 transition-colors text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 transition-colors text-white"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
