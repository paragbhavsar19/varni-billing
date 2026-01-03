"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === "parag" && password === "parag") {
      // Store login status in localStorage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("username", username);
      }
      router.push("/dashboard");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <main className="flex min-h-screen w-full max-w-3xl flex-col items-center py-10 px-16 bg-white dark:bg-black sm:items-start mx-auto">
      <Image
        className="dark:invert"
        src="/ocbis.jpeg"
        alt="ocbis logo"
        width={100}
        height={20}
        priority
      />
      <div className="w-full max-w-md mx-auto mt-10">
        <h1 className="text-orange-950 font-bold text-center text-3xl mb-10">
          Login
        </h1>
        
        <div>
          <div className="flex flex-col gap-1.5 mb-3">
            <label htmlFor="username" className="text-md">
              Username:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="border border-gray-300 rounded-sm px-3 h-10"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-md">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin(e)}
              placeholder="Password"
              className="border border-gray-300 rounded-sm px-3 h-10"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-sm text-sm mt-3">
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            className="bg-orange-950 text-white w-full rounded-sm h-10 mt-6 font-bold hover:bg-orange-900 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    </main>
  );
}