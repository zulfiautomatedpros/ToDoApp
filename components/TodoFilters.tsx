// components/TodoFilters.tsx
"use client";

import { useCategory } from "@/context/CategoryContext";

export interface Filters {
  status: ("pending" | "completed")[];
  date?: "today" | "overdue";
  categories: string[];
}

interface TodoFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export default function TodoFilters({ filters, onFilterChange }: TodoFiltersProps) {
  const { categories } = useCategory();

  const toggleStatus = (status: "pending" | "completed") => {
    const updatedStatus = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status];
    onFilterChange({ ...filters, status: updatedStatus });
  };

  const setDateFilter = (date?: "today" | "overdue") => {
    onFilterChange({ ...filters, date });
  };

  const toggleCategory = (cat: string) => {
    const updatedCategories = filters.categories.includes(cat)
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];
    onFilterChange({ ...filters, categories: updatedCategories });
  };

  const resetFilters = () => {
    onFilterChange({ status: [], date: undefined, categories: [] });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Status Filter */}
      <div className="flex flex-col gap-1">
        <span className="font-semibold text-gray-700 dark:text-gray-300">Status:</span>
        <div className="flex gap-2">
          <button
            onClick={() => toggleStatus("pending")}
            className={`px-3 py-1 border rounded transition-colors ${
              filters.status.includes("pending")
                ? "bg-blue-500 text-white border-blue-500"
                : "hover:bg-blue-50 dark:hover:bg-gray-700"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => toggleStatus("completed")}
            className={`px-3 py-1 border rounded transition-colors ${
              filters.status.includes("completed")
                ? "bg-blue-500 text-white border-blue-500"
                : "hover:bg-blue-50 dark:hover:bg-gray-700"
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Date Filter */}
      <div className="flex flex-col gap-1">
        <span className="font-semibold text-gray-700 dark:text-gray-300">Date Filter:</span>
        <div className="flex flex-col gap-1">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="dateFilter"
              value="none"
              checked={!filters.date}
              onChange={() => setDateFilter(undefined)}
            />
            None
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="dateFilter"
              value="today"
              checked={filters.date === "today"}
              onChange={() => setDateFilter("today")}
            />
            Today
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="dateFilter"
              value="overdue"
              checked={filters.date === "overdue"}
              onChange={() => setDateFilter("overdue")}
            />
            Overdue
          </label>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-col gap-1">
        <span className="font-semibold text-gray-700 dark:text-gray-300">Categories:</span>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`px-3 py-1 rounded border transition-colors ${
                filters.categories.includes(cat)
                  ? "bg-green-500 text-white border-green-500"
                  : "hover:bg-green-50 dark:hover:bg-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={resetFilters}
        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded self-start transition-colors font-medium"
      >
        Reset Filters
      </button>
    </div>
  );
}
