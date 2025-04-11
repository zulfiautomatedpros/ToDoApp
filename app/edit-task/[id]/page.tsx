// app/edit-task/[id]/page.tsx
'use client';
import { useRouter, useParams } from 'next/navigation';
import TodoForm from '@/components/TodoForm';
import { useTodos, Task } from '@/context/TodoContext';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function EditTaskPage() {
  const { id } = useParams() as { id: string };
  const { tasks, updateTask } = useTodos();
  const { user } = useAuth();
  const router = useRouter();

  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!user) router.push('/login');
    const task = tasks.find((t) => t.id === id);
    if (!task) {
      router.push('/');
    } else {
      setCurrentTask(task);
    }
  }, [id, tasks, user, router]);

  if (!currentTask) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 dark:text-gray-100">Edit Task</h2>
      <TodoForm task={currentTask} updateTask={updateTask} />
    </div>
  );
}
