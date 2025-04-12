"use client";

import { useTodos } from "@/context/TodoContext";
import { useMemo, useState } from "react";

export default function DashboardStats() {
  const { tasks } = useTodos();
  const [viewMode, setViewMode] = useState<"text" | "graph">("text");

  const now = new Date();

  
  const startOfDayTimestamp = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  
  const currentDay = now.getDay() === 0 ? 7 : now.getDay(); 
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - currentDay + 1);
  const startOfWeekTimestamp = startOfWeek.getTime();

  
  const startOfMonthTimestamp = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  
  const startOfYearTimestamp = new Date(now.getFullYear(), 0, 1).getTime();

  
  const stats = useMemo(() => {
    const calc = (startTimestamp: number) => {
      
      const periodTasks = tasks.filter((task) => {
        const updated = Date.parse(task.updatedAt);
        return !isNaN(updated) && updated >= startTimestamp;
      });
      const completed = periodTasks.filter((task) => task.completed).length;
      return periodTasks.length > 0
        ? Math.round((completed / periodTasks.length) * 100)
        : 0;
    };
    return {
      daily: calc(startOfDayTimestamp),
      weekly: calc(startOfWeekTimestamp),
      monthly: calc(startOfMonthTimestamp),
      yearly: calc(startOfYearTimestamp),
    };
  }, [tasks, startOfDayTimestamp, startOfWeekTimestamp, startOfMonthTimestamp, startOfYearTimestamp]);

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
        <div className="flex flex-wrap justify-around items-center text-center text-gray-700 dark:text-gray-100">
          <div className="flex flex-col m-2">
            <span className="text-sm">Today</span>
            <span className="text-xl font-semibold">{stats.daily}%</span>
          </div>
          <div className="flex flex-col m-2">
            <span className="text-sm">This Week</span>
            <span className="text-xl font-semibold">{stats.weekly}%</span>
          </div>
          <div className="flex flex-col m-2">
            <span className="text-sm">This Month</span>
            <span className="text-xl font-semibold">{stats.monthly}%</span>
          </div>
          <div className="flex flex-col m-2">
            <span className="text-sm">This Year</span>
            <span className="text-xl font-semibold">{stats.yearly}%</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {[
            { label: "Today", value: stats.daily },
            { label: "This Week", value: stats.weekly },
            { label: "This Month", value: stats.monthly },
            { label: "This Year", value: stats.yearly },
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
