"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  MapPin,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { UNIQUE_DISTRICTS, DISTRICT_COORDS } from "@/lib/nepal-districts";
import { useTheme } from "@/lib/theme-context";
import { URGENCY_CONFIG, getUrgencyColor } from "@/lib/map-icons";
import type { NeedCategory, NeedUrgency } from "@/lib/types";

const CATEGORIES: { value: NeedCategory; label: string }[] = [
  { value: "food", label: "🍽️ Food" },
  { value: "water", label: "💧 Water" },
  { value: "medical", label: "🏥 Medical" },
  { value: "shelter", label: "🏠 Shelter" },
  { value: "transport", label: "🚗 Transport" },
];



export default function ReportPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState<NeedCategory>("food");
  const [urgency, setUrgency] = useState<NeedUrgency>("medium");
  const [description, setDescription] = useState("");
  const [locationMode, setLocationMode] = useState<"gps" | "district">("gps");
  const [district, setDistrict] = useState("");
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const { theme } = useTheme();

  // AI suggestion state
  const [aiSuggestion, setAiSuggestion] = useState<{
    category: NeedCategory;
    urgency: NeedUrgency;
  } | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [userChangedFields, setUserChangedFields] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const requestGPS = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsError("GPS is not supported on this device.");
      return;
    }
    setGpsLoading(true);
    setGpsError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGpsLoading(false);
      },
      () => {
        setGpsError("Location access denied. Please use district selection.");
        setGpsLoading(false);
        setLocationMode("district");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  const handleLocationModeChange = (mode: "gps" | "district") => {
    setLocationMode(mode);
    if (mode === "gps") requestGPS();
  };

  // Debounced AI suggestion
  useEffect(() => {
    if (description.trim().length < 10) {
      setAiSuggestion(null);
      return;
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      setAiLoading(true);
      try {
        const res = await fetch("/api/suggest-category", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description: description.trim() }),
        });
        if (!res.ok) return; // fail silently
        const data = await res.json();
        if (data.suggestion && !userChangedFields) {
          setAiSuggestion(data.suggestion);
          setCategory(data.suggestion.category);
          setUrgency(data.suggestion.urgency);
        }
      } catch {
        // FAIL SILENTLY — no error shown to user
      } finally {
        setAiLoading(false);
      }
    }, 1500); // 1.5 second debounce

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [description, userChangedFields]);

  const handleSubmit = async () => {
    setError("");

    let lat: number, lng: number;
    if (locationMode === "gps" && gpsCoords) {
      lat = gpsCoords.lat;
      lng = gpsCoords.lng;
    } else if (locationMode === "district" && district) {
      const coords = DISTRICT_COORDS[district];
      if (!coords) {
        setError("District not found. Please try again.");
        return;
      }
      lat = coords.lat;
      lng = coords.lng;
    } else {
      setError("Please select a location.");
      return;
    }

    if (!description.trim()) {
      setError("Please describe the need.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/needs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          phone: phone.trim() || undefined,
          category,
          urgency,
          description: description.trim(),
          lat,
          lng,
          ai_suggested_category: aiSuggestion?.category,
          ai_suggested_urgency: aiSuggestion?.urgency,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Submission failed.");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-4 max-w-lg mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Need reported!</h1>
        <p className="text-gray-500 mb-6">
          Your report has been submitted anonymously. A responder will be
          notified.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setName("");
            setPhone("");
            setCategory("food");
            setUrgency("medium");
            setDescription("");
            setGpsCoords(null);
            setDistrict("");
            setAiSuggestion(null);
            setUserChangedFields(false);
          }}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
        >
          Report another need
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-1">Report a Need</h1>
      <p className="text-gray-500 text-sm mb-6">
        Describe what is needed — our AI will suggest a category and urgency to
        help responders prioritize.
      </p>

      {/* Description (AI triggers from this) */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <AlertTriangle className="inline w-4 h-4 mr-1" />
          Describe the need *
        </label>
        <textarea
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setUserChangedFields(false);
          }}
          placeholder="e.g. Family of 5 needs medical supplies for a wound that won't stop bleeding"
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        {aiLoading && (
          <p className="text-xs text-blue-500 mt-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 animate-pulse" />
            AI is analyzing your description...
          </p>
        )}
        {aiSuggestion && !aiLoading && (
          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            AI suggested: {aiSuggestion.category} / {aiSuggestion.urgency}
            — you can change below
          </p>
        )}
      </div>

      {/* Category */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category *
        </label>
        <div className="grid grid-cols-5 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                setCategory(cat.value);
                setUserChangedFields(true);
              }}
              className={`py-2 rounded-lg text-xs font-medium border-2 transition ${
                category === cat.value
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Medical → First Aid link */}
        {category === "medical" && (
          <Link
            href="/first-aid#bleeding"
            className="mt-2 inline-flex items-center gap-1 text-sm text-red-600 hover:underline"
          >
            <Stethoscope className="w-4 h-4" />
            View First-Aid Reference for medical guidance
          </Link>
        )}
      </div>

      {/* Urgency */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Urgency *
        </label>
        <div className="flex gap-3">
          {(["low", "medium", "high"] as NeedUrgency[]).map((u) => {
            const cfg = URGENCY_CONFIG[u];
            const color = cfg.colors[theme];
            return (
              <button
                key={u}
                onClick={() => {
                  setUrgency(u);
                  setUserChangedFields(true);
                }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold border-2 transition flex items-center justify-center gap-1 ${
                  urgency === u
                    ? ""
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
                style={urgency === u ? { borderColor: color, backgroundColor: color + "15", color } : undefined}
              >
                {cfg.icon} {cfg.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Name (optional) */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name (optional)
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Leave blank to stay anonymous"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Phone (optional) */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Contact phone (optional)
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="e.g. 9841000000"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Location */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MapPin className="inline w-4 h-4 mr-1" />
          Location *
        </label>

        <div className="flex gap-3 mb-3">
          <button
            onClick={() => handleLocationModeChange("gps")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium border transition ${
              locationMode === "gps"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            {gpsLoading ? (
              <Loader2 className="inline w-4 h-4 animate-spin mr-1" />
            ) : (
              "📡"
            )}{" "}
            Use GPS
          </button>
          <button
            onClick={() => setLocationMode("district")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium border transition ${
              locationMode === "district"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            🗺️ Select District
          </button>
        </div>

        {locationMode === "gps" && (
          <div>
            {gpsCoords ? (
              <p className="text-sm text-green-600">
                ✅ GPS location acquired (
                {gpsCoords.lat.toFixed(4)}, {gpsCoords.lng.toFixed(4)})
              </p>
            ) : gpsError ? (
              <p className="text-sm text-red-500">{gpsError}</p>
            ) : (
              <p className="text-sm text-gray-500">
                {gpsLoading ? "Acquiring location..." : "Tap GPS to get your location"}
              </p>
            )}
          </div>
        )}

        {locationMode === "district" && (
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a district</option>
            {UNIQUE_DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <AlertTriangle className="w-5 h-5" />
            Report Need
          </>
        )}
      </button>
    </div>
  );
}
