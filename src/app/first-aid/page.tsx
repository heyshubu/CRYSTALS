"use client";

import { useState } from "react";
import {
  HeartPulse,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  WifiOff,
} from "lucide-react";
import { FIRST_AID_GUIDES } from "@/lib/first-aid-data";

export default function FirstAidPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Check URL hash for deep link from Report Need page (medical category)
  if (typeof window !== "undefined" && expandedId === null) {
    const hash = window.location.hash.slice(1);
    if (hash && FIRST_AID_GUIDES.some((g) => g.id === hash)) {
      // Will be expanded on first render
    }
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
          <HeartPulse className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">First-Aid Reference</h1>
        <p className="text-gray-500 text-sm">
          Plain-language first-aid guides for common emergencies.
        </p>
      </div>

      {/* Offline badge */}
      <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-full mb-6 w-fit">
        <WifiOff className="w-3 h-3" />
        Available offline — content is stored in the app
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mb-6 text-xs text-amber-700">
        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p>
          This is basic guidance only. Always call for professional medical
          help in serious emergencies. Content sourced from WHO/Red Cross
          basic first-aid principles.
        </p>
      </div>

      {/* Guides */}
      <div className="space-y-3">
        {FIRST_AID_GUIDES.map((guide) => {
          const isExpanded =
            expandedId === guide.id ||
            (typeof window !== "undefined" &&
              window.location.hash === `#${guide.id}`);

          return (
            <div
              key={guide.id}
              id={guide.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() =>
                  setExpandedId(isExpanded ? null : guide.id)
                }
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{guide.icon}</span>
                  <h2 className="font-semibold text-gray-800">{guide.title}</h2>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 border-t">
                  {/* Steps */}
                  <h3 className="text-sm font-semibold text-gray-600 mt-3 mb-2">
                    Steps:
                  </h3>
                  <ol className="space-y-2 mb-4">
                    {guide.steps.map((step, i) => (
                      <li key={i} className="flex gap-2 text-sm text-gray-700">
                        <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">
                          {i + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>

                  {/* Warnings */}
                  {guide.warnings.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <h4 className="text-xs font-semibold text-red-700 mb-1">
                        ⚠️ Important warnings:
                      </h4>
                      <ul className="space-y-1">
                        {guide.warnings.map((w, i) => (
                          <li
                            key={i}
                            className="text-xs text-red-600 flex items-start gap-1"
                          >
                            <span>•</span>
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-gray-400 mt-8 mb-4">
        Content for reference only — always seek professional medical help.
      </p>
    </div>
  );
}
