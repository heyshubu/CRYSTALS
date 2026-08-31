"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Warehouse,
  Users,
  FileText,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/shelter-inventory", label: "Shelter Inventory", icon: Warehouse },
  { href: "/admin/personnel", label: "Personnel", icon: Users },
  { href: "/admin/reports", label: "Reports", icon: FileText },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm sticky top-0 z-50">
        <Link href="/" className="text-xl font-bold text-gray-900">
          Sanyukta
        </Link>
        <div className="hidden md:flex items-center gap-8 font-medium text-sm text-gray-600">
          <Link href="/" className="hover:text-[#0072B2] transition-colors pb-1">
            Relief Map
          </Link>
          <Link
            href="/admin/shelter-inventory"
            className="text-[#0072B2] border-b-2 border-[#0072B2] transition-colors pb-1"
          >
            Resources
          </Link>
          <Link href="#" className="hover:text-[#0072B2] transition-colors pb-1">
            Volunteer Hub
          </Link>
          <Link href="#" className="hover:text-[#0072B2] transition-colors pb-1">
            Emergency Contacts
          </Link>
        </div>
        <Link
          href="/report-emergency"
          className="flex items-center gap-2 text-white px-5 py-2.5 rounded-full font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#0072B2" }}
        >
          Report Emergency
        </Link>
      </nav>

      <div className="flex-1 flex max-w-[1400px] w-full mx-auto px-6 py-8 gap-8">
        {/* Admin Sidebar */}
        <aside className="w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Admin Controls
            </h3>
            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[#0072B2] text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
