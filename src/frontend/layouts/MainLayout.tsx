import React from "react";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { RecentUpdates } from "../components/RecentUpdates";
import { Footer } from "../components/Footer";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        <Sidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-[500px] relative">
            <div className="absolute top-4 left-4 z-[1000] bg-white/90 px-3 py-1.5 rounded-md shadow-sm text-xs font-bold text-gray-700 tracking-wider">
              MAP DASHBOARD | NEPAL
            </div>
            {/* The Map component will go here */}
            {children}
          </div>
          
          <RecentUpdates />
        </div>
      </main>

      <Footer />
    </div>
  );
}
