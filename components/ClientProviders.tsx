"use client";
import { useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthProvider, useAuth } from "@/context/AuthContext"; // Make sure AuthProvider is imported!
import { TodoProvider } from "@/context/TodoContext";
import { CategoryProvider } from "@/context/CategoryContext";
import Header from "./Header";


export default function ClientProviders({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Keyboard shortcut: Ctrl+T to toggle theme.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if Ctrl key is pressed and key is "t" (case insensitive).
      if (e.ctrlKey && e.key.toLowerCase() === "q") {
        e.preventDefault(); // Prevent default behavior (i.e. opening a new tab).
        // Get the current theme from localStorage or default to light.
        const currentTheme = (localStorage.getItem("theme") as "light" | "dark") || "light";
        const newTheme = currentTheme === "light" ? "dark" : "light";
        localStorage.setItem("theme", newTheme);
        // Toggle the "dark" class on the document element accordingly.
        if (newTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

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
