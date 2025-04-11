"use client";
import { useState, useRef, useEffect } from "react";

interface DropdownMultiSelectProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export default function DropdownMultiSelect({
  label,
  options,
  selected,
  onChange,
}: DropdownMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionToggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <div
        onClick={toggleDropdown}
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 cursor-pointer"
      >
        {selected.length > 0 ? selected.join(", ") : `Select ${label}`}
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 shadow">
          {options.map((option) => (
            <div
              key={option}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  onChange={() => handleOptionToggle(option)}
                  className="mr-2"
                />
                <span className="text-gray-900 dark:text-gray-200">
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </span>
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
