"use client";

import { useState } from "react";
import { FormLayout } from "@/frontend/layouts/FormLayout";
import { CheckCircle2, Target, Send, Lock, MapPin, Loader2, AlertCircle } from "lucide-react";

export default function CheckInPage() {

  const [gpsStatus, setGpsStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);

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

  return (
    <FormLayout>
      <div className="w-full max-w-xl flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">I&apos;m Safe</h1>
        <p className="text-gray-600 mb-8 text-center">
          Let responders know your status. No account needed.
        </p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full mb-6">
          <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
            
            {/* Status Badge */}
            <div className="flex items-center gap-3 py-4 px-5 rounded-xl bg-[#fced47] border-2 border-[#fced47]">
              <CheckCircle2 className="w-6 h-6 text-gray-900" />
              <span className="font-bold text-lg text-gray-900">I&apos;m Safe</span>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Name (optional)</label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0072B2] focus:border-transparent transition-shadow placeholder:text-gray-400"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Phone (optional)</label>
              <input
                type="tel"
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
                <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0072B2] focus:border-transparent bg-white text-gray-700 appearance-none">
                  <option value="">Select district...</option>
                  <option value="kathmandu">Kathmandu</option>
                  <option value="lalitpur">Lalitpur</option>
                  <option value="bhaktapur">Bhaktapur</option>
                  <option value="gorkha">Gorkha</option>
                  <option value="sindhupalchok">Sindhupalchok</option>
                  <option value="pokhara">Pokhara</option>
                  <option value="chitwan">Chitwan</option>
                  <option value="dhading">Dhading</option>
                  <option value="nuwakot">Nuwakot</option>
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">▼</div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              style={{ backgroundColor: '#0072B2' }}
              className="w-full mt-4 flex items-center justify-center gap-2 py-4 rounded-lg text-white font-bold text-lg transition-opacity hover:opacity-90"
            >
              Submit Check-In
              <Send className="w-5 h-5" />
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