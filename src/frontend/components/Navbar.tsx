"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Asterisk } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2 group" aria-label="Sanyukta Home">
          <div className="w-9 h-9 bg-black rounded-full flex items-center justify-center shrink-0">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
              {/* House roof */}
              <path d="M15 55 Q20 25 50 18 Q80 25 85 55" stroke="#FCED47" strokeWidth="5" strokeLinecap="round" fill="none"/>
              {/* Left person body */}
              <line x1="30" y1="55" x2="30" y2="82" stroke="#FCED47" strokeWidth="5" strokeLinecap="round"/>
              {/* Left person head */}
              <circle cx="30" cy="46" r="7" stroke="#FCED47" strokeWidth="4" fill="none"/>
              {/* Right person head */}
              <circle cx="58" cy="52" r="6" stroke="#FCED47" strokeWidth="4" fill="none"/>
              {/* Right person body */}
              <line x1="58" y1="58" x2="58" y2="82" stroke="#FCED47" strokeWidth="5" strokeLinecap="round"/>
              {/* Arm reaching */}
              <path d="M30 62 Q44 56 58 62" stroke="#FCED47" strokeWidth="4" strokeLinecap="round" fill="none"/>
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-gray-900">Sanyukta</span>
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-8 font-medium text-sm text-gray-600">
        <Link 
          href="/" 
          className={`${pathname === '/' ? 'text-[#0072B2] border-b-2 border-[#0072B2]' : 'hover:text-[#0072B2]'} transition-colors pb-1`}
        >
          Relief Map
        </Link>
        <Link 
          href="/check-in" 
          className={`${pathname === '/check-in' ? 'text-[#0072B2] border-b-2 border-[#0072B2]' : 'hover:text-[#0072B2]'} transition-colors pb-1`}
        >
          I am safe
        </Link>
        <Link href="#" className="hover:text-[#0072B2] transition-colors pb-1">
          Resources
        </Link>
        <Link href="#" className="hover:text-[#0072B2] transition-colors pb-1">
          Volunteer Hub
        </Link>
        <Link href="#" className="hover:text-[#0072B2] transition-colors pb-1">
          Emergency Contacts
        </Link>
      </div>

      <button className="flex items-center gap-2 text-white px-5 py-2.5 rounded-full font-medium transition-opacity hover:opacity-90" style={{ backgroundColor: '#0072B2' }}>
        <Asterisk className="w-4 h-4" />
        Report Emergency
      </button>
    </nav>
  );
}
