"use client";

import { useState } from "react";
import { FormLayout } from "@/components/layouts/FormLayout";
import {
  TriangleAlert,
  MapPin,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Send,
} from "lucide-react";

const EMERGENCY_TYPES = [
  "Fire",
  "Flood",
  "Earthquake",
  "Landslide",
  "Building Collapse",
  "Medical Emergency",
  "Gas Leak",
  "Road Accident",
  "Other",
];

export default function ReportEmergencyPage() {
  const [emergencyType, setEmergencyType] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gpsStatus, setGpsStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsError, setGpsError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleGps() {
    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser.");
      setGpsStatus("error");
      return;
    }
    setGpsStatus("loading");
    setGpsError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGpsStatus("success");
        setLocation(`${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`);
      },
      (err) => {
        setGpsStatus("error");
        if (err.code === err.PERMISSION_DENIED) {
          setGpsError("Location permission denied. Please allow access and try again.");
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setGpsError("Location unavailable. Please enter your location manually.");
        } else {
          setGpsError("Could not get your location. Please try again.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!emergencyType) {
      setError("Please select an emergency type.");
      return;
    }
    if (!location.trim()) {
      setError("Please provide a location.");
      return;
    }

    setSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <FormLayout>
        <div className="w-full max-w-xl flex flex-col items-center">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 w-full text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Emergency Report Submitted
            </h1>
            <p className="text-gray-600 mb-6">
              Your report has been routed to coordination centers. Help is on the
              way.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setEmergencyType("");
                setLocation("");
                setDescription("");
                setName("");
                setPhone("");
                setGpsCoords(null);
                setGpsStatus("idle");
              }}
              className="px-6 py-3 bg-[#0072B2] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Report Another Emergency
            </button>
          </div>
        </div>
      </FormLayout>
    );
  }

  return (
    <FormLayout>
      <div className="w-full max-w-2xl flex flex-col items-center">
        {/* Header */}
        <div className="w-full mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Report an Emergency
          </h1>
          <p className="text-gray-600">
            Please provide clear and accurate details. Your report will be routed
            directly to coordination centers.
          </p>
        </div>

        {/* Safety Instructions */}
        <div className="w-full bg-[#fced47] rounded-xl p-5 mb-6">
          <div className="flex items-start gap-3">
            <TriangleAlert className="w-6 h-6 text-gray-900 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-gray-900 mb-1">
                Safety Instructions
              </h3>
              <p className="text-sm text-gray-900 leading-relaxed">
                Ensure you are in a safe location before submitting this report.
                If you are in immediate, life-threatening danger, attempt to call
                local emergency services directly if possible.
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full"
        >
          {/* Emergency Type */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Emergency Type <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <select
                value={emergencyType}
                onChange={(e) => setEmergencyType(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0072B2] focus:border-transparent bg-white text-gray-700 appearance-none"
              >
                <option value="">Select the nature of the emergency...</option>
                {EMERGENCY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                ▼
              </div>
            </div>
          </div>

          {/* Precise Location */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Precise Location <span className="text-danger">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter landmark, street, or coordinates"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0072B2] focus:border-transparent placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={handleGps}
                disabled={gpsStatus === "loading"}
                className={`px-4 py-3 rounded-lg border-2 transition-colors ${
                  gpsStatus === "success"
                    ? "border-green-500 text-success bg-green-50"
                    : gpsStatus === "error"
                    ? "border-red-400 text-danger bg-red-50"
                    : "border-gray-300 text-gray-600 hover:border-[#0072B2] hover:text-[#0072B2]"
                }`}
              >
                {gpsStatus === "loading" ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <MapPin className="w-5 h-5" />
                )}
              </button>
            </div>
            {gpsError && (
              <p className="mt-2 text-sm text-danger flex items-start gap-1">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {gpsError}
              </p>
            )}
          </div>

          {/* Detailed Description */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Detailed Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the situation, number of people affected, and specific needs..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0072B2] focus:border-transparent resize-none placeholder:text-gray-400"
            />
          </div>

          {/* Name and Phone */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Your Name <span className="text-gray-500 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0072B2] focus:border-transparent placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Phone Number <span className="text-gray-500 font-normal">(Optional)</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0072B2] focus:border-transparent placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200 mb-6" />

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-lg text-white font-bold text-lg transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#0072B2" }}
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Emergency Report
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-500 mt-4">
            By submitting, you confirm the information is accurate to the best
            of your knowledge.
          </p>
        </form>
      </div>
    </FormLayout>
  );
}
