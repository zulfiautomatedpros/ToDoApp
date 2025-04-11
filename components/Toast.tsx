// components/Toast.tsx
"use client";
import { useEffect, useState } from "react";
import { useTodos } from "@/context/TodoContext";

// If your Task type doesn't include dueDate yet, you can define it here.
// Otherwise, update the definition in your context (and remove this local type).
export type Task = {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string; // Marked as optional. Use Date if that fits your data.
};

export default function Toast() {
  const { tasks } = useTodos();
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Get today's date string for comparison.
    const todayStr = new Date().toLocaleDateString();
    
    // Filter tasks: only include tasks that have a dueDate defined,
    // are due today (matching locale date), and are not yet completed.
    const pendingToday = tasks.filter(
      (task: Task) =>
        task.dueDate &&
        new Date(task.dueDate).toLocaleDateString() === todayStr &&
        !task.completed
    );

    if (pendingToday.length > 0) {
      const msg = pendingToday
        .map(
          (task: Task) =>
            `<strong>${task.title}</strong> (Due: ${new Date(
              // Use non-null assertion because we already check that dueDate exists
              task.dueDate!
            ).toLocaleDateString()})`
        )
        .join("<br />");
      setMessage(msg);
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [tasks]);

  if (!visible) return null;

  return (
    <div
      className="fixed top-4 right-4 bg-red-600 text-white p-4 rounded shadow-lg z-50"
      // Using dangerouslySetInnerHTML for simple HTML formatting (for controlled content)
      dangerouslySetInnerHTML={{ __html: message }}
    ></div>
  );
}
