"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/hooks/use-session";
import {
  KeyRound,
  Loader2,
  ArrowLeft,
  Shield,
  Users,
  ChevronRight,
  Lock,
  MapPin,
  Phone,
} from "lucide-react";

type LoginStep = "role-select" | "enter-code";
type UserRole = "superadmin" | "responder";

export default function LoginPage() {
  const router = useRouter();
  const { session, mounted, login, logout } = useSession();
  const [step, setStep] = useState<LoginStep>("role-select");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep("enter-code");
    setError("");
    setCode("");
  };

  const handleLogin = async () => {
    if (!code.trim()) {
      setError("Please enter your access code.");
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

      // Verify the role matches what was selected
      if (data.role !== selectedRole) {
        setError(
          data.role === "superadmin"
            ? "That's a coordinator passcode. Please select Coordinator above."
            : "That's a responder code. Please select Responder above."
        );
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

  // If already logged in, show current session
  if (mounted && session) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 w-full max-w-sm text-center">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            Already Logged In
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            You&apos;re signed in as{" "}
            <span className="font-semibold text-gray-700">{session.role}</span>
          </p>
          <button
            onClick={() => {
              const target =
                session.role === "superadmin" ? "/superadmin" : "/responder";
              router.push(target);
            }}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 mb-3 flex items-center justify-center gap-2"
          >
            Go to Dashboard
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              logout();
              setStep("role-select");
              setSelectedRole(null);
            }}
            className="w-full py-3 text-gray-500 hover:text-gray-700 text-sm font-medium"
          >
            Sign out and use a different account
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (!mounted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* ── Step 1: Role Selection ──────────────────── */}
        {step === "role-select" && (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                <KeyRound className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Sign In
              </h1>
              <p className="text-gray-500 text-sm">
                Choose your role to continue
              </p>
            </div>

            <div className="space-y-3">
              {/* Coordinator / Superadmin */}
              <button
                onClick={() => handleRoleSelect("superadmin")}
                className="w-full bg-white border-2 border-gray-200 rounded-2xl p-5 text-left hover:border-purple-400 hover:bg-purple-50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-200 transition">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">Coordinator</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Manage responders, assign tasks, oversee operations
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-purple-500 transition" />
                </div>
              </button>

              {/* Responder */}
              <button
                onClick={() => handleRoleSelect("responder")}
                className="w-full bg-white border-2 border-gray-200 rounded-2xl p-5 text-left hover:border-blue-400 hover:bg-blue-50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">Responder</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      View tasks, pick up needs, update shelter capacity
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition" />
                </div>
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-xs text-gray-400">
                Need help? Contact your team coordinator
              </p>
            </div>
          </>
        )}

        {/* ── Step 2: Enter Code ──────────────────────── */}
        {step === "enter-code" && selectedRole && (
          <>
            <button
              onClick={() => {
                setStep("role-select");
                setError("");
                setCode("");
              }}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to role selection
            </button>

            <div className="text-center mb-8">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                  selectedRole === "superadmin"
                    ? "bg-purple-50"
                    : "bg-blue-50"
                }`}
              >
                {selectedRole === "superadmin" ? (
                  <Lock className="w-8 h-8 text-purple-600" />
                ) : (
                  <Users className="w-8 h-8 text-blue-600" />
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedRole === "superadmin"
                  ? "Coordinator Login"
                  : "Responder Login"}
              </h1>
              <p className="text-gray-500 text-sm">
                {selectedRole === "superadmin"
                  ? "Enter your coordinator passcode"
                  : "Enter your personal access code"}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <input
                type={selectedRole === "superadmin" ? "password" : "text"}
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder={
                  selectedRole === "superadmin"
                    ? "Coordinator passcode"
                    : "e.g. RESP-MED-001"
                }
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-center text-lg tracking-widest font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                autoFocus
              />

              {error && (
                <p className="text-red-500 text-sm mt-3 text-center">
                  {error}
                </p>
              )}

              <button
                onClick={handleLogin}
                disabled={loading || !code.trim()}
                className={`w-full mt-4 py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition disabled:opacity-50 ${
                  selectedRole === "superadmin"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    Sign In
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 flex items-start gap-3 bg-gray-50 rounded-xl p-4">
              <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-500">
                {selectedRole === "superadmin"
                  ? "Contact the system administrator if you've lost your coordinator passcode."
                  : "Ask your coordinator for a personal access code if you don't have one."}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
