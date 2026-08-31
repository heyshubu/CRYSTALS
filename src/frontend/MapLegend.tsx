"use client";

import { useTheme } from "@/frontend/theme-context";
import { CATEGORY_CONFIG, URGENCY_CONFIG, getCategoryColor, getUrgencyColor } from "@/frontend/map-icons";
import type { NeedCategory } from "@/shared/types";

export function MapLegend() {
  const { theme } = useTheme();

  return (
    <div className="absolute bottom-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-3 text-xs max-w-[220px]">
      <h4 className="font-semibold mb-2 text-gray-800">Legend</h4>

      <div className="mb-2">
        <p className="text-gray-500 mb-1">Categories</p>
        <div className="grid grid-cols-2 gap-1">
          {(Object.keys(CATEGORY_CONFIG) as (NeedCategory | "safe")[]).map((key) => {
            const cfg = CATEGORY_CONFIG[key];
            const color = cfg.colors[theme];
            // Shape indicator: different SVG shapes per category
            const shapes: Record<string, string> = {
              circle: "●", square: "■", diamond: "◆", triangle: "▲", pentagon: "⬠", star: "★",
            };
            return (
              <div key={key} className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 flex-shrink-0 text-center leading-3" style={{ color }}>
                  {shapes[cfg.shape]}
                </span>
                <span>{cfg.emoji} {cfg.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-gray-500 mb-1">Urgency</p>
        <div className="flex flex-col gap-1">
          {(Object.keys(URGENCY_CONFIG) as Array<keyof typeof URGENCY_CONFIG>).map((key) => {
            const cfg = URGENCY_CONFIG[key];
            const color = cfg.colors[theme];
            return (
              <div key={key} className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 flex-shrink-0 text-center leading-3" style={{ color }}>
                  {cfg.icon}
                </span>
                <span>{cfg.label}</span>
              </div>
            );
          })}
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
