"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";

export default function LoginPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!code.trim()) {
      setError("Please enter your code.");
      return;
    }

    // TODO: Step 5/6 — call API route to validate code
    // If responder code → redirect to /responder
    // If coordinator passcode → redirect to /superadmin
    // For now, placeholder logic:
    if (code === "COORD-2026") {
      router.push("/superadmin");
    } else {
      router.push("/responder");
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto flex flex-col items-center justify-center min-h-[60vh]">
      <KeyRound className="w-12 h-12 text-blue-600 mb-4" />
      <h1 className="text-xl font-bold mb-6">Login</h1>
      <input
        type="text"
        value={code}
        onChange={(e) => {
          setCode(e.target.value);
          setError("");
        }}
        placeholder="Enter your access code"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 text-center text-lg tracking-widest"
      />
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <button
        onClick={handleLogin}
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
      >
        Enter
      </button>
    </div>
  );
}
