"use client";

import { useTheme } from "@/frontend/theme-context";
import { CATEGORY_CONFIG, URGENCY_CONFIG, getCategoryColor } from "@/frontend/map-icons";
import type { NeedCategory } from "@/shared/types";

interface FilterChipsProps {
  selectedCategories: Set<string>;
  onToggleCategory: (cat: string) => void;
  selectedStatuses: Set<string>;
  onToggleStatus: (status: string) => void;
}

const STATUS_OPTIONS = [
  { value: "open", label: "Open", icon: "○" },
  { value: "in_progress", label: "In Progress", icon: "◑" },
  { value: "resolved", label: "Resolved", icon: "●" },
  { value: "safe", label: "Safe", icon: "✓" },
  { value: "need_help", label: "Needs Help", icon: "!" },
];

export function FilterChips({
  selectedCategories,
  onToggleCategory,
  selectedStatuses,
  onToggleStatus,
}: FilterChipsProps) {
  const { theme } = useTheme();

  return (
    <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-col gap-2">
      {/* Category chips — emoji + label for non-color identification */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(CATEGORY_CONFIG) as (NeedCategory | "safe")[]).map((key) => {
          const cfg = CATEGORY_CONFIG[key];
          const color = cfg.colors[theme];
          return (
            <button
              key={key}
              onClick={() => onToggleCategory(key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 transition ${
                selectedCategories.has(key)
                  ? "text-white border-transparent"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
              style={
                selectedCategories.has(key)
                  ? { backgroundColor: color, borderColor: color }
                  : undefined
              }
            >
              {cfg.emoji} {cfg.label}
            </button>
          );
        })}
      </div>

      {/* Status chips — icon + label for non-color identification */}
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
                ? { backgroundColor: getCategoryColor("safe", theme), borderColor: getCategoryColor("safe", theme) }
                : undefined
            }
          >
            {s.icon} {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
