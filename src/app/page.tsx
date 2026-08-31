"use client";

import dynamic from "next/dynamic";

const MapContent = dynamic(() => import("@/components/MapContent"), {
  ssr: false,
  loading: () => (
    <div className="h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-100">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
});

export default function HomePage() {
  return <MapContent />;
}
