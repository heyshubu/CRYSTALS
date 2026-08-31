"use client";

import { useTheme } from "@/lib/theme-context";
import { CATEGORY_CONFIG, URGENCY_CONFIG, STATUS_LABELS, getCategoryColor, getUrgencyColor } from "@/lib/map-icons";
import type { NeedCategory, NeedUrgency } from "@/lib/types";
import { MapPin, Clock, User, Phone, X } from "lucide-react";

export type PinDetailMode = "public" | "responder";

interface ActionButton {
  label: string;
  onClick: () => void;
  variant?: "primary" | "success" | "danger";
  disabled?: boolean;
}

interface PinDetailPopupProps {
  mode: PinDetailMode;
  type: "check_in" | "need" | "shelter";
  name?: string | null;
  phone?: string | null;
  category?: NeedCategory;
  urgency?: NeedUrgency;
  status?: string;
  description?: string;
  approxLat?: number;
  approxLng?: number;
  exactLat?: number;
  exactLng?: number;
  createdAt?: string;
  onClose: () => void;
  actions?: ActionButton[];
}

export function PinDetailPopup({
  mode, type, name, phone, category, urgency, status, description,
  approxLat, approxLng, exactLat, exactLng, createdAt, onClose, actions,
}: PinDetailPopupProps) {
  const { theme } = useTheme();
  const catConfig = category ? CATEGORY_CONFIG[category] : null;
  const urgConfig = urgency ? URGENCY_CONFIG[urgency] : null;
  const displayLat = mode === "responder" && exactLat ? exactLat : approxLat;
  const displayLng = mode === "responder" && exactLng ? exactLng : approxLng;

  return (
    <div className="fixed inset-0 z-[2000] bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            {catConfig && (
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                style={{ backgroundColor: catConfig.colors[theme] + "20" }}
              >
                {catConfig.emoji}
              </span>
            )}
            <div>
              <h3 className="font-bold text-lg capitalize">
                {type === "shelter" ? "Shelter" : category ? CATEGORY_CONFIG[category].label : status === "safe" ? "Safety Check-in" : "Check-in"}
              </h3>
              {urgConfig && (
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full inline-flex items-center gap-1"
                  style={{
                    backgroundColor: urgConfig.colors[theme] + "20",
                    color: urgConfig.colors[theme],
                  }}
                >
                  {urgConfig.icon} {urgConfig.label} urgency
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          {description && <p className="text-gray-700 text-sm">{description}</p>}

          {/* Status — text label always visible, color is supplementary */}
          {status && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Status:</span>
              <span className="font-medium">{STATUS_LABELS[status] || status}</span>
            </div>
          )}

          {mode === "responder" && name && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="w-4 h-4" />{name}
            </div>
          )}
          {mode === "responder" && phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-4 h-4" />{phone}
            </div>
          )}

          <div className="flex items-start gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <p>{mode === "responder" ? "Exact" : "Approximate"} location:</p>
              <p className="font-mono text-xs">{displayLat?.toFixed(5)}, {displayLng?.toFixed(5)}</p>
              {mode === "public" && type !== "shelter" && (
                <p className="text-xs text-gray-400 mt-0.5">±300m from actual location (privacy protection)</p>
              )}
            </div>
          </div>

          {createdAt && (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              {new Date(createdAt).toLocaleString()}
            </div>
          )}

          {/* Action buttons — responder mode only */}
          {mode === "responder" && actions && actions.length > 0 && (
            <div className="flex flex-col gap-2 pt-2 border-t">
              {actions.map((action, i) => (
                <button
                  key={i}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className={`w-full py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 ${
                    action.variant === "success"
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : action.variant === "danger"
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}

          <div className="text-xs text-gray-400 border-t pt-2">
            {mode === "public" ? "🔒 Public view — contact details hidden" : "🔓 Responder view — full details visible"}
          </div>
        </div>
      </div>
    </div>
  );
}
