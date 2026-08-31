"use client";

import { CATEGORY_CONFIG, URGENCY_CONFIG } from "@/lib/map-icons";

export function MapLegend() {
  return (
    <div className="absolute bottom-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-3 text-xs max-w-[200px]">
      <h4 className="font-semibold mb-2 text-gray-800">Legend</h4>

      <div className="mb-2">
        <p className="text-gray-500 mb-1">Categories</p>
        <div className="grid grid-cols-2 gap-1">
          {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span
                className="inline-block w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: cfg.color }}
              />
              <span>{cfg.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-gray-500 mb-1">Urgency</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(URGENCY_CONFIG).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-1">
              <span
                className="inline-block w-3 h-3 rounded-full flex-shrink-0 border-2"
                style={{ borderColor: cfg.color }}
              />
              <span>{cfg.label}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-gray-400 mt-2 text-[10px]">
        🏠 Shelter locations are exact
        <br />
        All others use approximate locations
      </p>
    </div>
  );
}
