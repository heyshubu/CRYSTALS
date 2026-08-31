/**
 * Map marker icons, colors, and shapes used across the Leaflet map.
 * Theme-aware: 5 color vision palettes (normal + 4 colorblind types).
 * Every color-coded element also has a shape/icon/text label for accessibility.
 */
import type { NeedCategory, NeedUrgency, CheckInStatus } from "@/lib/types";
import type { ThemeName } from "./theme-context";

// ── Category → config per theme ──────────────────────────────
interface CategoryConfig {
  emoji: string;
  label: string;
  shape: "circle" | "square" | "diamond" | "triangle" | "pentagon" | "star";
  colors: Record<ThemeName, string>;
}

export const CATEGORY_CONFIG: Record<NeedCategory | "safe", CategoryConfig> = {
  food: {
    emoji: "🍽️",
    label: "Food",
    shape: "circle",
    colors: {
      normal: "#f59e0b",
      deuteranomaly: "#cc8800",   // amber/orange — distinct from greens
      protanomaly: "#cc8800",     // amber/orange — distinct from greens
      deuteranopia: "#ee8800",    // strong orange
      protanopia: "#ddaa00",      // bright yellow-orange
    },
  },
  water: {
    emoji: "💧",
    label: "Water",
    shape: "diamond",
    colors: {
      normal: "#3b82f6",
      deuteranomaly: "#0077bb",   // strong blue
      protanomaly: "#0077bb",     // strong blue
      deuteranopia: "#0066cc",    // deep blue
      protanopia: "#0088ee",      // bright cyan-blue
    },
  },
  medical: {
    emoji: "🏥",
    label: "Medical",
    shape: "triangle",
    colors: {
      normal: "#ef4444",
      deuteranomaly: "#cc3311",   // darker red — avoid confusion with greens
      protanomaly: "#994400",     // brown — reds look greenish, use brown
      deuteranopia: "#994400",    // dark brown
      protanopia: "#333333",      // near-black — reds look black, use very dark
    },
  },
  shelter: {
    emoji: "🏠",
    label: "Shelter",
    shape: "square",
    colors: {
      normal: "#8b5cf6",
      deuteranomaly: "#aa3377",   // magenta/pink — clearly distinct
      protanomaly: "#aa3377",     // magenta/pink
      deuteranopia: "#aa3377",    // magenta
      protanopia: "#aa3377",      // magenta
    },
  },
  transport: {
    emoji: "🚗",
    label: "Transport",
    shape: "pentagon",
    colors: {
      normal: "#6b7280",
      deuteranomaly: "#555555",   // dark gray
      protanomaly: "#555555",     // dark gray
      deuteranopia: "#444444",    // charcoal
      protanopia: "#555555",      // dark gray
    },
  },
  safe: {
    emoji: "✅",
    label: "Safe",
    shape: "star",
    colors: {
      normal: "#22c55e",
      deuteranomaly: "#009988",   // teal — distinct from reds
      protanomaly: "#009988",     // teal
      deuteranopia: "#00aacc",    // cyan — clearly distinct from oranges
      protanopia: "#00aacc",      // cyan
    },
  },
};

// ── Urgency → config per theme ───────────────────────────────
interface UrgencyConfig {
  label: string;
  icon: string;
  colors: Record<ThemeName, string>;
  borderStyles: Record<ThemeName, string>;
}

export const URGENCY_CONFIG: Record<NeedUrgency, UrgencyConfig> = {
  low: {
    label: "Low",
    icon: "▽",
    colors: {
      normal: "#eab308",
      deuteranomaly: "#ddaa33",
      protanomaly: "#ccaa33",
      deuteranopia: "#cccc00",
      protanopia: "#bbbb00",
    },
    borderStyles: {
      normal: "solid",
      deuteranomaly: "dashed",
      protanomaly: "dashed",
      deuteranopia: "dotted",
      protanopia: "dotted",
    },
  },
  medium: {
    label: "Medium",
    icon: "◆",
    colors: {
      normal: "#f97316",
      deuteranomaly: "#ee7733",
      protanomaly: "#dd6633",
      deuteranopia: "#ee8833",
      protanopia: "#ddaa33",
    },
    borderStyles: {
      normal: "solid",
      deuteranomaly: "solid",
      protanomaly: "solid",
      deuteranopia: "dashed",
      protanopia: "dashed",
    },
  },
  high: {
    label: "High",
    icon: "▲",
    colors: {
      normal: "#ef4444",
      deuteranomaly: "#cc3311",
      protanomaly: "#994400",
      deuteranopia: "#cc3311",
      protanopia: "#333333",
    },
    borderStyles: {
      normal: "solid",
      deuteranomaly: "solid",
      protanomaly: "solid",
      deuteranopia: "solid",
      protanopia: "solid",
    },
  },
};

// ── Status → color per theme ─────────────────────────────────
export function getStatusColor(status: CheckInStatus, theme: ThemeName): string {
  const colors: Record<ThemeName, Record<CheckInStatus, string>> = {
    normal:          { safe: "#22c55e", need_help: "#ef4444" },
    deuteranomaly:   { safe: "#009988", need_help: "#cc3311" },
    protanomaly:     { safe: "#009988", need_help: "#994400" },
    deuteranopia:    { safe: "#00aacc", need_help: "#cc3311" },
    protanopia:      { safe: "#00aacc", need_help: "#333333" },
  };
  return colors[theme]?.[status] ?? colors.normal[status];
}

// ── Helper functions ─────────────────────────────────────────
export function getCategoryColor(category: NeedCategory | "safe", theme: ThemeName): string {
  return CATEGORY_CONFIG[category]?.colors[theme] ?? CATEGORY_CONFIG[category]?.colors.normal ?? "#6b7280";
}

// ── Status labels ───────────────────────────────────────────
export const STATUS_LABELS: Record<string, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  safe: "Safe",
  need_help: "Needs Help",
};

export function getUrgencyColor(urgency: NeedUrgency, theme: ThemeName): string {
  return URGENCY_CONFIG[urgency]?.colors[theme] ?? URGENCY_CONFIG[urgency]?.colors.normal ?? "#6b7280";
}
