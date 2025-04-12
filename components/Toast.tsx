// components/Toast.tsx
"use client";
import { useEffect, useState, useCallback } from "react";
import { useTodos } from "@/context/TodoContext";

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
};

const TOAST_DURATION = 3000;


function ToastItem({ task, onClose }: { task: Task; onClose: (id: string) => void }) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const percentLeft = 100 - (elapsed / TOAST_DURATION) * 100;
      setProgress(percentLeft > 0 ? percentLeft : 0);
      if (elapsed >= TOAST_DURATION) {
        clearInterval(interval);
        onClose(task.id);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [task.id, onClose]);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 border-l-4 border-red-500 shadow-lg rounded-md max-w-xs">
      <div className="mb-1">
        <h3 className="font-bold text-gray-900 dark:text-gray-100">{task.title}</h3>
        {task.dueDate && (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </p>
        )}
      </div>
      <div className="w-full bg-gray-300 dark:bg-gray-600 rounded h-1">
        <div
          className="h-1 bg-red-500 rounded transition-all duration-50"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}

export default function Toast() {
  const { tasks } = useTodos();
  const [toasts, setToasts] = useState<Task[]>([]);

  
  useEffect(() => {
    const todayStr = new Date().toLocaleDateString();
    
    const pendingToday = tasks.filter(
      (task: Task) =>
        task.dueDate &&
        new Date(task.dueDate).toLocaleDateString() === todayStr &&
        !task.completed
    );
    
    setToasts((prev) => {
      const newToasts = pendingToday.filter(task => !prev.some(t => t.id === task.id));
      return [...prev, ...newToasts];
    });
  }, [tasks]);

  
  const handleClose = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((task) => (
        <ToastItem key={task.id} task={task} onClose={handleClose} />
      ))}
    </div>
  );
}
