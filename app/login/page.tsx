// app/login/page.tsx
"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes, simulate login; in production, use proper authentication.
    login({ id: email, name: "", email, password });
    router.push("/");
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-2xl mb-4 text-gray-900 dark:text-gray-100 font-bold">Sign In</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2text-gray-900 dark:text-gray-100">
          Email:
          <input
            type="email"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="block mb-2 dark:text-gray-100">
          Password:
          <input
            type="password"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded mt-4 dark:text-gray-100">
          Sign In
        </button>
      </form>
      <p className="mt-4 dark:text-gray-100">
        Don't have an account?{" "}
        <a href="/signup" className="text-blue-500 underline dark:text-gray-100">
          Sign Up
        </a>
      </p>
    </div>
  );
}
