import React, { useState, KeyboardEvent } from "react";
import { cn } from "@/lib/utils"; // If you're using a utility function for className management like `cn`

interface SearchBoxProps {
  className?: string;
  showIcon?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  onEnter?: (value: string) => void;
  suggestions?: string[];
  showSuggestions?: boolean;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  className,
  showIcon = true,
  value = "",
  onChange,
  onEnter,
  suggestions = [],
  showSuggestions = false,
}) => {
  const [searchValue, setSearchValue] = useState(value);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSearchValue(e.target.value);
    if (onChange) {
      onChange(e.target.value);
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (onEnter) {
        onEnter(searchValue);
      }
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setSearchValue(suggestion);
    if (onChange) {
      onChange(suggestion);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div className="flex items-center">
        {showIcon && (
          <span className="mr-2">
            {/* Replace with your desired icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0a7.5 7.5 0 1110-10m0 0A7.5 7.5 0 1110 10z"
              />
            </svg>
          </span>
        )}

        {/* Search Input */}
        <textarea
          value={searchValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={1}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Search..."
        />
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-2 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg max-h-40">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBox;
