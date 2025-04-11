// app/page.tsx
"use client";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import TodoApp from "@/components/TodoApp";
import Toast from "@/components/Toast";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Do not redirect while auth is still loading.
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;

  if (!user) return <div>Loading...</div>;

  return (
    <>
      <TodoApp />
      <Toast />
    </>
  );
}
