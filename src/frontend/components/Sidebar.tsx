"use client";

import { useState } from "react";
import { Utensils, Droplet, Home, BriefcaseMedical, TriangleAlert, Check } from "lucide-react";

export function Sidebar() {
  const [urgencies, setUrgencies] = useState({
    high: true,
    medium: true,
    low: false,
  });

  const [resources, setResources] = useState({
    food: true,
    water: false,
    shelter: true,
    medical: false,
  });

  const toggleUrgency = (key: keyof typeof urgencies) => setUrgencies(p => ({ ...p, [key]: !p[key] }));
  const toggleResource = (key: keyof typeof resources) => setResources(p => ({ ...p, [key]: !p[key] }));

  return (
    <aside className="w-80 flex flex-col gap-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Filters</h2>

        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Urgency Level</h3>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${urgencies.high ? 'bg-yellow-400' : 'bg-gray-100 border border-gray-300 group-hover:border-yellow-400'}`}>
                {urgencies.high && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
              <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
              <span className="text-sm font-medium text-gray-800">High Priority</span>
              <input type="checkbox" className="hidden" checked={urgencies.high} onChange={() => toggleUrgency('high')} />
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${urgencies.medium ? 'bg-[#0072B2]' : 'bg-gray-100 border border-gray-300 group-hover:border-[#0072B2]'}`}>
                {urgencies.medium && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
              <span className="w-3 h-3 rounded-full bg-[#0072B2]"></span>
              <span className="text-sm font-medium text-gray-800">Medium Priority</span>
              <input type="checkbox" className="hidden" checked={urgencies.medium} onChange={() => toggleUrgency('medium')} />
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${urgencies.low ? 'bg-gray-500' : 'bg-white border border-gray-300 group-hover:border-gray-500'}`}>
                {urgencies.low && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
              <span className="w-3 h-3 rounded-full bg-gray-500"></span>
              <span className="text-sm font-medium text-gray-800">Low Priority</span>
              <input type="checkbox" className="hidden" checked={urgencies.low} onChange={() => toggleUrgency('low')} />
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Resource Type</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => toggleResource('food')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                resources.food 
                  ? 'bg-[#c57199] text-white border-[#c57199]' 
                  : 'bg-white text-gray-700 border-gray-300 hover:border-[#c57199]'
              }`}
            >
              <Utensils className="w-4 h-4" /> Food
            </button>
            <button
              onClick={() => toggleResource('water')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                resources.water 
                  ? 'bg-[#c57199] text-white border-[#c57199]' 
                  : 'bg-white text-gray-700 border-gray-300 hover:border-[#c57199]'
              }`}
            >
              <Droplet className="w-4 h-4" /> Water
            </button>
            <button
              onClick={() => toggleResource('shelter')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                resources.shelter 
                  ? 'bg-[#c57199] text-white border-[#c57199]' 
                  : 'bg-white text-gray-700 border-gray-300 hover:border-[#c57199]'
              }`}
            >
              <Home className="w-4 h-4" /> Shelter
            </button>
            <button
              onClick={() => toggleResource('medical')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                resources.medical 
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
