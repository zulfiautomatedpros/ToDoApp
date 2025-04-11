"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthProvider, useAuth } from "@/context/AuthContext"; // Make sure AuthProvider is imported!
import { TodoProvider } from "@/context/TodoContext";
import { CategoryProvider } from "@/context/CategoryContext";

function Header() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    // Read the saved theme from localStorage or default to light.
    const savedTheme = (localStorage.getItem("theme") as "light" | "dark") || "light";
    setTheme(savedTheme);
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
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
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
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
          {pathname !== "/login" && pathname !== "/signup" && <Header />}
          {children}
        </TodoProvider>
      </CategoryProvider>
    </AuthProvider>
  );
}
