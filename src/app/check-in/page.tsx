"use client";

import { useState } from "react";
import { FormLayout } from "@/frontend/layouts/FormLayout";
import { CheckCircle2, Asterisk, Target, Send, Lock } from "lucide-react";

export default function CheckInPage() {
  const [status, setStatus] = useState<"safe" | "help">("safe");

  return (
    <FormLayout>
      <div className="w-full max-w-xl flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">I&apos;m Safe</h1>
        <p className="text-gray-600 mb-8 text-center">
          Let responders know your status. No account needed.
        </p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full mb-6">
          <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
            
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
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Name (optional)
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0072B2] focus:border-transparent transition-shadow placeholder:text-gray-400"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Phone (optional)
              </label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0072B2] focus:border-transparent transition-shadow placeholder:text-gray-400"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                Location
              </label>
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border-2 border-[#0072B2] text-[#0072B2] font-semibold hover:bg-blue-50 transition-colors"
              >
                <Target className="w-5 h-5" />
                Use my GPS location
              </button>
              
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">OR</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0072B2] focus:border-transparent bg-white text-gray-700 appearance-none">
                <option value="">Select district...</option>
                <option value="kathmandu">Kathmandu</option>
                <option value="lalitpur">Lalitpur</option>
                <option value="bhaktapur">Bhaktapur</option>
                <option value="gorkha">Gorkha</option>
                <option value="sindhupalchok">Sindhupalchok</option>
              </select>
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
