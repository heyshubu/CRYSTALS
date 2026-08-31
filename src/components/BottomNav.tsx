"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Map,
  ShieldCheck,
  AlertTriangle,
  Building2,
  HeartPulse,
  LogIn,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Map", icon: Map },
  { href: "/safe", label: "I'm Safe", icon: ShieldCheck },
  { href: "/report", label: "Report Need", icon: AlertTriangle },
  { href: "/shelters", label: "Shelters", icon: Building2 },
  { href: "/first-aid", label: "First Aid", icon: HeartPulse },
];

export function BottomNav() {
  const pathname = usePathname();

  // Hide the nav on responder/superadmin/login pages — they have their own UI
  if (pathname.startsWith("/responder") || pathname.startsWith("/superadmin") || pathname === "/login") {
    return null;
  }

  const isLoginActive = pathname === "/login";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex items-center h-16 max-w-lg mx-auto">
        {/* 5 public nav items */}
        <div className="flex justify-around flex-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-2 py-1 text-xs transition-colors ${
                  isActive
                    ? "text-blue-600 font-semibold"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Login entry — visually distinct, separated by a border */}
        <Link
          href="/login"
          className={`flex flex-col items-center gap-1 px-3 py-1 text-[10px] border-l border-gray-200 transition-colors ${
            isLoginActive
              ? "text-purple-600 font-semibold"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <LogIn className="w-4 h-4" />
          <span>Login</span>
        </Link>
      </div>
    </nav>
  );
}
