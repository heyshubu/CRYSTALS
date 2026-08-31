import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export function FormLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 max-w-[800px] w-full mx-auto px-6 py-12 flex flex-col items-center">
        {children}
      </main>

      <Footer />
    </div>
  );
}
