// app/signup/page.tsx
"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes, simulate signup.
    signup({ id: email, name, email, password });
    router.push("/");
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-2xl mb-4 font-bold dark:text-gray-100">Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 dark:text-gray-100">
          Name:
          <input
            type="text"
            className="w-full p-2 border border-gray-300 dark:border-gray-600  rounded mt-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label className="block mb-2 dark:text-gray-100">
          Email:
          <input
            type="email"
            className="w-full p-2 border border-gray-300 dark:border-gray-600  rounded mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="block mb-2 dark:text-gray-100">
          Password:
          <input
            type="password"
            className="w-full p-2 border border-gray-300 dark:border-gray-600  rounded mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded mt-4 dark:text-gray-100">
          Sign Up
        </button>
      </form>
      <p className="mt-4 dark:text-gray-100">
        Already have an account?{" "}
        <a href="/login" className="text-blue-500 underline dark:text-gray-100">
          Sign In
        </a>
      </p>
    </div>
  );
}
