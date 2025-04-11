"use client";

import { useTodos } from "@/context/TodoContext";
import { useMemo, useState } from "react";

export default function DashboardStats() {
  const { tasks } = useTodos();
  const [viewMode, setViewMode] = useState<"text" | "graph">("text");

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const stats = useMemo(() => {
    const calc = (startDate: Date) => {
      const periodTasks = tasks.filter(
        (task) => new Date(task.createdAt) >= startDate
      );
      const completed = periodTasks.filter((task) => task.completed).length;
      return periodTasks.length > 0
        ? Math.round((completed / periodTasks.length) * 100)
        : 0;
    };
    return {
      daily: calc(startOfDay),
      weekly: calc(startOfWeek),
      monthly: calc(startOfMonth),
    };
  }, [tasks]);

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "text" ? "graph" : "text"));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Completion Stats
        </h3>
        <button
          onClick={toggleViewMode}
          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
        >
          {viewMode === "text" ? "Graph View" : "Text View"}
        </button>
      </div>

      {viewMode === "text" ? (
        <div className="flex justify-around items-center text-center text-gray-700 dark:text-gray-100">
          <div className="flex flex-col">
            <span className="text-sm">Today</span>
            <span className="text-xl font-semibold">{stats.daily}%</span>
          </div>
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-500 mx-2"></div>
          <div className="flex flex-col">
            <span className="text-sm">This Week</span>
            <span className="text-xl font-semibold">{stats.weekly}%</span>
          </div>
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-500 mx-2"></div>
          <div className="flex flex-col">
            <span className="text-sm">This Month</span>
            <span className="text-xl font-semibold">{stats.monthly}%</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Graph view: a simple horizontal bar graph for each stat */}
          {[
            { label: "Today", value: stats.daily },
            { label: "This Week", value: stats.weekly },
            { label: "This Month", value: stats.monthly },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-800 dark:text-gray-200">
                  {item.label}
                </span>
                <span className="text-sm text-gray-800 dark:text-gray-200">
                  {item.value}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded h-4">
                <div
                  className="bg-blue-500 h-4 rounded"
                  style={{ width: `${item.value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
