/**
 * Map marker icons, colors, and shapes used across the Leaflet map.
 * Theme-aware: provides default, colorblind-safe, and high-contrast palettes.
 * Every color-coded element also has a shape/icon/text label for accessibility.
 */
import type { NeedCategory, NeedUrgency, CheckInStatus } from "@/shared/types";
import type { ThemeName } from "./theme-context";

// ── Category → config per theme ──────────────────────────────
// Each category gets: emoji, color (per theme), shape, label
// Shapes ensure pins are distinguishable without relying on color.

interface CategoryConfig {
  emoji: string;
  label: string;
  shape: "circle" | "square" | "diamond" | "triangle" | "pentagon" | "star";
  colors: Record<ThemeName, string>;
}

export const CATEGORY_CONFIG: Record<NeedCategory | "safe", CategoryConfig> = {
  food:      { emoji: "🍽️", label: "Food",      shape: "circle",   colors: { default: "#f59e0b", colorblind: "#d97706", "high-contrast": "#cc7a00" } },
  water:     { emoji: "💧", label: "Water",     shape: "diamond",  colors: { default: "#3b82f6", colorblind: "#0077bb", "high-contrast": "#0066cc" } },
  medical:   { emoji: "🏥", label: "Medical",   shape: "triangle", colors: { default: "#ef4444", colorblind: "#cc3311", "high-contrast": "#dd0000" } },
  shelter:   { emoji: "🏠", label: "Shelter",   shape: "square",   colors: { default: "#8b5cf6", colorblind: "#aa3377", "high-contrast": "#9900cc" } },
  transport: { emoji: "🚗", label: "Transport", shape: "pentagon", colors: { default: "#6b7280", colorblind: "#555555", "high-contrast": "#333333" } },
  safe:      { emoji: "✅", label: "Safe",      shape: "star",     colors: { default: "#22c55e", colorblind: "#009988", "high-contrast": "#008844" } },
};

// ── Urgency → config per theme ───────────────────────────────
// Each urgency gets: color (per theme), icon (non-color indicator), label

interface UrgencyConfig {
  label: string;
  icon: string;  // text symbol for non-color indication
  colors: Record<ThemeName, string>;
  borderStyles: Record<ThemeName, string>;  // CSS border style for map pins
}

export const URGENCY_CONFIG: Record<NeedUrgency, UrgencyConfig> = {
  low: {
    label: "Low",
    icon: "▽",
    colors: { default: "#eab308", colorblind: "#ddaa33", "high-contrast": "#ccaa00" },
    borderStyles: { default: "solid", colorblind: "dashed", "high-contrast": "solid" },
  },
  medium: {
    label: "Medium",
    icon: "◆",
    colors: { default: "#f97316", colorblind: "#ee7733", "high-contrast": "#ee6600" },
    borderStyles: { default: "solid", colorblind: "solid", "high-contrast": "solid" },
  },
  high: {
    label: "High",
    icon: "▲",
    colors: { default: "#ef4444", colorblind: "#cc3311", "high-contrast": "#ff0000" },
    borderStyles: { default: "solid", colorblind: "dotted", "high-contrast": "solid" },
  },
};

// ── Status → config ─────────────────────────────────────────

export const STATUS_LABELS: Record<string, string> = {
  safe: "Safe",
  need_help: "Needs Help",
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
};

// Status badge colors per theme (with non-color text labels always shown)
export const STATUS_COLORS: Record<string, Record<ThemeName, string>> = {
  open:        { default: "#ef4444", colorblind: "#cc3311", "high-contrast": "#ff0000" },
  in_progress: { default: "#f97316", colorblind: "#ee7733", "high-contrast": "#ee6600" },
  resolved:    { default: "#22c55e", colorblind: "#009988", "high-contrast": "#008844" },
  safe:        { default: "#22c55e", colorblind: "#009988", "high-contrast": "#008844" },
  need_help:   { default: "#ef4444", colorblind: "#cc3311", "high-contrast": "#ff0000" },
};

// ── Leaflet shape markers ────────────────────────────────────
// Different SVG shapes per category so pins are distinguishable without color.

function shapeSvg(shape: CategoryConfig["shape"], color: string, size: number = 28): string {
  const s = size;
  const h = s / 2;
  let path = "";

  switch (shape) {
    case "circle":
      path = `<circle cx="${h}" cy="${h}" r="${h - 2}" fill="${color}" stroke="white" stroke-width="2"/>`;
      break;
    case "square":
      path = `<rect x="2" y="2" width="${s - 4}" height="${s - 4}" rx="3" fill="${color}" stroke="white" stroke-width="2"/>`;
      break;
    case "diamond":
      path = `<polygon points="${h},2 ${s - 2},${h} ${h},${s - 2} 2,${h}" fill="${color}" stroke="white" stroke-width="2"/>`;
      break;
    case "triangle":
      path = `<polygon points="${h},2 ${s - 2},${s - 2} 2,${s - 2}" fill="${color}" stroke="white" stroke-width="2"/>`;
      break;
    case "pentagon":
      const pts = Array.from({ length: 5 }, (_, i) => {
        const angle = (i * 72 - 90) * (Math.PI / 180);
        return `${h + (h - 2) * Math.cos(angle)},${h + (h - 2) * Math.sin(angle)}`;
      }).join(" ");
      path = `<polygon points="${pts}" fill="${color}" stroke="white" stroke-width="2"/>`;
      break;
    case "star":
      const starPts = Array.from({ length: 10 }, (_, i) => {
        const angle = (i * 36 - 90) * (Math.PI / 180);
        const r = i % 2 === 0 ? h - 2 : (h - 2) * 0.5;
        return `${h + r * Math.cos(angle)},${h + r * Math.sin(angle)}`;
      }).join(" ");
      path = `<polygon points="${starPts}" fill="${color}" stroke="white" stroke-width="2"/>`;
      break;
  }

  return `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">${path}</svg>`)}`;
}

export function createMarkerIcon(
  color: string,
  size: number = 28,
  shape: CategoryConfig["shape"] = "circle"
): string {
  return shapeSvg(shape, color, size);
}

// ── Helper: get current color for a category/urgency ─────────

export function getCategoryColor(cat: NeedCategory | "safe", theme: ThemeName): string {
  return CATEGORY_CONFIG[cat].colors[theme];
}

export function getUrgencyColor(urgency: NeedUrgency, theme: ThemeName): string {
  return URGENCY_CONFIG[urgency].colors[theme];
}

export function getStatusColor(status: string, theme: ThemeName): string {
  return STATUS_COLORS[status]?.[theme] ?? "#6b7280";
}

// ── Filter presets ──────────────────────────────────────────

export const ALL_CATEGORIES: (NeedCategory | "safe")[] = [
  "food", "water", "medical", "shelter", "transport", "safe",
];

export const ALL_STATUSES: string[] = [
  "open", "in_progress", "resolved", "safe", "need_help",
];
