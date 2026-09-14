"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/hooks/use-session";
import { useTheme, THEMES, type ThemeName } from "@/lib/theme-context";
import { useFont } from "@/lib/font-context";
import { useLanguage } from "@/lib/language-context";
import { LOCALES } from "@/lib/i18n";
import {
  Map,
  ShieldCheck,
  AlertTriangle,
  Building2,
  HeartPulse,
  LogIn,
  Eye,
  Type,
  LogOut,
  Home,
  Shield,
  Package,
  Phone,
  Menu,
  X,
  ChevronDown,
  Languages,
  Check,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

const publicNavItems = [
  { href: "/", labelKey: "nav.map", icon: Map },
  { href: "/safe", labelKey: "nav.safe", icon: ShieldCheck },
  { href: "/report", labelKey: "nav.report", icon: AlertTriangle },
  { href: "/shelters", labelKey: "nav.shelters", icon: Building2 },
  { href: "/first-aid", labelKey: "nav.firstAid", icon: HeartPulse },
];

const responderNavItems = [
  { href: "/responder", labelKey: "nav.dashboard", icon: Home },
  { href: "/shelters", labelKey: "nav.shelters", icon: Building2 },
];

const superadminNavItems = [
  { href: "/superadmin", labelKey: "nav.dashboard", icon: Home },
  { href: "/admin", labelKey: "nav.admin", icon: Shield },
  { href: "/shelters", labelKey: "nav.shelters", icon: Building2 },
  { href: "/first-aid", labelKey: "nav.firstAid", icon: HeartPulse },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { session, mounted, logout } = useSession();
  const { theme, setTheme } = useTheme();
  const { font, setFont } = useFont();
  const { locale, setLocale, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const themeRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = mounted && session;
  const role = session?.role;
  const isPublic = !isLoggedIn;
  const isResponder = role === "responder";
  const isSuperadmin = role === "superadmin";

  const navItems = isSuperadmin ? superadminNavItems : isResponder ? responderNavItems : publicNavItems;

  // Close theme dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setThemeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (pathname === "/login") return <>{children}</>;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>
      {/* ── Top Navbar ─────────────────────────────── */}
      <nav className="bg-white border-b sticky top-0 z-[1500]" style={{ borderColor: "var(--color-border)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Left: Logo + Title */}
            <Link href={isLoggedIn ? (isSuperadmin ? "/superadmin" : "/responder") : "/"} className="flex items-center gap-2.5">
              <div className="w-8 h-8 relative rounded-lg overflow-hidden flex-shrink-0">
                <Image src="/Logo.jpeg" alt="Logo" fill className="object-contain" />
              </div>
              <span className="font-bold text-sm hidden sm:block" style={{ color: "var(--color-text)" }}>
                {isSuperadmin ? t("app.coordinator") : isResponder ? t("app.responder") : t("app.name")}
              </span>
            </Link>

            {/* Center: Desktop nav */}
            <div className="hidden md:flex items-center gap-0.5">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      backgroundColor: isActive ? "var(--color-primary-light)" : "transparent",
                      color: isActive ? "var(--color-primary)" : "var(--color-text-secondary)",
                    }}
                  >
                    <item.icon className="w-3.5 h-3.5" />
                    {t(item.labelKey)}
                  </Link>
                );
              })}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1.5">
              {/* Emergency (public only) */}
              {isPublic && (
                <a
                  href="tel:100"
                  className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition"
                  style={{ backgroundColor: "var(--color-danger-light)", color: "var(--color-danger)" }}
                >
                  <Phone className="w-3 h-3" />
                  100
                </a>
              )}

              {/* Theme selector */}
              <div className="relative" ref={themeRef}>
                <button
                  onClick={() => setThemeOpen(!themeOpen)}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs transition"
                  style={{
                    color: "var(--color-text-muted)",
                    backgroundColor: themeOpen ? "var(--color-primary-light)" : "transparent",
                  }}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t("menu.colorVision")}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {themeOpen && (
                  <div
                    className="absolute right-0 top-full mt-1 w-72 rounded-xl shadow-xl py-1 z-[1600]"
                    style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
                  >
                    <p className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--color-text-muted)" }}>
                      {t("menu.colorVision")}
                    </p>
                    {THEMES.map((th) => (
                      <button
                        key={th.value}
                        onClick={() => { setTheme(th.value); setThemeOpen(false); }}
                        className="w-full text-left px-3 py-2 text-xs flex items-center gap-3 transition"
                        style={{
                          backgroundColor: theme === th.value ? "var(--color-primary-light)" : "transparent",
                          color: theme === th.value ? "var(--color-primary)" : "var(--color-text)",
                        }}
                      >
                        <div className="flex gap-0.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme === th.value ? "var(--color-primary)" : "var(--color-border)" }} />
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--color-danger)" }} />
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--color-success)" }} />
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--color-warning)" }} />
                        </div>
                        <div className="flex-1">
                          <span className="block text-xs font-medium">{t(`theme.${th.value}`)}</span>
                          <span className="block text-[10px]" style={{ color: "var(--color-text-muted)" }}>{t(`theme.${th.value}Desc`)}</span>
                        </div>
                        {theme === th.value && <span style={{ color: "var(--color-primary)" }}>✓</span>}
                      </button>
                    ))}
                    {/* Language selector */}
                    <div className="border-t my-1" style={{ borderColor: "var(--color-border)" }} />
                    <p className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--color-text-muted)" }}>
                      {t("menu.language")}
                    </p>
                    {LOCALES.map((l) => (
                      <button
                        key={l.value}
                        onClick={() => { setLocale(l.value); setThemeOpen(false); }}
                        className="w-full text-left px-3 py-2 text-xs flex items-center gap-3 transition"
                        style={{
                          backgroundColor: locale === l.value ? "var(--color-primary-light)" : "transparent",
                          color: locale === l.value ? "var(--color-primary)" : "var(--color-text)",
                        }}
                      >
                        <Languages className="w-4 h-4" />
                        <div className="flex-1">
                          <span className="block text-xs font-medium">{l.nativeLabel}</span>
                        </div>
                        {locale === l.value && <Check className="w-3.5 h-3.5" style={{ color: "var(--color-primary)" }} />}
                      </button>
                    ))}

                    <div className="border-t my-1" style={{ borderColor: "var(--color-border)" }} />
                    <p className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--color-text-muted)" }}>
                      {t("menu.font")}
                    </p>
                    <button
                      onClick={() => setFont(font === "dyslexia-friendly" ? "default" : "dyslexia-friendly")}
                      className="w-full text-left px-3 py-2 text-xs flex items-center gap-3 transition"
                      style={{
                        color: font === "dyslexia-friendly" ? "var(--color-purple)" : "var(--color-text)",
                        backgroundColor: font === "dyslexia-friendly" ? "var(--color-purple-light)" : "transparent",
                      }}
                    >
                      <Type className="w-4 h-4" />
                      <div className="flex-1">
                        <span className="block text-xs font-medium">{t("menu.dyslexiaFont")}</span>
                        <span className="block text-[10px]" style={{ color: "var(--color-text-muted)" }}>{t("menu.dyslexiaDesc")}</span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded" style={{
                        backgroundColor: font === "dyslexia-friendly" ? "var(--color-purple)" : "var(--color-border)",
                        color: font === "dyslexia-friendly" ? "white" : "var(--color-text-muted)",
                      }}>
                        {font === "dyslexia-friendly" ? t("menu.on") : t("menu.off")}
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* Public: Sign In */}
              {isPublic && (
                <Link
                  href="/login"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t("nav.signIn")}</span>
                </Link>
              )}

              {/* Logged in: Profile + Logout */}
              {isLoggedIn && (
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg" style={{ backgroundColor: "var(--color-primary-light)" }}>
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                      style={{ backgroundColor: "var(--color-primary)" }}
                    >
                      {isSuperadmin ? "C" : "R"}
                    </div>
                    <span className="text-xs font-medium" style={{ color: "var(--color-primary)" }}>
                      {isSuperadmin ? t("app.coordinator") : session?.responder?.name || t("app.responder")}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="p-1.5 rounded-lg transition"
                    style={{ color: "var(--color-text-muted)" }}
                    title={t("nav.logout")}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Mobile menu */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 rounded-lg"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}>
            <div className="px-4 py-2 space-y-0.5">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition"
                    style={{
                      backgroundColor: isActive ? "var(--color-primary-light)" : "transparent",
                      color: isActive ? "var(--color-primary)" : "var(--color-text-secondary)",
                    }}
                  >
                    <item.icon className="w-4 h-4" />
                    {t(item.labelKey)}
                  </Link>
                );
              })}
              {isPublic && (
                <>
                  <div className="border-t my-2" style={{ borderColor: "var(--color-border)" }} />
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium"
                    style={{ color: "var(--color-primary)" }}
                  >
                    <LogIn className="w-4 h-4" />
                    {t("nav.signIn")}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* ── Page Content ────────────────────────────── */}
      <main className="relative">{children}</main>

      {/* ── Bottom Nav (mobile, public only) ──── */}
      {isPublic && (
        <nav className="fixed bottom-0 left-0 right-0 z-[1500] border-t md:hidden safe-area-bottom" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}>
          <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
            {publicNavItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] transition"
                  style={{ color: isActive ? "var(--color-primary)" : "var(--color-text-muted)" }}
                >
                  <item.icon className="w-5 h-5" />
                  <span style={{ fontWeight: isActive ? 600 : 400 }}>{t(item.labelKey)}</span>
                </Link>
              );
            })}
            <Link
              href="/login"
              className="flex flex-col items-center gap-0.5 px-2 py-1 text-[10px]"
              style={{ color: "var(--color-text-muted)" }}
            >
              <LogIn className="w-5 h-5" />
              <span>{t("nav.signIn")}</span>
            </Link>
          </div>
        </nav>
      )}

      {isPublic && <div className="h-16 md:hidden" />}
    </div>
  );
}
