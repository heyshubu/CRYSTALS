"use client";

import {
  Warehouse,
  Users,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

const STATS = [
  {
    label: "Active Shelters",
    value: "12",
    icon: Warehouse,
    color: "#0072B2",
    change: "+2 this week",
  },
  {
    label: "Registered Personnel",
    value: "84",
    icon: Users,
    color: "#22c55e",
    change: "+12 this week",
  },
  {
    label: "Pending Reports",
    value: "23",
    icon: AlertTriangle,
    color: "#f59e0b",
    change: "5 urgent",
  },
  {
    label: "Needs Resolved",
    value: "156",
    icon: CheckCircle2,
    color: "#10b981",
    change: "+34 this week",
  },
];

const RECENT_ACTIVITY = [
  { time: "2 mins ago", text: "New emergency report from Kathmandu", type: "urgent" },
  { time: "15 mins ago", text: "Medical supplies dispatched to Sindhupalchok", type: "info" },
  { time: "1 hour ago", text: "Bhaktapur shelter capacity updated to 200", type: "info" },
  { time: "2 hours ago", text: "Low stock alert: Medical Kits at Gorkha center", type: "warning" },
  { time: "3 hours ago", text: "12 new volunteers registered", type: "info" },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p className="text-gray-600 mb-8">
        Overview of all relief operations and resources.
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: stat.color + "15" }}
                >
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <TrendingUp className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {RECENT_ACTIVITY.map((activity, i) => (
            <div key={i} className="flex items-start gap-3">
              <div
                className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                  activity.type === "urgent"
                    ? "bg-red-500"
                    : activity.type === "warning"
                    ? "bg-yellow-500"
                    : "bg-blue-500"
                }`}
              />
              <div>
                <p className="text-sm text-gray-900">{activity.text}</p>
                <p className="text-xs text-gray-400">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
        <Link
          href="/admin/reports"
          className="mt-4 inline-block text-sm font-semibold text-[#0072B2] hover:underline"
        >
          View all reports →
        </Link>
      </div>
    </div>
  );
}
