"use client";

import { useState } from "react";
import {
  ShieldCheck,
  ShieldOff,
  MapPin,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { UNIQUE_DISTRICTS, DISTRICT_COORDS } from "@/frontend/nepal-districts";
import { useTheme } from "@/frontend/theme-context";
import { getStatusColor } from "@/frontend/map-icons";

type Status = "safe" | "need_help";

export default function SafePage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<Status>("safe");
  const [locationMode, setLocationMode] = useState<"gps" | "district">("gps");
  const [district, setDistrict] = useState("");
  const [gpsCoords, setGpsCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const { theme } = useTheme();

  const requestGPS = () => {
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
  };

  // Auto-request GPS on first render if mode is gps
  // (triggered when user switches to GPS mode)
  const handleLocationModeChange = (mode: "gps" | "district") => {
    setLocationMode(mode);
    if (mode === "gps") {
      requestGPS();
    }
  };

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

    setSubmitting(true);
    try {
      const res = await fetch("/api/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          phone: phone.trim() || undefined,
          status,
          lat,
          lng,
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
        <h1 className="text-2xl font-bold mb-2">
          {status === "safe" ? "You're marked as safe!" : "Help request noted."}
        </h1>
        <p className="text-gray-500 mb-6">
          Thank you for checking in. Your location has been recorded
          anonymously.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setName("");
            setPhone("");
            setStatus("safe");
            setGpsCoords(null);
            setDistrict("");
          }}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
        >
          Submit another check-in
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-6">I&apos;m Safe</h1>
      <p className="text-gray-500 text-sm mb-6">
        Check in to let others know your status. This is anonymous — no
        account needed.
      </p>

      {/* Status toggle */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setStatus("safe")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold border-2 transition ${
            status === "safe"
              ? "border-2"
              : "border-2 border-gray-200 text-gray-500 hover:border-gray-300"
          }`}
          style={status === "safe" ? { borderColor: getStatusColor("safe", theme), backgroundColor: getStatusColor("safe", theme) + "15", color: getStatusColor("safe", theme) } : undefined}
        >
          <ShieldCheck className="w-5 h-5" />
          ✓ I&apos;m Safe
        </button>
        <button
          onClick={() => setStatus("need_help")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold border-2 transition ${
            status === "need_help"
              ? "border-2"
              : "border-2 border-gray-200 text-gray-500 hover:border-gray-300"
          }`}
          style={status === "need_help" ? { borderColor: getStatusColor("need_help", theme), backgroundColor: getStatusColor("need_help", theme) + "15", color: getStatusColor("need_help", theme) } : undefined}
        >
          <ShieldOff className="w-5 h-5" />
          ! I Need Help
        </button>
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
          Phone (optional)
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
          Location
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
            {status === "safe" ? (
              <ShieldCheck className="w-5 h-5" />
            ) : (
              <ShieldOff className="w-5 h-5" />
            )}
            Check In
          </>
        )}
      </button>
    </div>
  );
}
