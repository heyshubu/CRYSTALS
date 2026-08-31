"use client";

import { useState, useEffect } from "react";
import { Building2, Users, Loader2 } from "lucide-react";
import { OccupancyBar } from "@/components/UrgencyBadge";
import type { PublicShelter } from "@/lib/types";

export default function SheltersPage() {
  const [shelters, setShelters] = useState<PublicShelter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShelters = async () => {
      try {
        const res = await fetch("/api/data/shelters");
        const data = await res.json();
        if (Array.isArray(data)) setShelters(data);
      } catch { /* ignore */ }
      setLoading(false);
    };
    fetchShelters();
    const interval = setInterval(fetchShelters, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8 text-purple-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Shelters</h1>
        <p className="text-gray-500 text-sm">Current shelter locations and occupancy.</p>
      </div>

      {shelters.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No shelters registered yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {shelters.map((shelter) => (
              <div key={shelter.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-800">{shelter.name}</h3>
                    <p className="text-xs text-gray-400 font-mono">{shelter.exact_lat.toFixed(4)}, {shelter.exact_lng.toFixed(4)}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    {shelter.current_occupancy}/{shelter.capacity}
                  </div>
                </div>
                <OccupancyBar current={shelter.current_occupancy} capacity={shelter.capacity} />
              </div>
          ))}
        </div>
      )}
    </div>
  );
}
