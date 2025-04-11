// components/ClientProviders.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { TodoProvider } from "@/context/TodoContext";
import { CategoryProvider } from "@/context/CategoryContext";

function Header() {
  // All hooks are always called.
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const router = useRouter();
  const { user, logout } = useAuth();

  // Set smooth theme transition on mount.
  useEffect(() => {
    document.documentElement.style.transition = "background-color 0.5s ease, color 0.5s ease";
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

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      router.push("/login");
    }
  };

  return (
    <header className="p-4 bg-gray-200 dark:bg-gray-800 shadow flex justify-between items-center border-b border-gray-300 dark:border-gray-700">
      <h1 className="text-xl font-bold">Todo App</h1>
      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="px-3 py-1 bg-blue-500 text-white rounded transition-colors hover:bg-blue-600"
        >
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </button>
        {user && (
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-500 text-white rounded transition-colors hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AuthProvider>
      <CategoryProvider>
        <TodoProvider>
          {/* Only render Header if not on login or signup pages */}
          {pathname !== "/login" && pathname !== "/signup" && <Header />}
          {children}
        </TodoProvider>
      </CategoryProvider>
    </AuthProvider>
  );
}
