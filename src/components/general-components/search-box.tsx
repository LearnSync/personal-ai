import React, { useState, KeyboardEvent } from "react";
import { cn } from "@/lib/utils"; // If you're using a utility function for className management like `cn`
import { Search } from "lucide-react";

interface SearchBoxProps {
  className?: string;
  showIcon?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  onEnter?: (value: string) => void;
  suggestions?: string[];
  showSuggestions?: boolean;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  className,
  showIcon = true,
  value = "",
  onChange,
  onEnter,
  suggestions = [],
  showSuggestions = false,
}) => {
  /**
   * State
   */
  const [searchValue, setSearchValue] = useState(value);

  /**
   * Ref
   */
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

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

  /**
   * Side Effect
   */
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [searchValue]);

  return (
    <div className={cn("relative")}>
      <div
        className={cn(
          "flex items-center w-full rounded-md shadow-inner shadow-background-2 min-h-10 bg-background-2",
          className
        )}
      >
        {showIcon && (
          <span className="p-1 px-2">
            <Search className="w-6 h-6" />
          </span>
        )}

        {/* Search Input */}
        <textarea
          ref={textareaRef}
          value={searchValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={1}
          className={cn(
            "focus:outline-none flex-1 w-full h-fit bg-transparent text-sm resize-none"
          )}
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
