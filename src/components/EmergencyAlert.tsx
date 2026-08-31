"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, X, ChevronDown, ChevronUp, Bell } from "lucide-react";

interface Alert {
  id: string;
  type: "flood" | "earthquake" | "storm" | "general";
  title: string;
  message: string;
  severity: "high" | "medium" | "low";
  created_at: string;
}

// Predefined alerts — can be updated by superadmin or from DB in future
const DEFAULT_ALERTS: Alert[] = [
  {
    id: "1",
    type: "flood",
    title: "⚠️ Flood Warning — Gorkha Region",
    message: "Heavy rainfall expected in Gorkha and surrounding districts over the next 48 hours. Relief routes through Trishuli may be affected. Stay alert and move to higher ground if near river banks.",
    severity: "high",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    type: "earthquake",
    title: "🔵 Aftershock Advisory — Sindhupalchok",
    message: "Minor aftershocks (3.2-4.1 magnitude) recorded in the past 24 hours. Check structural integrity of buildings before re-entering. Report any damage through the Report Need page.",
    severity: "medium",
    created_at: new Date().toISOString(),
  },
];

const SEVERITY_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  high: { bg: "#fef2f2", border: "#fecaca", text: "#991b1b" },
  medium: { bg: "#fffbeb", border: "#fde68a", text: "#92400e" },
  low: { bg: "#eff6ff", border: "#bfdbfe", text: "#1e40af" },
};

const TYPE_ICONS: Record<string, string> = {
  flood: "🌊",
  earthquake: "🌍",
  storm: "⛈️",
  general: "📢",
};

export function EmergencyAlert() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    // Load dismissed alerts from localStorage
    try {
      const stored = localStorage.getItem("dismissed-alerts");
      if (stored) setDismissed(new Set(JSON.parse(stored)));
    } catch { /* ignore */ }

    setAlerts(DEFAULT_ALERTS);
  }, []);

  const activeAlerts = alerts.filter((a) => !dismissed.has(a.id));

  if (activeAlerts.length === 0) return null;

  const dismiss = (id: string) => {
    const newDismissed = new Set(dismissed);
    newDismissed.add(id);
    setDismissed(newDismissed);
    try { localStorage.setItem("dismissed-alerts", JSON.stringify([...newDismissed])); } catch { /* ignore */ }
  };

  const highestSeverity = activeAlerts.some((a) => a.severity === "high") ? "high"
    : activeAlerts.some((a) => a.severity === "medium") ? "medium" : "low";

  const colors = SEVERITY_COLORS[highestSeverity];

  return (
    <div
      className="w-full border-b"
      style={{ backgroundColor: colors.bg, borderColor: colors.border }}
    >
      {/* Collapsed bar */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm">{TYPE_ICONS[activeAlerts[0]?.type] || "📢"}</span>
          <Bell className="w-3.5 h-3.5 animate-pulse" style={{ color: colors.text }} />
          <span className="text-xs font-semibold" style={{ color: colors.text }}>
            {activeAlerts.length} Active Alert{activeAlerts.length !== 1 ? "s" : ""}
          </span>
          {highestSeverity === "high" && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold" style={{ backgroundColor: "#dc2626", color: "white" }}>
              URGENT
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {expanded ? (
            <ChevronUp className="w-4 h-4" style={{ color: colors.text }} />
          ) : (
            <ChevronDown className="w-4 h-4" style={{ color: colors.text }} />
          )}
        </div>
      </button>

      {/* Expanded alerts */}
      {expanded && (
        <div className="px-4 pb-3 space-y-2">
          {activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start gap-3 p-3 rounded-lg border"
              style={{ backgroundColor: "white", borderColor: colors.border }}
            >
              <span className="text-base mt-0.5">{TYPE_ICONS[alert.type]}</span>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold" style={{ color: colors.text }}>{alert.title}</h4>
                <p className="text-[11px] mt-1 leading-relaxed" style={{ color: "#4b5563" }}>{alert.message}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); dismiss(alert.id); }}
                className="flex-shrink-0 p-1 rounded hover:bg-gray-100 transition"
              >
                <X className="w-3 h-3 text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
