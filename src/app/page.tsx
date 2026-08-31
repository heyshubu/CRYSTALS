"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Phone, AlertTriangle, ShieldCheck } from "lucide-react";
import { EmergencyAlert } from "@/components/EmergencyAlert";

const MapContent = dynamic(() => import("@/components/MapContent"), {
  ssr: false,
  loading: () => (
    <div className="h-[60vh] w-full flex items-center justify-center bg-gray-100">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
});

export default function HomePage() {
  return (
    <div className="relative">
      {/* Emergency hotline floating button */}
      <a
        href="tel:100"
        className="fixed bottom-24 right-4 z-40 md:bottom-8 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors animate-pulse"
        style={{ backgroundColor: "var(--color-danger)", color: "white" }}
        title="Emergency Hotline: 100"
      >
        <Phone className="w-6 h-6" />
      </a>

      {/* Quick action buttons */}
      <div className="fixed bottom-24 left-4 z-40 md:bottom-8 flex flex-col gap-2">
        <Link
          href="/safe"
          className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-colors"
          style={{ backgroundColor: "var(--color-success)", color: "white" }}
          title="I'm Safe"
        >
          <ShieldCheck className="w-5 h-5" />
        </Link>
        <Link
          href="/report"
          className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-colors"
          style={{ backgroundColor: "var(--color-orange)", color: "white" }}
          title="Report Need"
        >
          <AlertTriangle className="w-5 h-5" />
        </Link>
      </div>

      {/* Map */}
      <div className="h-[55vh] sm:h-[65vh] w-full">
        <MapContent />
      </div>

      {/* Emergency alert bar — below the map */}
      <EmergencyAlert />

      {/* Quick info cards below alert */}
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/safe"
          className="flex items-center gap-3 p-4 rounded-xl border transition hover:shadow-md"
          style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
        >
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--color-success-light)" }}>
            <ShieldCheck className="w-5 h-5" style={{ color: "var(--color-success)" }} />
          </div>
          <div>
            <h3 className="text-sm font-bold" style={{ color: "var(--color-text)" }}>I&apos;m Safe</h3>
            <p className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>Check in and let others know your status</p>
          </div>
        </Link>

        <Link
          href="/report"
          className="flex items-center gap-3 p-4 rounded-xl border transition hover:shadow-md"
          style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
        >
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--color-danger-light)" }}>
            <AlertTriangle className="w-5 h-5" style={{ color: "var(--color-danger)" }} />
          </div>
          <div>
            <h3 className="text-sm font-bold" style={{ color: "var(--color-text)" }}>Report Need</h3>
            <p className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>Report food, water, medical, or shelter needs</p>
          </div>
        </Link>

        <Link
          href="/shelters"
          className="flex items-center gap-3 p-4 rounded-xl border transition hover:shadow-md"
          style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
        >
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--color-purple-light)" }}>
            <span className="text-lg">🏠</span>
          </div>
          <div>
            <h3 className="text-sm font-bold" style={{ color: "var(--color-text)" }}>Find Shelters</h3>
            <p className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>View shelter locations and occupancy</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
