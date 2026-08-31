"use client";

import { Utensils, Droplet, Home, BriefcaseMedical, TriangleAlert } from "lucide-react";
import { useFilters } from "@/lib/filter-context";

export function Sidebar() {
  const { urgency, setUrgency, resource, setResource } = useFilters();

  return (
    <aside className="w-80 flex-shrink-0 flex flex-col gap-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Filters</h2>

        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Urgency Level</h3>
          <div className="flex flex-col gap-3">
            {/* High Priority */}
            <label className="flex items-center gap-3 cursor-pointer group" onClick={() => setUrgency('high')}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors border-2 ${urgency === 'high' ? 'bg-yellow-400 border-yellow-400' : 'bg-white border-gray-300 group-hover:border-yellow-400'}`}>
                {urgency === 'high' && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <span className="w-3 h-3 rounded-full bg-yellow-400 shrink-0"></span>
              <span className="text-sm font-medium text-gray-800">High Priority</span>
            </label>

            {/* Medium Priority */}
            <label className="flex items-center gap-3 cursor-pointer group" onClick={() => setUrgency('medium')}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors border-2 ${urgency === 'medium' ? 'bg-[#0072B2] border-[#0072B2]' : 'bg-white border-gray-300 group-hover:border-[#0072B2]'}`}>
                {urgency === 'medium' && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <span className="w-3 h-3 rounded-full bg-[#0072B2] shrink-0"></span>
              <span className="text-sm font-medium text-gray-800">Medium Priority</span>
            </label>

            {/* Low Priority */}
            <label className="flex items-center gap-3 cursor-pointer group" onClick={() => setUrgency('low')}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors border-2 ${urgency === 'low' ? 'bg-gray-500 border-gray-500' : 'bg-white border-gray-300 group-hover:border-gray-500'}`}>
                {urgency === 'low' && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <span className="w-3 h-3 rounded-full bg-gray-500 shrink-0"></span>
              <span className="text-sm font-medium text-gray-800">Low Priority</span>
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Resource Type</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'food', label: 'Food', Icon: Utensils },
              { key: 'water', label: 'Water', Icon: Droplet },
              { key: 'shelter', label: 'Shelter', Icon: Home },
              { key: 'medical', label: 'Medical', Icon: BriefcaseMedical },
            ].map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => setResource(resource === key as typeof resource ? null : key as typeof resource)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  resource === key
                    ? 'bg-[#c57199] text-white border-[#c57199]'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-[#c57199]'
                }`}
              >
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#fced47] rounded-xl p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <TriangleAlert className="w-6 h-6 text-gray-900 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-gray-900 mb-1">Severe Weather Alert</h4>
            <p className="text-sm text-gray-900 leading-relaxed">
              Heavy rainfall expected in Gorkha region over the next 48 hours. Relief routes may be affected.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
