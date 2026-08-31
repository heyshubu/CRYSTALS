"use client";

import { useState } from "react";
import { Utensils, Droplet, Home, BriefcaseMedical, TriangleAlert, Check } from "lucide-react";

export function Sidebar() {
  const [urgency, setUrgency] = useState<"high" | "medium" | "low">("high");
  const [resource, setResource] = useState<"food" | "water" | "shelter" | "medical" | null>(null);

  return (
    <aside className="w-80 flex flex-col gap-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Filters</h2>

        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Urgency Level</h3>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 cursor-pointer group" onClick={() => setUrgency('high')}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${urgency === 'high' ? 'bg-yellow-400' : 'bg-gray-100 border border-gray-300 group-hover:border-yellow-400'}`}>
                {urgency === 'high' && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <span className="text-sm font-medium text-gray-800">High Priority</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group" onClick={() => setUrgency('medium')}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${urgency === 'medium' ? 'bg-[#0072B2]' : 'bg-gray-100 border border-gray-300 group-hover:border-[#0072B2]'}`}>
                {urgency === 'medium' && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <span className="text-sm font-medium text-gray-800">Medium Priority</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group" onClick={() => setUrgency('low')}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${urgency === 'low' ? 'bg-gray-500' : 'bg-white border border-gray-300 group-hover:border-gray-500'}`}>
                {urgency === 'low' && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <span className="text-sm font-medium text-gray-800">Low Priority</span>
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Resource Type</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setResource(resource === 'food' ? null : 'food')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                resource === 'food' 
                  ? 'bg-[#c57199] text-white border-[#c57199]' 
                  : 'bg-white text-gray-700 border-gray-300 hover:border-[#c57199]'
              }`}
            >
              <Utensils className="w-4 h-4" /> Food
            </button>
            <button
              onClick={() => setResource(resource === 'water' ? null : 'water')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                resource === 'water' 
                  ? 'bg-[#c57199] text-white border-[#c57199]' 
                  : 'bg-white text-gray-700 border-gray-300 hover:border-[#c57199]'
              }`}
            >
              <Droplet className="w-4 h-4" /> Water
            </button>
            <button
              onClick={() => setResource(resource === 'shelter' ? null : 'shelter')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                resource === 'shelter' 
                  ? 'bg-[#c57199] text-white border-[#c57199]' 
                  : 'bg-white text-gray-700 border-gray-300 hover:border-[#c57199]'
              }`}
            >
              <Home className="w-4 h-4" /> Shelter
            </button>
            <button
              onClick={() => setResource(resource === 'medical' ? null : 'medical')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                resource === 'medical' 
                  ? 'bg-[#c57199] text-white border-[#c57199]' 
                  : 'bg-white text-gray-700 border-gray-300 hover:border-[#c57199]'
              }`}
            >
              <BriefcaseMedical className="w-4 h-4" /> Medical
            </button>
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
