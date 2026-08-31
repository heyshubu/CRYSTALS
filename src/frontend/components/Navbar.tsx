"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Asterisk } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <Link href="/" aria-label="Sanyukta Home">
          <div className="w-10 h-10 relative">
            <Image
              src="/Logo.jpeg"
              alt="Sanyukta Logo"
              fill
              className="object-contain"
            />
          </div>
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
        <Link 
          href="/resources" 
          className={`${pathname === '/resources' ? 'text-[#0072B2] border-b-2 border-[#0072B2]' : 'hover:text-[#0072B2]'} transition-colors pb-1`}
        >
          Resources
        </Link>
        <Link href="#" className="hover:text-[#0072B2] transition-colors pb-1">
          Volunteer Hub
        </Link>
        <Link href="#" className="hover:text-[#0072B2] transition-colors pb-1">
          Emergency Contacts
        </Link>
      </div>

      <Link href="/report-emergency" className="flex items-center gap-2 text-white px-5 py-2.5 rounded-full font-medium transition-opacity hover:opacity-90" style={{ backgroundColor: '#0072B2' }}>
        <Asterisk className="w-4 h-4" />
        Report Emergency
      </Link>
    </nav>
  );
}
