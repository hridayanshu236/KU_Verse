import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import TagInput from "./TagInput";

const TagSection = ({
  title,
  items = [],
  onAdd,
  onRemove,
  icon: Icon,
  emptyText,
  error,
  isCurrentUser,
}) => {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        {isCurrentUser && !isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add {title.toLowerCase()}</span>
          </button>
        )}
      </div>

      <div className="space-y-3">
        {isAdding && (
          <div className="flex gap-2">
            <TagInput
              placeholder={`Add new ${title.toLowerCase()}`}
              onAdd={(value) => {
                onAdd(value);
                setIsAdding(false);
              }}
              error={error}
            />
            <button
              onClick={() => setIsAdding(false)}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {items.length === 0 && isCurrentUser ? (
          <p className="text-sm text-gray-500 italic">{emptyText}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {items.map((item, index) => (
              <div
                key={index}
                className="group flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm transition-all duration-200 hover:bg-blue-100"
              >
                <span>{item}</span>
                {isCurrentUser && (
                  <button
                    onClick={() => onRemove(index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <X className="w-3.5 h-3.5 text-blue-600 hover:text-blue-800" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TagSection;
