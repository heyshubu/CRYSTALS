"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Phone, AlertTriangle, ShieldCheck } from "lucide-react";

const MapContent = dynamic(() => import("@/components/MapContent"), {
  ssr: false,
  loading: () => (
    <div className="h-[calc(100vh-4rem)] w-full flex items-center justify-center bg-gray-100">
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
        className="fixed bottom-24 right-4 z-40 md:bottom-8 bg-red-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-red-700 transition-colors animate-pulse"
        title="Emergency Hotline: 100"
      >
        <Phone className="w-6 h-6" />
      </a>

      {/* Quick action buttons */}
      <div className="fixed bottom-24 left-4 z-40 md:bottom-8 flex flex-col gap-2">
        <Link
          href="/safe"
          className="bg-green-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-green-700 transition-colors"
          title="I'm Safe"
        >
          <ShieldCheck className="w-5 h-5" />
        </Link>
        <Link
          href="/report"
          className="bg-orange-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-orange-700 transition-colors"
          title="Report Need"
        >
          <AlertTriangle className="w-5 h-5" />
        </Link>
      </div>

      {/* Map */}
      <div className="h-[calc(100vh-4rem)] w-full">
        <MapContent />
      </div>
    </div>
  );
}
