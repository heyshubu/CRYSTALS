"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!code.trim()) {
      setError("Please enter your code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid code.");
        setLoading(false);
        return;
      }

      // Store session and redirect
      localStorage.setItem("disaster-relief-session", JSON.stringify(data));

      if (data.role === "superadmin") {
        router.push("/superadmin");
      } else {
        router.push("/responder");
      }
    } catch {
      setError("Connection error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto flex flex-col items-center justify-center min-h-[60vh]">
      <KeyRound className="w-12 h-12 text-blue-600 mb-4" />
      <h1 className="text-xl font-bold mb-2">Login</h1>
      <p className="text-gray-500 text-sm mb-6 text-center">
        Responder personal code or coordinator passcode
      </p>
      <input
        type="text"
        value={code}
        onChange={(e) => {
          setCode(e.target.value);
          setError("");
        }}
        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        placeholder="Enter your access code"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 text-center text-lg tracking-widest"
      />
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          "Enter"
        )}
      </button>
      <p className="text-xs text-gray-400 mt-4 text-center">
        Ask your coordinator for an access code
      </p>
    </div>
  );
}
