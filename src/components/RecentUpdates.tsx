import { CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";

export function RecentUpdates() {
  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Recent Updates</h2>
        <Link href="#" className="text-sm font-semibold text-[#0072B2] hover:underline">
          View All
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-gray-300 text-xs font-semibold text-gray-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Dispatched
            </div>
            <span className="text-xs text-gray-500 font-medium">10 mins ago</span>
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Medical Supplies En Route to Sindhupalchok</h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            A convoy carrying essential antibiotics and trauma kits has departed from the central...
          </p>
          <div className="flex gap-2">
            <span className="inline-flex items-center px-2 py-1 rounded bg-[#c57199] text-white text-xs font-medium">
              <span className="mr-1">🏥</span> Medical
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-medium">
              Urgent
            </span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[#0072B2] text-xs font-semibold text-[#0072B2]">
              <Clock className="w-3.5 h-3.5" />
              Pending
            </div>
            <span className="text-xs text-gray-500 font-medium">1 hour ago</span>
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Responders Needed: Debris Clearing</h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            Seeking 50+ able-bodied responders to assist with clearing access roads in the...
          </p>
          <div className="flex gap-2">
            <span className="inline-flex items-center px-2 py-1 rounded bg-[#c57199] text-white text-xs font-medium">
              <span className="mr-1">👥</span> Personnel
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
