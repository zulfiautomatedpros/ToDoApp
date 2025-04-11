// app/page.tsx
"use client";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import TodoApp from "@/components/TodoApp";
import Toast from "@/components/Toast";

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated.
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      {/* Render the dashboard – includes filters, stats, task list and add-task button */}
      <TodoApp />
      {/* Toast notifications container */}
      <Toast />
    </div>
  );
}
