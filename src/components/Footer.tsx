import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#e9ecef] py-12 px-6 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="text-xl font-bold text-gray-900">
          Sanyukta
        </div>
        
        <div className="flex flex-col md:flex-row gap-x-8 gap-y-4 text-sm font-medium text-gray-700">
          <Link href="#" className="hover:text-[#0072B2] transition-colors">Essential Contacts</Link>
          <Link href="#" className="hover:text-[#0072B2] transition-colors">Accessibility Settings</Link>
          <Link href="#" className="hover:text-[#0072B2] transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-[#0072B2] transition-colors">Terms of Service</Link>
        </div>

        <div className="text-sm text-gray-600 md:text-right max-w-[250px]">
          © 2024 Sanyukta Disaster Relief Nepal. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
