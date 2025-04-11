// components/TodoApp.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import TodoFilters, { Filters } from "./TodoFilters";
import TodoList from "./TodoList";
import DashboardStats from "./DashboardStats";
import { useTodos } from "@/context/TodoContext";

export default function TodoApp() {
  const router = useRouter();
  const { tasks, setTasks } = useTodos(); // We'll add setTasks to our context for import/export
  const [filters, setFilters] = useState<Filters>({
    status: [],
    date: undefined,
    categories: [],
  });

  // Export todos as JSON
  const exportTodos = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "todos.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import todos from JSON
  const importTodos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const importedTodos = JSON.parse(evt.target?.result as string);
          // Overwrite the current todos
          setTasks(importedTodos);
        } catch (error) {
          console.error("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex flex-col md:flex-row mt-4 flex-1">
      {/* Sidebar: Filters */}
      <aside className="w-full md:w-1/4 bg-white dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700 p-4">
        <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">
          Filters
        </h2>
        <TodoFilters filters={filters} onFilterChange={setFilters} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 space-y-4">
        {/* Row containing Completion Stats, Add Task, Export & Import */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1 bg-gray-50 dark:bg-gray-700 p-4 rounded shadow">
            <DashboardStats />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/add-task")}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded shadow font-medium"
            >
              + Add Task
            </button>
            <button
              onClick={exportTodos}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow font-medium"
            >
              Export Todos
            </button>
            <label className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow font-medium cursor-pointer inline-block">
              Import Todos
              <input
                type="file"
                accept=".json"
                onChange={importTodos}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Task List */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow border border-gray-200 dark:border-gray-700">
          <TodoList filters={filters} />
        </div>
      </main>
    </div>
  );
}
