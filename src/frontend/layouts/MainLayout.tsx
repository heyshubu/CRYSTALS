import React from "react";
import { Navbar } from "../components/Navbar";
import { RecentUpdates } from "../components/RecentUpdates";
import { Footer } from "../components/Footer";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 py-8 flex flex-col gap-8">
        <div className="flex-1 flex flex-col min-w-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-[520px] relative">
            <div className="absolute top-4 left-4 z-[1000] bg-white/90 px-3 py-1.5 rounded-md shadow-sm text-xs font-bold text-gray-700 tracking-wider">
              MAP DASHBOARD | NEPAL
            </div>
            {children}
          </div>
          
          <RecentUpdates />
        </div>
      </main>

      <Footer />
    </div>
  );
}
