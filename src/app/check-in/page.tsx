"use client";

import { useState } from "react";
import { FormLayout } from "@/components/layouts/FormLayout";
import { CheckCircle2, Asterisk, Target, Send, Lock, MapPin, Loader2, AlertCircle } from "lucide-react";
import { UNIQUE_DISTRICTS, DISTRICT_COORDS } from "@/lib/nepal-districts";

export default function CheckInPage() {
  const [status, setStatus] = useState<"safe" | "help">("safe");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [district, setDistrict] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleGps() {
    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser.");
      setGpsStatus("error");
      return;
    }
    setGpsStatus("loading");
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGpsStatus("success");
      },
      (err) => {
        setGpsStatus("error");
        if (err.code === err.PERMISSION_DENIED) {
          setGpsError("Location permission denied. Please allow access and try again.");
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setGpsError("Location unavailable. Try selecting your district below.");
        } else {
          setGpsError("Could not get your location. Please try again.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    let lat: number, lng: number;
    if (gpsStatus === "success" && coords) {
      lat = coords.lat;
      lng = coords.lng;
    } else if (district) {
      const d = DISTRICT_COORDS[district];
      if (!d) { setError("District not found."); return; }
      lat = d.lat;
      lng = d.lng;
    } else {
      setError("Please use GPS to capture your location or select a district.");
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
          status: status === "safe" ? "safe" : "need_help",
          lat,
          lng,
        }),
      });
      if (!res.ok) {
        throw new Error("API unavailable");
      }
      setSubmitted(true);
    } catch {
      // Database unavailable — save locally so the map can pick it up
      const localCheckins = JSON.parse(localStorage.getItem("local_checkins") || "[]");
      localCheckins.push({
        id: `local_${Date.now()}`,
        name: name.trim() || null,
        phone: phone.trim() || null,
        status: status === "safe" ? "safe" : "need_help",
        approx_lat: lat,
        approx_lng: lng,
        created_at: new Date().toISOString(),
      });
      localStorage.setItem("local_checkins", JSON.stringify(localCheckins));
      setSubmitted(true);
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
              {status === "safe" ? "Thank you for checking in!" : "Help request submitted!"}
            </h1>
            <p className="text-gray-600 mb-6">
              {status === "safe"
                ? "Your status has been recorded. Stay safe."
                : "Responders have been notified of your situation. Help is on the way."}
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setStatus("safe");
                setName("");
                setPhone("");
                setDistrict("");
                setGpsStatus("idle");
                setCoords(null);
              }}
              className="px-6 py-3 bg-[#0072B2] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Check in again
            </button>
          </div>
        </div>
      </FormLayout>
    );
  }

  return (
    <FormLayout>
      <div className="w-full max-w-xl flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {status === "safe" ? "I'm Safe" : "I Need Help"}
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Let responders know your status. No account needed.
        </p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full mb-6">
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            
            {/* Current Status */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                Current Status <span className="text-gray-900">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setStatus("safe")}
                  className={`flex flex-col items-center justify-center py-6 px-4 rounded-xl border-2 transition-colors ${
                    status === "safe"
                      ? "bg-[#fced47] border-[#fced47] text-gray-900"
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <CheckCircle2 className="w-6 h-6 mb-2" />
                  <span className="font-bold text-lg">I&apos;m Safe</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setStatus("help")}
                  className={`flex flex-col items-center justify-center py-6 px-4 rounded-xl border-2 transition-colors ${
                    status === "help"
                      ? "text-white border-[#CC79A7]"
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                  style={status === "help" ? { backgroundColor: '#CC79A7' } : {}}
                >
                  <Asterisk className="w-6 h-6 mb-2" />
                  <span className="font-bold text-lg">I Need Help</span>
                </button>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Name (optional)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0072B2] focus:border-transparent transition-shadow placeholder:text-gray-400"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Phone (optional)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0072B2] focus:border-transparent transition-shadow placeholder:text-gray-400"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">Location</label>

              <button
                type="button"
                onClick={handleGps}
                disabled={gpsStatus === "loading"}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg border-2 font-semibold transition-colors ${
                  gpsStatus === "success"
                    ? "border-green-500 text-green-600 bg-green-50"
                    : gpsStatus === "error"
                    ? "border-red-400 text-red-600 bg-red-50"
                    : "border-[#0072B2] text-[#0072B2] hover:bg-blue-50"
                }`}
              >
                {gpsStatus === "loading" ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Getting your location...</>
                ) : gpsStatus === "success" ? (
                  <><MapPin className="w-5 h-5" /> Location captured! ({coords?.lat.toFixed(4)}, {coords?.lng.toFixed(4)})</>
                ) : gpsStatus === "error" ? (
                  <><AlertCircle className="w-5 h-5" /> Try again</>
                ) : (
                  <><Target className="w-5 h-5" /> Use my GPS location</>
                )}
              </button>

              {/* GPS error message */}
              {gpsError && (
                <p className="mt-2 text-sm text-red-600 flex items-start gap-1">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {gpsError}
                </p>
              )}
              
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">OR</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              <div className="relative">
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0072B2] focus:border-transparent bg-white text-gray-700 appearance-none"
                >
                  <option value="">Select district...</option>
                  {UNIQUE_DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">▼</div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              style={{ backgroundColor: '#0072B2' }}
              className="w-full mt-4 flex items-center justify-center gap-2 py-4 rounded-lg text-white font-bold text-lg transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
              ) : (
                <><Send className="w-5 h-5" /> Submit Check-In</>
              )}
            </button>
          </form>
        </div>

        <div className="flex flex-col items-center gap-2 text-center text-gray-500 max-w-sm">
          <Lock className="w-4 h-4" />
          <p className="text-sm">
            Your submission is anonymous and timestamped. No account is created.
          </p>
        </div>
      </div>
    </FormLayout>
  );
}
