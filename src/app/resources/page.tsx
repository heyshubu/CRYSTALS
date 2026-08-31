"use client";

import { useState } from "react";
// AppShell handles layout
import {
  Search,
  Home,
  BriefcaseMedical,
  Phone,
  MapPin,
  AlertTriangle,
  Droplet,
  Utensils,
  Package,
} from "lucide-react";

interface ResourceCard {
  id: string;
  type: "shelter" | "medical" | "supply";
  name: string;
  location: string;
  capacity?: number;
  capacityUsed?: number;
  description?: string;
  items?: string[];
  contactPhone?: string;
  lat?: number;
  lng?: number;
}

const RESOURCES: ResourceCard[] = [
  {
    id: "1",
    type: "shelter",
    name: "Community Hall A",
    location: "Patan Durbar Square",
    capacity: 200,
    capacityUsed: 160,
    contactPhone: "+977-1-5555123",
    lat: 27.6729,
    lng: 85.4277,
  },
  {
    id: "2",
    type: "medical",
    name: "Medical Supply Drop",
    location: "Bir Hospital",
    description: "Available supplies for immediate distribution.",
    items: ["First Aid Kits", "Bandages", "Water Purifiers"],
    contactPhone: "+977-1-4221234",
    lat: 27.7069,
    lng: 85.3186,
  },
  {
    id: "3",
    type: "shelter",
    name: "School Gymnasium",
    location: "Bhaktapur",
    capacity: 150,
    capacityUsed: 142,
    contactPhone: "+977-1-6611234",
    lat: 27.671,
    lng: 85.4298,
  },
  {
    id: "4",
    type: "shelter",
    name: "Gorkha Relief Camp",
    location: "Gorkha Bazaar",
    capacity: 300,
    capacityUsed: 120,
    contactPhone: "+977-64-420123",
    lat: 28.0,
    lng: 84.6333,
  },
  {
    id: "5",
    type: "supply",
    name: "Food Distribution Center",
    location: "Birendra Sainik Campus",
    description: "Dry rations and cooked meals available daily.",
    items: ["Rice", "Dal", "Cooked Meals", "Biscuits"],
    contactPhone: "+977-1-4911234",
    lat: 27.685,
    lng: 85.313,
  },
  {
    id: "6",
    type: "medical",
    name: "Trauma Care Unit",
    location: "Patan Hospital",
    description: "Emergency medical care for injuries.",
    items: ["Surgical Kits", "IV Fluids", "Pain Relievers", "Splints"],
    contactPhone: "+977-1-5522234",
    lat: 27.6735,
    lng: 85.4295,
  },
];

const CATEGORY_FILTERS = [
  { key: "all", label: "All", icon: Package },
  { key: "shelter", label: "Shelters", icon: Home },
  { key: "medical", label: "Medical", icon: BriefcaseMedical },
  { key: "supply", label: "Food & Supplies", icon: Utensils },
];

function getCapacityPercent(used: number, total: number) {
  return Math.round((used / total) * 100);
}

function getCapacityColor(percent: number) {
  if (percent >= 90) return "bg-red-500";
  if (percent >= 70) return "bg-[#0072B2]";
  return "bg-green-500";
}

function getCapacityTextColor(percent: number) {
  if (percent >= 90) return "text-red-500";
  return "text-gray-500";
}

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered = RESOURCES.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.items?.some((item) =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesFilter =
      activeFilter === "all" || r.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  function handleGetDirections(lat?: number, lng?: number) {
    if (lat && lng) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
        "_blank"
      );
    }
  }

  function handleCall(phone?: string) {
    if (phone) {
      window.open(`tel:${phone}`, "_self");
    }
  }

  return (
    <div className="p-4 max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Resources</h1>
          <p className="text-gray-600">
            Find available shelters, medical supplies, and relief resources near you.
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Search Resources & Shelters
          </label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="E.g., Medical supplies, Kathmandu..."
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0072B2] focus:border-transparent text-base"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORY_FILTERS.map((f) => {
            const Icon = f.icon;
            return (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  activeFilter === f.key
                    ? "bg-[#0072B2] text-white border-[#0072B2]"
                    : "bg-white text-gray-600 border-gray-300 hover:border-[#0072B2]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Results Count */}
        <p className="text-sm text-gray-500 mb-4">
          Showing {filtered.length} resource{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Resource Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((resource) => {
            const isNearCapacity =
              !!(resource.capacity &&
              resource.capacityUsed &&
              getCapacityPercent(resource.capacityUsed, resource.capacity) >= 90);
            const capacityPercent =
              resource.capacity && resource.capacityUsed
                ? getCapacityPercent(resource.capacityUsed, resource.capacity)
                : 0;

            return (
              <div
                key={resource.id}
                className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900">
                    {resource.name}
                  </h3>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${
                      resource.type === "shelter"
                        ? "bg-gray-100 text-gray-700 border border-gray-300"
                        : "bg-[#c57199] text-white"
                    }`}
                  >
                    {resource.type === "shelter" ? (
                      <Home className="w-3.5 h-3.5" />
                    ) : (
                      <BriefcaseMedical className="w-3.5 h-3.5" />
                    )}
                    {resource.type === "shelter"
                      ? "Shelter"
                      : resource.type === "medical"
                      ? "Medical"
                      : "Supplies"}
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
                  <MapPin className="w-4 h-4" />
                  {resource.location}
                </div>

                {/* Capacity Bar (for shelters) */}
                {resource.capacity && resource.capacityUsed !== undefined && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600 font-medium">Capacity</span>
                      <span className="font-bold text-gray-900">
                        {capacityPercent}% Full
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${getCapacityColor(
                          capacityPercent
                        )}`}
                        style={{ width: `${capacityPercent}%` }}
                      />
                    </div>
                    {isNearCapacity && (
                      <p className="mt-2 text-sm text-red-500 font-medium">
                        Near capacity. Redirecting to alternatives.
                      </p>
                    )}
                  </div>
                )}

                {/* Description */}
                {resource.description && (
                  <p className="text-sm text-gray-600 mb-4">
                    {resource.description}
                  </p>
                )}

                {/* Available Items */}
                {resource.items && resource.items.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {resource.items.map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                )}

                {/* Spacer */}
                <div className="flex-1" />

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  {resource.type === "shelter" ? (
                    <>
                      <button
                        onClick={() =>
                          handleGetDirections(resource.lat, resource.lng)
                        }
                        disabled={isNearCapacity}
                        className={`flex-1 py-3 rounded-lg font-semibold text-sm transition-colors ${
                          isNearCapacity
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-[#0072B2] text-white hover:opacity-90"
                        }`}
                      >
                        Get Directions
                      </button>
                      <button
                        onClick={() => handleCall(resource.contactPhone)}
                        className="px-4 py-3 rounded-lg border-2 border-[#0072B2] text-[#0072B2] font-semibold text-sm hover:bg-blue-50 transition-colors"
                      >
                        <Phone className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleCall(resource.contactPhone)}
                      className="w-full py-3 rounded-lg bg-[#0072B2] text-white font-semibold text-sm hover:opacity-90 transition-colors"
                    >
                      Request Aid
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">
              No resources found matching your search.
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Try a different search term or category.
            </p>
          </div>
        )}
    </div>
  );
}
