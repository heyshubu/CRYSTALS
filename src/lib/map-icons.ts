/**
 * Map marker icons and colors used across the Leaflet map.
 * Uses CSS-based colored markers instead of image files to avoid
 * Next.js static asset headaches.
 */
import type { NeedCategory, NeedUrgency, CheckInStatus } from "./types";

// ── Category → icon config ──────────────────────────────────

export const CATEGORY_CONFIG: Record<
  NeedCategory | "safe",
  { emoji: string; color: string; label: string }
> = {
  food:      { emoji: "🍽️", color: "#f59e0b", label: "Food" },
  water:     { emoji: "💧", color: "#3b82f6", label: "Water" },
  medical:   { emoji: "🏥", color: "#ef4444", label: "Medical" },
  shelter:   { emoji: "🏠", color: "#8b5cf6", label: "Shelter" },
  transport: { emoji: "🚗", color: "#6b7280", label: "Transport" },
  safe:      { emoji: "✅", color: "#22c55e", label: "Safe" },
};

// ── Urgency → border/glow color ─────────────────────────────

export const URGENCY_CONFIG: Record<NeedUrgency, { color: string; label: string }> = {
  low:    { color: "#eab308", label: "Low" },
  medium: { color: "#f97316", label: "Medium" },
  high:   { color: "#ef4444", label: "High" },
};

// ── Status → config ─────────────────────────────────────────

export const STATUS_LABELS: Record<string, string> = {
  safe: "Safe",
  need_help: "Needs Help",
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
};

// ── Leaflet icon factory ────────────────────────────────────
// Creates a colored circle marker SVG as a data URL.
// This avoids needing image files in public/.

export function createMarkerIcon(
  color: string,
  size: number = 28
): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg.replace(/\n/g, "").trim())}`;
}

// ── Filter presets ──────────────────────────────────────────

export const ALL_CATEGORIES: (NeedCategory | "safe")[] = [
  "food",
  "water",
  "medical",
  "shelter",
  "transport",
  "safe",
];

export const ALL_STATUSES: string[] = [
  "open",
  "in_progress",
  "resolved",
  "safe",
  "need_help",
];
