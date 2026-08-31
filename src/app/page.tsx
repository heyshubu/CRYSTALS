"use client";

import dynamic from "next/dynamic";
import { MainLayout } from "@/components/layouts/MainLayout";

const MapContent = dynamic(() => import("@/components/MapContent"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
});

export default function HomePage() {
  return (
    <MainLayout>
      <div className="h-full w-full [&>div]:h-full [&>div]:!h-full">
        <MapContent />
      </div>
    </MainLayout>
  );
}
