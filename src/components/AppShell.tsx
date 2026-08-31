"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/hooks/use-session";
import { useTheme, THEMES, type ThemeName } from "@/lib/theme-context";
import { useFont } from "@/lib/font-context";
import {
  Map,
  ShieldCheck,
  AlertTriangle,
  Building2,
  HeartPulse,
  LogIn,
  Palette,
  Type,
  LogOut,
  Home,
  Users,
  Shield,
  Package,
  FileText,
  Bell,
  Menu,
  X,
  ChevronRight,
  Phone,
} from "lucide-react";
import { useState } from "react";

const publicNavItems = [
  { href: "/", label: "Map", icon: Map },
  { href: "/safe", label: "I'm Safe", icon: ShieldCheck },
  { href: "/report", label: "Report Need", icon: AlertTriangle },
  { href: "/shelters", label: "Shelters", icon: Building2 },
  { href: "/first-aid", label: "First Aid", icon: HeartPulse },
];

const responderNavItems = [
  { href: "/responder", label: "Dashboard", icon: Home },
  { href: "/shelters", label: "Shelters", icon: Building2 },
];

const superadminNavItems = [
  { href: "/superadmin", label: "Dashboard", icon: Home },
  { href: "/admin", label: "Admin Panel", icon: Shield },
  { href: "/shelters", label: "Shelters", icon: Building2 },
  { href: "/first-aid", label: "First Aid", icon: HeartPulse },
];



export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { session, mounted, logout } = useSession();
  const { theme, setTheme } = useTheme();
  const { font, setFont } = useFont();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoggedIn = mounted && session;
  const role = session?.role;
  const isPublic = !isLoggedIn;
  const isResponder = role === "responder";
  const isSuperadmin = role === "superadmin";

  // Choose nav items based on role
  const navItems = isSuperadmin
    ? superadminNavItems
    : isResponder
    ? responderNavItems
    : publicNavItems;

  // Don't show shell on login page
  if (pathname === "/login") {
    return <>{children}</>;
  }

  const themeIcons: Record<string, string> = {
    normal: "👁️",
    deuteranomaly: "🟢",
    protanomaly: "🔴",
    deuteranopia: "🔵",
    protanopia: "🟤",
  };
  const currentThemeLabel = THEMES.find((t) => t.value === theme)?.label || "Normal";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Top Navbar ─────────────────────────────── */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo + Title */}
            <Link href={isLoggedIn ? (isSuperadmin ? "/superadmin" : "/responder") : "/"} className="flex items-center gap-3">
              <div className="w-9 h-9 relative rounded-lg overflow-hidden">
                <Image src="/Logo.jpeg" alt="Logo" fill className="object-contain" />
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-gray-900 text-sm leading-tight block">
                  {isSuperadmin
                    ? "Coordinator Dashboard"
                    : isResponder
                    ? "Responder Dashboard"
                    : "Disaster Relief Nepal"}
                </span>
                {isLoggedIn && (
                  <span className="text-[10px] text-gray-400 leading-tight">
                    {isSuperadmin ? "COORD-2026" : session?.responder?.name || "Responder"}
                  </span>
                )}
              </div>
            </Link>

            {/* Center: Desktop nav items */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {/* Emergency call button (public) */}
              {isPublic && (
                <a
                  href="tel:100"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Emergency: 100
                </a>
              )}

              {/* Theme toggle */}
              {/* Theme dropdown */}
              <div className="relative group">
                <button
                  title={`Color vision: ${currentThemeLabel}`}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition flex items-center gap-1"
                >
                  <Palette className="w-4 h-4" />
                  <span className="text-[10px] hidden sm:inline">{themeIcons[theme] || "👁️"}</span>
                </button>
                <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <p className="px-3 py-1.5 text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Color Vision Type</p>
                  {THEMES.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setTheme(t.value)}
                      className={`w-full text-left px-3 py-2 text-sm flex items-center gap-3 transition ${
                        theme === t.value ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-base">{themeIcons[t.value]}</span>
                      <div>
                        <span className="block text-sm">{t.label}</span>
                        <span className="block text-[10px] text-gray-400">{t.description}</span>
                      </div>
                      {theme === t.value && <span className="ml-auto text-blue-600 text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font toggle */}
              <button
                onClick={() => setFont(font === "dyslexia-friendly" ? "default" : "dyslexia-friendly")}
                title={font === "dyslexia-friendly" ? "Switch to standard font" : "Switch to dyslexia-friendly font"}
                className={`p-2 rounded-lg transition flex items-center gap-1 ${
                  font === "dyslexia-friendly"
                    ? "bg-purple-50 text-purple-600"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Type className="w-4 h-4" />
                <span className="text-[10px] hidden sm:inline">{font === "dyslexia-friendly" ? "ABC" : "Aa"}</span>
              </button>

              {/* Public: Login button */}
              {isPublic && (
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}

              {/* Logged in: Profile + Logout */}
              {isLoggedIn && (
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                        isSuperadmin ? "bg-purple-600" : "bg-blue-600"
                      }`}
                    >
                      {isSuperadmin ? "C" : "R"}
                    </div>
                    <div className="text-xs">
                      <span className="font-semibold text-gray-700 block leading-tight">
                        {isSuperadmin ? "Coordinator" : session?.responder?.name || "Responder"}
                      </span>
                      <span className="text-gray-400 leading-tight">
                        {isSuperadmin ? "Superadmin" : session?.responder?.skill || "Responder"}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-500 hover:bg-gray-50 rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
              {isPublic && (
                <>
                  <div className="border-t border-gray-100 my-2" />
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50"
                  >
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* ── Page Content ────────────────────────────── */}
      <main className="relative">{children}</main>

      {/* ── Bottom Nav (mobile only, public pages) ──── */}
      {isPublic && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200 md:hidden safe-area-bottom">
          <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
            {publicNavItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] transition ${
                    isActive
                      ? "text-blue-600 font-semibold"
                      : "text-gray-500"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <Link
              href="/login"
              className="flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] text-gray-500 border-l border-gray-100 pl-3"
            >
              <LogIn className="w-5 h-5" />
              <span>Sign In</span>
            </Link>
          </div>
        </nav>
      )}

      {/* Bottom spacer for mobile bottom nav */}
      {isPublic && <div className="h-20 md:hidden" />}
    </div>
  );
}
