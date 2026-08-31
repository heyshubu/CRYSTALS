"use client";

import { FileText, Search, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

const REPORTS = [
  { id: "1", type: "Medical Emergency", location: "Kathmandu, Ward 7", time: "10 mins ago", status: "urgent" },
  { id: "2", type: "Flood Damage", location: "Sindhupalchok, Melamchi", time: "30 mins ago", status: "pending" },
  { id: "3", type: "Food Shortage", location: "Gorkha, Palpa", time: "1 hour ago", status: "pending" },
  { id: "4", type: "Building Collapse", location: "Bhaktapur, Thimi", time: "2 hours ago", status: "resolved" },
  { id: "5", type: "Medical Supplies Needed", location: "Lalitpur, Patan", time: "3 hours ago", status: "resolved" },
];

const STATUS_CONFIG = {
  urgent: { label: "Urgent", color: "bg-red-100 text-red-700", icon: AlertTriangle },
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  resolved: { label: "Resolved", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
};

export default function ReportsPage() {
  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
          <p className="text-gray-600">View and manage all emergency reports.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search reports..."
            className="pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0072B2] focus:border-transparent w-72"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
          <div className="col-span-3">Type</div>
          <div className="col-span-4">Location</div>
          <div className="col-span-2">Time</div>
          <div className="col-span-3 text-right">Status</div>
        </div>
        {REPORTS.map((report) => {
          const cfg = STATUS_CONFIG[report.status as keyof typeof STATUS_CONFIG];
          const Icon = cfg.icon;
          return (
            <div key={report.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center border-t border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="col-span-3 font-medium text-gray-900">{report.type}</div>
              <div className="col-span-4 text-sm text-gray-600">{report.location}</div>
              <div className="col-span-2 text-sm text-gray-500">{report.time}</div>
              <div className="col-span-3 text-right">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                  {cfg.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
