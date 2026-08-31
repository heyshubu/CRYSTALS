"use client";

import { Users, Search } from "lucide-react";

const PERSONNEL = [
  { id: "1", name: "Ram Sharma", role: "Field Coordinator", shelter: "Kathmandu Central", status: "On Duty" },
  { id: "2", name: "Sita Patel", role: "Medical Officer", shelter: "Bhaktapur Temporary", status: "On Duty" },
  { id: "3", name: "Hari Thapa", role: "Logistics Lead", shelter: "Gorkha Emergency", status: "Off Duty" },
  { id: "4", name: "Gita Gurung", role: "Volunteer Supervisor", shelter: "Kathmandu Central", status: "On Duty" },
  { id: "5", name: "Bikash Rai", role: "Transport Coordinator", shelter: "Bhaktapur Temporary", status: "On Duty" },
];

export default function PersonnelPage() {
  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Personnel Management</h1>
          <p className="text-gray-600">Track and manage relief workers across all shelters.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search personnel..."
            className="pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0072B2] focus:border-transparent w-72"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
          <div className="col-span-3">Name</div>
          <div className="col-span-3">Role</div>
          <div className="col-span-3">Shelter</div>
          <div className="col-span-3 text-right">Status</div>
        </div>
        {PERSONNEL.map((p) => (
          <div key={p.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center border-t border-gray-100">
            <div className="col-span-3 font-medium text-gray-900">{p.name}</div>
            <div className="col-span-3 text-sm text-gray-600">{p.role}</div>
            <div className="col-span-3 text-sm text-gray-600">{p.shelter}</div>
            <div className="col-span-3 text-right">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                  p.status === "On Duty"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    p.status === "On Duty" ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
                {p.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
