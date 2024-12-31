import React, { useState, useRef } from "react";
import { Camera, Video, School, X, Loader2 } from "lucide-react";
import axios from "axios";


import { useUser } from "../contexts/userContext";

const PostInput = ({ onPostCreated }) => {
  const { user } = useUser();
  const [caption, setCaption] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      setError("Only JPEG, PNG, GIF images, and MP4 videos are supported.");
      return;
    }

    if (file.size > maxSize) {
      setError("File size should be less than 5MB.");
      return;
    }

    setSelectedFile(file);
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile && !caption.trim()) {
      setError("Please add a caption or select a file to post.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append("file", selectedFile);
      }
      if (caption) {
        formData.append("caption", caption);
      }

      const { data } = await axios.post(
        "http://localhost:5000/api/post/createpost",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      // Reset form after successful post
      setCaption("");
      setSelectedFile(null);
      setPreview(null);

      // Notify parent component about new post
      if (onPostCreated) {
        onPostCreated(data.post);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Add a default avatar URL or placeholder
  const defaultAvatar = "/api/placeholder/40/40"; // Using the placeholder API for default avatar

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-4 m-2">
      <div className="flex items-center gap-3 mb-4">
        <img
          src={user?.profilePicture || defaultAvatar}
          alt="Profile"
          className="w-10 h-10 rounded-full bg-emerald-100 flex-shrink-0"
        />
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full bg-emerald-50 rounded-full px-6 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300 text-gray-700"
        />
      </div>

      {/* Preview Section */}
      {preview && (
        <div className="relative mb-4">
          {selectedFile.type.startsWith("image/") ? (
            <img
              src={preview}
              alt="Preview"
              className="max-h-60 w-auto mx-auto rounded-lg"
            />
          ) : (
            <video
              src={preview}
              controls
              className="max-h-60 w-auto mx-auto rounded-lg"
            />
          )}
          <button
            onClick={clearFile}
            className="absolute top-2 right-2 p-1 bg-gray-800 bg-opacity-50 rounded-full hover:bg-opacity-75"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
      )}

      <div className="flex flex-row justify-between pt-2 border-t border-emerald-100">
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-emerald-50 transition-colors"
          onClick={() => {}}
        >
          <Video className="w-5 h-5 text-emerald-600" />
          <span className="text-sm text-gray-600">Go Live</span>
        </button>

        <div className="relative">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*,video/mp4"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-emerald-50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="w-5 h-5 text-emerald-600" />
            <span className="text-sm text-gray-600">Photo/Video</span>
          </button>
        </div>

        <button
          className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-emerald-50 transition-colors"
          onClick={() => {}}
        >
          <School className="w-5 h-5 text-emerald-600" />
          <span className="text-sm text-gray-600">Achievements</span>
        </button>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isLoading || (!selectedFile && !caption.trim())}
          className={`px-6 py-2 rounded-full text-white font-medium flex items-center gap-2
            ${
              isLoading || (!selectedFile && !caption.trim())
                ? "bg-emerald-300 cursor-not-allowed"
                : "bg-emerald-500 hover:bg-emerald-600"
            }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Posting...
            </>
          ) : (
            "Post"
          )}
        </button>
      </div>
    </div>
  );
};

export default PostInput;
