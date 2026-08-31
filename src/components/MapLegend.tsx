"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/lib/theme-context";
import { CATEGORY_CONFIG, URGENCY_CONFIG } from "@/lib/map-icons";
import type { NeedCategory } from "@/lib/types";
import { Info } from "lucide-react";

export function MapLegend() {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Collapse when clicking elsewhere on the map
  useEffect(() => {
    if (!expanded) return;
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [expanded]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => { if (hoverTimer.current) clearTimeout(hoverTimer.current); };
  }, []);

  const handleMouseEnter = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setExpanded(true);
  };

  const handleMouseLeave = () => {
    // Small delay so moving cursor to the expanded panel doesn't collapse it
    hoverTimer.current = setTimeout(() => setExpanded(false), 300);
  };

  const handleTap = () => {
    setExpanded((prev) => !prev);
  };

  const shapes: Record<string, string> = {
    circle: "●", square: "■", diamond: "◆", triangle: "▲", pentagon: "⬠", star: "★",
  };

  return (
    <div
      ref={containerRef}
      className="absolute bottom-4 left-4 z-[1000]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Compact state — small icon strip */}
      {!expanded && (
        <button
          onClick={handleTap}
          className="bg-white rounded-lg shadow-lg p-2 flex items-center gap-1.5 hover:shadow-xl transition-shadow"
          title="Show legend"
        >
          <Info className="w-4 h-4 text-gray-400" />
          <span className="flex items-center gap-0.5">
            {(Object.keys(CATEGORY_CONFIG) as (NeedCategory | "safe")[]).map((key) => (
              <span key={key} className="text-[10px] leading-none">{CATEGORY_CONFIG[key].emoji}</span>
            ))}
          </span>
        </button>
      )}

      {/* Expanded state — full legend */}
      {expanded && (
        <div
          onClick={handleTap}
          className="bg-white rounded-lg shadow-lg p-3 text-xs max-w-[220px] cursor-pointer
                     animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-800">Legend</h4>
            <Info className="w-3.5 h-3.5 text-gray-400" />
          </div>

          <div className="mb-2">
            <p className="text-gray-500 mb-1">Categories</p>
            <div className="grid grid-cols-2 gap-1">
              {(Object.keys(CATEGORY_CONFIG) as (NeedCategory | "safe")[]).map((key) => {
                const cfg = CATEGORY_CONFIG[key];
                const color = cfg.colors[theme];
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

          <div className="mb-2">
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

          <p className="text-gray-400 text-[10px] border-t pt-2">
            🏠 Shelter locations are exact
            <br />
            All others use approximate locations
          </p>
        </div>
      )}
    </div>
  );
}
