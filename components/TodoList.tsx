"use client";
import { useTodos, Task } from "@/context/TodoContext";
import { useRef, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

// Timer state interface for each task.
interface TimerState {
  running: boolean;
  startTime: number | null; // Timestamp when started (ms).
  elapsed: number; // Accumulated elapsed time (ms).
}

// Define Subtask interface.
export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface TodoListProps {
  filters: {
    status: ("pending" | "completed")[];
    date?: "today" | "overdue" | "thisWeek" | "thisMonth";
    categories: string[];
    priority: ("high" | "medium" | "low")[];
  };
}

export default function TodoList({ filters }: TodoListProps) {
  const { tasks, deleteTask, reorderTasks, updateTask, setTasks } = useTodos();
  const router = useRouter();

  // Global tick state to force re-render every second.
  const [tick, setTick] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setTick(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Manage timer state per task.
  const [timers, setTimers] = useState<{ [taskId: string]: TimerState }>({});

  // Manage local subtask input state per task.
  const [subtaskInputs, setSubtaskInputs] = useState<{ [taskId: string]: string }>({});
  const [showSubtaskInput, setShowSubtaskInput] = useState<{ [taskId: string]: boolean }>({});

  // Batch selection state.
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  // Helper: Format milliseconds into hh:mm:ss.
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
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

  // Batch selection handler.
  const handleSelectTask = (taskId: string) => {
    setSelectedTaskIds((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  // Batch action: Mark selected tasks as complete by updating all at once.
  const handleBatchMarkComplete = () => {
    const newTasks = tasks.map((task) => {
      if (selectedTaskIds.includes(task.id) && !task.completed) {
        if (task.subtasks && task.subtasks.length > 0) {
          return {
            ...task,
            completed: true,
            subtasks: task.subtasks.map((sub) => ({ ...sub, completed: true })),
            updatedAt: new Date().toISOString(),
          };
        } else {
          return { ...task, completed: true, updatedAt: new Date().toISOString() };
        }
      }
      return task;
    });
    setTasks(newTasks);
    setSelectedTaskIds([]);
  };

  // Batch action: Delete selected tasks.
  const handleBatchDelete = () => {
    if (window.confirm("Are you sure you want to delete the selected tasks?")) {
      const remainingTasks = tasks.filter((task) => !selectedTaskIds.includes(task.id));
      setTasks(remainingTasks);
      setSelectedTaskIds([]);
    }
  };

  // Filtering tasks remains unchanged.
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filters.status.length > 0) {
        const statusMatch =
          (filters.status.includes("pending") && !task.completed) ||
          (filters.status.includes("completed") && task.completed);
        if (!statusMatch) return false;
      }
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
      if (filters.categories.length > 0 && !filters.categories.includes(task.category)) return false;
      if (filters.priority.length > 0 && !filters.priority.includes(task.priority)) return false;
      return true;
    });
  }, [tasks, filters]);

  // Drag and drop handling.
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const handleDragStart = (index: number) => { dragItem.current = index; };
  const handleDragEnter = (index: number) => { dragOverItem.current = index; };
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
    let updatedTask: Task = task;
    if (!task.completed) {
      if (task.subtasks && task.subtasks.length > 0) {
        updatedTask = {
          ...task,
          completed: true,
          subtasks: task.subtasks.map((sub) => ({ ...sub, completed: true })),
          updatedAt: new Date().toISOString(),
        };
      } else {
        updatedTask = {
          ...task,
          completed: true,
          updatedAt: new Date().toISOString(),
        };
      }
    } else {
      updatedTask = {
        ...task,
        completed: false,
        updatedAt: new Date().toISOString(),
      };
    }
    updateTask(updatedTask);
  };

  // Handle adding a new subtask.
  const handleAddSubtask = (task: Task) => {
    const inputValue = subtaskInputs[task.id]?.trim();
    if (!inputValue) return;
    const newSubtask: Subtask = {
      id: uuidv4(),
      title: inputValue,
      completed: false,
    };
    const updatedTask: Task = {
      ...task,
      subtasks: task.subtasks ? [...task.subtasks, newSubtask] : [newSubtask],
      updatedAt: new Date().toISOString(),
    };
    updateTask(updatedTask);
    setSubtaskInputs((prev) => ({ ...prev, [task.id]: "" }));
    setShowSubtaskInput((prev) => ({ ...prev, [task.id]: false }));
  };

  // Toggle the completed status of a subtask.
  const handleToggleSubtask = (task: Task, subtaskId: string) => {
    const updatedSubtasks = (task.subtasks || []).map((sub) =>
      sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
    );
    const mainCompleted = updatedSubtasks.length > 0 && updatedSubtasks.every((s) => s.completed);
    const updatedTask: Task = {
      ...task,
      subtasks: updatedSubtasks,
      completed: mainCompleted,
      updatedAt: new Date().toISOString(),
    };
    updateTask(updatedTask);
  };

  return (
    <div className="space-y-2 bg-gray-50 dark:bg-gray-800 p-4 rounded">
      {/* Batch Action Bar */}
      {selectedTaskIds.length > 0 && (
        <div className="flex items-center gap-4 p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
          <span className="text-sm text-gray-800 dark:text-gray-200">
            {selectedTaskIds.length} task(s) selected
          </span>
          <button
            onClick={handleBatchMarkComplete}
            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
          >
            Mark Complete
          </button>
          <button
            onClick={handleBatchDelete}
            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
          >
            Delete
          </button>
        </div>
      )}

      {filteredTasks.map((task, index) => {
        // Compute elapsed time.
        const timer = timers[task.id];
        let elapsed = 0;
        if (timer) {
          elapsed =
            timer.running && timer.startTime ? timer.elapsed + (Date.now() - timer.startTime) : timer.elapsed;
        }

        const isSelected = selectedTaskIds.includes(task.id);

        return (
          <div
            key={`${task.id}-${index}`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragEnter={() => handleDragEnter(index)}
            onDragEnd={handleDragEnd}
            className={`p-4 bg-white dark:bg-gray-700 rounded shadow flex flex-col gap-3 cursor-move border ${
              isSelected ? "border-4 border-blue-500" : "border border-gray-200 dark:border-gray-600"
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                {/* Checkbox for batch selection */}
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleSelectTask(task.id)}
                  className="mr-2"
                />
                <div className="flex-1">
                  <h3 className={`font-bold text-gray-900 dark:text-gray-100 ${task.completed ? "line-through" : ""}`}>
                    {task.title}
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{task.description}</p>
                  {task.dueDate && (
                    <small className="text-gray-500 dark:text-gray-400">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </small>
                  )}
                  {/* If task is complete, display time taken */}
                  {task.completed && timer && timer.elapsed > 0 && (
                    <div className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                      Time taken: {formatTime(timer.elapsed)}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!task.completed && (
                  <button
                    onClick={() =>
                      timer && timer.running
                        ? handlePauseTimer(task.id)
                        : handleStartTimer(task.id)
                    }
                    className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm"
                  >
                    {timer && timer.running ? `Pause ${formatTime(elapsed)}` : "Start Task"}
                  </button>
                )}
                <button
                  onClick={() => handleToggleComplete(task)}
                  className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
                >
                  {task.completed ? "Undo" : "Complete"}
                </button>
                <button
                  onClick={() => router.push(`/edit-task/${task.id}`)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this task?")) {
                      deleteTask(task.id);
                      setSelectedTaskIds((prev) => prev.filter((id) => id !== task.id));
                    }
                  }}
                  className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Subtasks Section */}
            <div className="mt-2 border-t pt-2">
              {task.subtasks && task.subtasks.length > 0 && (
                <div className="space-y-1">
                  {task.subtasks.map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between">
                      <span
                        className={`text-sm ${
                          sub.completed ? "line-through text-gray-600 dark:text-gray-300" : "text-gray-800 dark:text-gray-200"
                        }`}
                      >
                        {sub.title}
                      </span>
                      <button
                        onClick={() => handleToggleSubtask(task, sub.id)}
                        className="px-2 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded text-xs"
                      >
                        {sub.completed ? "Undo" : "Complete"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {/* Add Subtask Section */}
              <div className="mt-2">
                {showSubtaskInput[task.id] ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={subtaskInputs[task.id] || ""}
                      onChange={(e) =>
                        setSubtaskInputs((prev) => ({ ...prev, [task.id]: e.target.value }))
                      }
                      placeholder="Enter subtask"
                      className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 text-sm"
                    />
                    <button
                      onClick={() => handleAddSubtask(task)}
                      className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm"
                    >
                      Add
                    </button>
                    <button
                      onClick={() =>
                        setShowSubtaskInput((prev) => ({ ...prev, [task.id]: false }))
                      }
                      className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() =>
                      setShowSubtaskInput((prev) => ({ ...prev, [task.id]: true }))
                    }
                    className="mt-1 text-sm text-blue-500 underline"
                  >
                    Add Subtask
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {filteredTasks.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 italic">No tasks found.</p>
      )}
    </div>
  );
}
