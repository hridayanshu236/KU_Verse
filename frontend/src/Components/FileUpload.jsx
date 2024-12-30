import React, { useState } from "react";
import { Upload } from "lucide-react";

const FileUpload = ({ onChange }) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleDrag = (e) => {
    e.preventDefault();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    if (e.dataTransfer.files?.[0]) {
      setFileName(e.dataTransfer.files[0].name);
      onChange({
        target: {
          files: [e.dataTransfer.files[0]],
        },
      });
    }
  };

  const handleChange = (e) => {
    if (e.target.files?.[0]) {
      setFileName(e.target.files[0].name);
      onChange(e);
    }
  };

  return (
    <div className="w-full">
      <div
        className={`relative rounded-lg border-2 border-dashed p-6 
          ${dragActive ? "border-purple-500 bg-purple-50" : "border-gray-300"}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              {fileName ? fileName : "Drop your image here, or click to select"}
            </p>
          </div>
          <p className="mt-2 text-xs text-gray-500">PNG, JPG up to 10MB</p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
