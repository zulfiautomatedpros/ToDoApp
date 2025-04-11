// components/ClientProviders.tsx
"use client";

import { useEffect, useState } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { TodoProvider } from "@/context/TodoContext";
import { CategoryProvider } from "@/context/CategoryContext";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = (localStorage.getItem("theme") as "light" | "dark") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <>
      <header className="p-4 bg-white dark:bg-gray-800 shadow flex justify-between items-center">
        <h1 className="text-xl font-bold">Todo App</h1>
        <button
          onClick={toggleTheme}
          className="px-2 py-1 bg-blue-500 text-white rounded"
        >
          {theme === "light" ? "Light Mode" : "Dark Mode"}
        </button>
      </header>
      <AuthProvider>
        <CategoryProvider>
          <TodoProvider>{children}</TodoProvider>
        </CategoryProvider>
      </AuthProvider>
    </>
  );
}
