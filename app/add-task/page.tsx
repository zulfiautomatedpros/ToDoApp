"use client";
import TodoForm from "@/components/TodoForm";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AddTaskPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  return (
    <div className="max-w-lg mx-auto">
      {/* Back button positioned at top right */}
      <div className="flex justify-start mb-4">
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-green-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Back
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-4 dark:text-gray-100">Add Task</h2>
      <TodoForm />
    </div>
  );
}
