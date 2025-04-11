// context/TodoContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  category: string;
  priority: "high" | "medium" | "low";
  notes?: string;
}

interface TodoContextType {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  reorderTasks: (startIndex: number, endIndex: number) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`tasks_${user.id}`);
      if (stored) {
        setTasks(JSON.parse(stored));
      } else {
        setTasks([]);
      }
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`tasks_${user.id}`, JSON.stringify(tasks));
    }
  }, [tasks, user]);

  const addTask = (task: Task) => {
    setTasks((prev) => [...prev, task]);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  // Remove only the first occurrence of a task with the given id.
  const deleteTask = (taskId: string) => {
    const index = tasks.findIndex((task) => task.id === taskId);
    if (index !== -1) {
      setTasks((prev) => {
        const updated = [...prev];
        updated.splice(index, 1);
        return updated;
      });
    }
  };

  const reorderTasks = (startIndex: number, endIndex: number) => {
    const updatedTasks = Array.from(tasks);
    const [removed] = updatedTasks.splice(startIndex, 1);
    updatedTasks.splice(endIndex, 0, removed);
    setTasks(updatedTasks);
  };

  return (
    <TodoContext.Provider value={{ tasks, setTasks, addTask, updateTask, deleteTask, reorderTasks }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = (): TodoContextType => {
  const context = useContext(TodoContext);
  if (!context)
    throw new Error("useTodos must be used within a TodoProvider");
  return context;
};
