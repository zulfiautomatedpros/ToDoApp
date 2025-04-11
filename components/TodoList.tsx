"use client";

import { useTodos, Task } from "@/context/TodoContext";
import { useRef, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

interface TodoListProps {
  filters: {
    status: ("pending" | "completed")[];
    date?: "today" | "overdue" | "thisWeek" | "thisMonth";
    categories: string[];
    priority: ("high" | "medium" | "low")[];
  };
}

// Timer state interface for each task.
interface TimerState {
  running: boolean;
  startTime: number | null; // Timestamp when started (ms).
  elapsed: number; // Accumulated elapsed time (ms).
}

export default function TodoList({ filters }: TodoListProps) {
  const { tasks, deleteTask, reorderTasks, updateTask } = useTodos();
  const router = useRouter();

  // Global tick state to force re-render every second.
  const [tick, setTick] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setTick(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Manage a timer state per task (keyed by task.id).
  const [timers, setTimers] = useState<{ [taskId: string]: TimerState }>({});

  // Helper: Format milliseconds into hh:mm:ss.
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Timer control functions.
  const handleStartTimer = (taskId: string) => {
    setTimers((prev) => ({
      ...prev,
      [taskId]: {
        running: true,
        startTime: Date.now(),
        elapsed: prev[taskId] ? prev[taskId].elapsed : 0,
      },
    }));
  };

  const handlePauseTimer = (taskId: string) => {
    setTimers((prev) => {
      const timer = prev[taskId];
      if (timer && timer.running && timer.startTime) {
        const newElapsed = timer.elapsed + (Date.now() - timer.startTime);
        return {
          ...prev,
          [taskId]: {
            running: false,
            startTime: null,
            elapsed: newElapsed,
          },
        };
      }
      return prev;
    });
  };

  // Filtering tasks as before.
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Status filtering.
      if (filters.status.length > 0) {
        const statusMatch =
          (filters.status.includes("pending") && !task.completed) ||
          (filters.status.includes("completed") && task.completed);
        if (!statusMatch) return false;
      }
      
      // Date filtering.
      if (filters.date) {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (filters.date === "today" && taskDate.toLocaleDateString() !== today.toLocaleDateString()) return false;
        if (filters.date === "overdue" && (task.completed || taskDate >= today)) return false;
        if (filters.date === "thisWeek") {
          const day = today.getDay();
          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - day);
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          if (taskDate < startOfWeek || taskDate > endOfWeek) return false;
        }
        if (filters.date === "thisMonth") {
          const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          if (taskDate < startOfMonth || taskDate > endOfMonth) return false;
        }
      }
      
      // Category filtering.
      if (filters.categories.length > 0 && !filters.categories.includes(task.category)) return false;
      
      // Priority filtering.
      if (filters.priority.length > 0 && !filters.priority.includes(task.priority)) return false;
      
      return true;
    });
  }, [tasks, filters]);

  // Drag and drop handling.
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null) {
      reorderTasks(dragItem.current, dragOverItem.current);
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" && tasks.length > 0) {
        if (window.confirm("Are you sure you want to delete the first task?")) {
          deleteTask(tasks[0].id);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [tasks, deleteTask]);

  // When completing a task, pause timer if running.
  const handleToggleComplete = (task: Task) => {
    if (timers[task.id]?.running) {
      handlePauseTimer(task.id);
    }
    updateTask({
      ...task,
      completed: !task.completed,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-2">
      {filteredTasks.map((task, index) => {
        // Compute elapsed time.
        const timer = timers[task.id];
        let elapsed = 0;
        if (timer) {
          elapsed = timer.running && timer.startTime ? timer.elapsed + (Date.now() - timer.startTime) : timer.elapsed;
        }

        return (
          <div
            key={`${task.id}-${index}`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragEnter={() => handleDragEnter(index)}
            onDragEnd={handleDragEnd}
            className="p-4 bg-white dark:bg-gray-700 rounded shadow flex justify-between items-center gap-4 cursor-move"
          >
            <div className="flex-1">
              <h3 className={`font-bold ${task.completed ? "line-through" : ""}`}>
                {task.title}
              </h3>
              <p className="text-sm">{task.description}</p>
              {task.dueDate && (
                <small className="text-gray-500">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </small>
              )}
              {/* If task is complete and any time has been recorded, display the total time */}
              {task.completed && timer && timer.elapsed > 0 && (
                <div className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                  Time taken: {formatTime(timer.elapsed)}
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              {/* If task is NOT complete, show the timer control button */}
              {!task.completed && (
                <button
                  onClick={() =>
                    timer && timer.running
                      ? handlePauseTimer(task.id)
                      : handleStartTimer(task.id)
                  }
                  className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded"
                >
                  {timer && timer.running
                    ? `Pause ${formatTime(elapsed)}`
                    : "Start Task"}
                </button>
              )}
              <button
                onClick={() => handleToggleComplete(task)}
                className="px-2 py-1 bg-blue-500 text-white rounded"
              >
                {task.completed ? "Undo" : "Complete"}
              </button>
              <button
                onClick={() => router.push(`/edit-task/${task.id}`)}
                className="px-2 py-1 bg-yellow-500 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this task?")) {
                    deleteTask(task.id);
                  }
                }}
                className="px-2 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
      {filteredTasks.length === 0 && (
        <p className="text-gray-500 italic">
          No tasks found with the current filters.
        </p>
      )}
    </div>
  );
}
