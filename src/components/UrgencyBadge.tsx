"use client";

import { useTheme } from "@/lib/theme-context";
import { CATEGORY_CONFIG, URGENCY_CONFIG, getUrgencyColor } from "@/lib/map-icons";
import type { NeedUrgency, NeedCategory } from "@/lib/types";

/**
 * Urgency badge that always shows both color AND an icon/text label.
 * The icon (▽ / ◆ / ▲) provides non-color differentiation.
 */
export function UrgencyBadge({ urgency }: { urgency: string }) {
  const { theme } = useTheme();
  const u = urgency as NeedUrgency;
  const cfg = URGENCY_CONFIG[u];
  if (!cfg) return <span className="text-xs text-gray-500">{urgency}</span>;

  const color = cfg.colors[theme];

  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1"
      style={{ backgroundColor: color + "20", color }}
    >
      {cfg.icon} {cfg.label}
    </span>
  );
}

/**
 * Category badge with emoji + label for non-color identification.
 */
export function CategoryBadge({ category }: { category: string }) {
  const { theme } = useTheme();
  const cfg = CATEGORY_CONFIG[category as NeedCategory | "safe"];
  if (!cfg) return <span className="text-xs text-gray-500">{category}</span>;

  const color = cfg.colors[theme];

  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1"
      style={{ backgroundColor: color + "20", color }}
    >
      {cfg.emoji} {cfg.label}
    </span>
  );
}

/**
 * Availability indicator with icon + text (non-color redundant).
 */
export function AvailabilityIndicator({ availability }: { availability: string }) {
  const icons: Record<string, string> = { available: "✓", busy: "⏸", offline: "⊘" };
  return (
    <span className="inline-flex items-center gap-1 capitalize">
      {icons[availability] || "•"} {availability}
    </span>
  );
}

/**
 * Occupancy bar with percentage text — color + number for non-color redundancy.
 */
export function OccupancyBar({ current, capacity }: { current: number; capacity: number }) {
  const { theme } = useTheme();
  const pct = capacity > 0 ? Math.round((current / capacity) * 100) : 0;

  // Theme-aware bar colors
  const barColors: Record<string, string> = {
    normal: pct >= 90 ? "#ef4444" : pct >= 70 ? "#f97316" : "#22c55e",
    deuteranomaly: pct >= 90 ? "#cc3311" : pct >= 70 ? "#ee7733" : "#009988",
    protanomaly: pct >= 90 ? "#994400" : pct >= 70 ? "#dd6633" : "#009988",
    deuteranopia: pct >= 90 ? "#cc3311" : pct >= 70 ? "#ee8833" : "#00aacc",
    protanopia: pct >= 90 ? "#333333" : pct >= 70 ? "#ddaa33" : "#00aacc",
  };

  return (
    <div>
      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: barColors[theme] }}
        />
      </div>
      <div className="flex justify-between mt-1 text-xs text-gray-400">
        <span>{pct}% full</span>
        <span>{capacity - current > 0 ? `${capacity - current} spots left` : "Full"}</span>
      </div>
    </div>
  );
}
