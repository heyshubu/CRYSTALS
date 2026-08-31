"use client";

import { CATEGORY_CONFIG } from "@/lib/map-icons";
import type { NeedCategory } from "@/lib/types";

interface FilterChipsProps {
  selectedCategories: Set<string>;
  onToggleCategory: (cat: string) => void;
  selectedStatuses: Set<string>;
  onToggleStatus: (status: string) => void;
}

const STATUS_OPTIONS = [
  { value: "open", label: "Open", color: "#ef4444" },
  { value: "in_progress", label: "In Progress", color: "#f97316" },
  { value: "resolved", label: "Resolved", color: "#22c55e" },
  { value: "safe", label: "Safe", color: "#22c55e" },
  { value: "need_help", label: "Needs Help", color: "#ef4444" },
];

export function FilterChips({
  selectedCategories,
  onToggleCategory,
  selectedStatuses,
  onToggleStatus,
}: FilterChipsProps) {
  return (
    <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-col gap-2">
      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => onToggleCategory(key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
              selectedCategories.has(key)
                ? "text-white border-transparent"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            }`}
            style={
              selectedCategories.has(key)
                ? { backgroundColor: cfg.color, borderColor: cfg.color }
                : undefined
            }
          >
            {cfg.emoji} {cfg.label}
          </button>
        ))}
      </div>

      {/* Status chips */}
      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s.value}
            onClick={() => onToggleStatus(s.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
              selectedStatuses.has(s.value)
                ? "text-white border-transparent"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            }`}
            style={
              selectedStatuses.has(s.value)
                ? { backgroundColor: s.color, borderColor: s.color }
                : undefined
            }
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
