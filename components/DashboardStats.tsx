// components/DashboardStats.tsx
"use client";

import { useTodos } from "@/context/TodoContext";
import { useMemo } from "react";

export default function DashboardStats() {
  const { tasks } = useTodos();

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const stats = useMemo(() => {
    const calc = (startDate: Date) => {
      const periodTasks = tasks.filter((task) => new Date(task.createdAt) >= startDate);
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

  return (
    <div>
      <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-gray-200">
        Completion Stats
      </h3>
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
    </div>
  );
}
