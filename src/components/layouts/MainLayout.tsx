import React from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { RecentUpdates } from "@/components/RecentUpdates";
import { Footer } from "@/components/Footer";
import { FilterProvider } from "@/lib/filter-context";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <FilterProvider>
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
        <Navbar />
        
        <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
          <Sidebar />
          
          <div className="flex-1 flex flex-col min-w-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-[520px] relative">
              {children}
            </div>
            
            <RecentUpdates />
          </div>
        </main>

        <Footer />
      </div>
    </FilterProvider>
  );
}
