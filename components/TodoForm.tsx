// components/TodoForm.tsx
"use client";
import { useState } from "react";
import { useTodos, Task } from "@/context/TodoContext";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { useCategory } from "@/context/CategoryContext";

interface TodoFormProps {
  task?: Task;
  updateTask?: (task: Task) => void;
}

export default function TodoForm({ task, updateTask }: TodoFormProps) {
  const isEditing = Boolean(task);
  const { addTask } = useTodos();
  const { categories, addCategory } = useCategory();
  const router = useRouter();

  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [dueDate, setDueDate] = useState(task?.dueDate || "");
  const [priority, setPriority] = useState<"high" | "medium" | "low">(
    task?.priority || "medium"
  );
  // If user already had a category in the task, default to that. Otherwise, pick the first category or empty if none exist.
  const [category, setCategory] = useState(task?.category || categories[0] || "");

  // Modal state for new category
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: Task = {
      id: task ? task.id : uuidv4(),
      title,
      description,
      completed: task ? task.completed : false,
      createdAt: task ? task.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate,
      category,
      priority,
      notes: "",
    };
    if (isEditing && updateTask) {
      updateTask(newTask);
    } else {
      addTask(newTask);
    }
    router.push("/");
  };

  const handleCategoryChange = (value: string) => {
    if (value === "ADD_NEW_CATEGORY") {
      // Show the modal
      setShowCategoryModal(true);
    } else {
      setCategory(value);
    }
  };

  const createNewCategory = () => {
    if (newCategory.trim() !== "") {
      addCategory(newCategory.trim());
      setCategory(newCategory.trim()); // Set the newly created category as selected
      setNewCategory("");
    }
    setShowCategoryModal(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white dark:bg-gray-800 rounded shadow space-y-4"
    >
      <div>
        <label className="block font-medium text-gray-700 dark:text-gray-200">
          Title
        </label>
        <input
          type="text"
          className="w-full p-2 border rounded mt-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block font-medium text-gray-700 dark:text-gray-200">
          Description
        </label>
        <textarea
          className="w-full p-2 border rounded mt-1"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-200">
            Due Date
          </label>
          <input
            type="date"
            className="w-full p-2 border rounded mt-1"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-200">
            Category
          </label>
          <select
            className="w-full p-2 border rounded mt-1"
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
            <option value="ADD_NEW_CATEGORY">+ Add New Category</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block font-medium text-gray-700 dark:text-gray-200">
          Priority
        </label>
        <select
          className="w-full p-2 border rounded mt-1"
          value={priority}
          onChange={(e) => setPriority(e.target.value as "high" | "medium" | "low")}
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors"
      >
        {isEditing ? "Update Task" : "Add Task"}
      </button>

      {/* Modal for new category */}
      {showCategoryModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-700 p-4 rounded shadow-lg space-y-4 w-80">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              New Category
            </h2>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Enter category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCategoryModal(false)}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={createNewCategory}
                className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
