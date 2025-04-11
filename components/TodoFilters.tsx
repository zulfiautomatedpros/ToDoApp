"use client";
import { useCategory } from "@/context/CategoryContext";
import DropdownMultiSelect from "./DropdownMultiSelect";

export interface Filters {
  status: ("pending" | "completed")[];
  date?: "today" | "overdue" | "thisWeek" | "thisMonth";
  categories: string[];
  priority: ("high" | "medium" | "low")[];
}

interface TodoFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

const statusOptions: ("pending" | "completed")[] = ["pending", "completed"];
const priorityOptions: ("high" | "medium" | "low")[] = ["high", "medium", "low"];
const dateOptions = [
  { label: "None", value: "none" },
  { label: "Today", value: "today" },
  { label: "Overdue", value: "overdue" },
  { label: "This Week", value: "thisWeek" },
  { label: "This Month", value: "thisMonth" },
];

export default function TodoFilters({ filters, onFilterChange }: TodoFiltersProps) {
  const { categories } = useCategory();

  const handleStatusChange = (selected: string[]) => {
    onFilterChange({ ...filters, status: selected as ("pending" | "completed")[] });
  };

  const handlePriorityChange = (selected: string[]) => {
    onFilterChange({ ...filters, priority: selected as ("high" | "medium" | "low")[] });
  };

  const handleCategoryChange = (selected: string[]) => {
    onFilterChange({ ...filters, categories: selected });
  };

  const handleDateChange = (value: string) => {
    onFilterChange({
      ...filters,
      date: value === "none" ? undefined : (value as Filters["date"]),
    });
  };

  const isFilterApplied =
    filters.status.length > 0 ||
    filters.date !== undefined ||
    filters.categories.length > 0 ||
    filters.priority.length > 0;

  const resetFilters = () => {
    onFilterChange({
      status: [],
      date: undefined,
      categories: [],
      priority: [],
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Status Filter */}
      <DropdownMultiSelect
        label="Status"
        options={statusOptions}
        selected={filters.status}
        onChange={handleStatusChange}
      />

      {/* Date Filter as a native dropdown */}
      <div>
        <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
          Date Filter
        </label>
        <select
          value={filters.date || "none"}
          onChange={(e) => handleDateChange(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
        >
          {dateOptions.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category Filter */}
      <DropdownMultiSelect
        label="Categories"
        options={categories}
        selected={filters.categories}
        onChange={handleCategoryChange}
      />

      {/* Priority Filter */}
      <DropdownMultiSelect
        label="Priority"
        options={priorityOptions}
        selected={filters.priority}
        onChange={handlePriorityChange}
      />

      {/* Reset Filters Button */}
      <button
        onClick={resetFilters}
        disabled={!isFilterApplied}
        className={`mt-4 w-full p-2 rounded transition-colors ${
          isFilterApplied
            ? "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
            : "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 cursor-not-allowed"
        }`}
      >
        Reset Filters
      </button>
    </div>
  );
}
