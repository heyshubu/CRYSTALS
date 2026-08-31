"use client";

import { useState, useEffect, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "@/lib/theme-context";
import {
  CATEGORY_CONFIG,
  URGENCY_CONFIG,
  getCategoryColor,
  getUrgencyColor,
} from "@/lib/map-icons";
import { FilterChips } from "@/components/FilterChips";
import { MapLegend } from "@/components/MapLegend";
import { PinDetailPopup } from "@/components/PinDetailPopup";
import type {
  PublicCheckIn,
  PublicNeed,
  PublicShelter,
  NeedCategory,
} from "@/lib/types";
import { Wifi, WifiOff } from "lucide-react";

const NEPAL_CENTER: [number, number] = [27.7172, 85.324];
const DEFAULT_ZOOM = 7;

// Different radii per category so pins are distinguishable by size/shape
const CATEGORY_RADIUS: Record<string, number> = {
  food: 8, water: 9, medical: 10, shelter: 11, transport: 7, safe: 8,
};

function MapEvents({ onIdle }: { onIdle: (c: [number, number], z: number) => void }) {
  const map = useMap();
  useEffect(() => {
    const handler = () => { const c = map.getCenter(); onIdle([c.lat, c.lng], map.getZoom()); };
    map.on("moveend", handler);
    map.on("zoomend", handler);
    return () => { map.off("moveend", handler); map.off("zoomend", handler); };
  }, [map, onIdle]);
  return null;
}

export default function MapContent() {
  const { theme } = useTheme();
  const [checkIns, setCheckIns] = useState<PublicCheckIn[]>([]);
  const [needs, setNeeds] = useState<PublicNeed[]>([]);
  const [shelters, setShelters] = useState<PublicShelter[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    () => new Set(["food", "water", "medical", "shelter", "transport", "safe"])
  );
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(
    () => new Set(["open", "in_progress", "resolved", "safe", "need_help"])
  );
  const [selectedPin, setSelectedPin] = useState<{
    type: "check_in" | "need" | "shelter";
    data: PublicCheckIn | PublicNeed | PublicShelter;
  } | null>(null);
  const [connected, setConnected] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [cRes, nRes, sRes] = await Promise.all([
          fetch("/api/data/check-ins").then((r) => r.json()),
          fetch("/api/data/needs").then((r) => r.json()),
          fetch("/api/data/shelters").then((r) => r.json()),
        ]);
        if (Array.isArray(cRes)) setCheckIns(cRes);
        if (Array.isArray(nRes)) setNeeds(nRes);
        if (Array.isArray(sRes)) setShelters(sRes);
        setConnected(true);
      } catch { setConnected(false); }
    };
    fetchAll();
    const interval = setInterval(fetchAll, 10000);
    return () => clearInterval(interval);
  }, []);

  const toggleCategory = useCallback((cat: string) => {
    setSelectedCategories((prev) => { const n = new Set(prev); if (n.has(cat)) n.delete(cat); else n.add(cat); return n; });
  }, []);
  const toggleStatus = useCallback((status: string) => {
    setSelectedStatuses((prev) => { const n = new Set(prev); if (n.has(status)) n.delete(status); else n.add(status); return n; });
  }, []);

  const filteredCheckIns = checkIns.filter((c) => selectedCategories.has("safe") && selectedStatuses.has(c.status));
  const filteredNeeds = needs.filter((n) => selectedCategories.has(n.category) && selectedStatuses.has(n.status));

  return (
    <div className="relative h-[calc(100vh-4rem)]">
      <div className="absolute top-4 right-4 z-[1001]">
        {connected ? (
          <span className="flex items-center gap-1 text-xs text-green-600 bg-white/90 px-2 py-1 rounded-full shadow">
            <Wifi className="w-3 h-3" /> Live
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs text-red-600 bg-white/90 px-2 py-1 rounded-full shadow">
            <WifiOff className="w-3 h-3" /> Offline
          </span>
        )}
      </div>

      <FilterChips
        selectedCategories={selectedCategories}
        onToggleCategory={toggleCategory}
        selectedStatuses={selectedStatuses}
        onToggleStatus={toggleStatus}
      />

      <MapContainer center={NEPAL_CENTER} zoom={DEFAULT_ZOOM} className="h-full w-full" zoomControl={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents onIdle={() => {}} />

        {/* Check-in markers — star shape via radius 8, safe color */}
        {filteredCheckIns.map((c) => (
          <CircleMarker key={c.id} center={[c.approx_lat, c.approx_lng]} radius={8}
            fillColor={getCategoryColor("safe", theme)} fillOpacity={0.8}
            color="white" weight={2}
            eventHandlers={{ click: () => setSelectedPin({ type: "check_in", data: c }) }}
          >
            <Popup>✅ {c.name || "Anonymous"} — {c.status === "safe" ? "Safe" : "Needs Help"}</Popup>
          </CircleMarker>
        ))}

        {/* Need markers — different radius per category for shape distinction */}
        {filteredNeeds.map((n) => (
          <CircleMarker key={n.id} center={[n.approx_lat, n.approx_lng]}
            radius={CATEGORY_RADIUS[n.category] || 9}
            fillColor={getCategoryColor(n.category as NeedCategory, theme)}
            fillOpacity={0.8}
            color={getUrgencyColor(n.urgency, theme)}
            weight={3}
            eventHandlers={{ click: () => setSelectedPin({ type: "need", data: n }) }}
          >
            <Popup>{CATEGORY_CONFIG[n.category].emoji} {CATEGORY_CONFIG[n.category].label} — {URGENCY_CONFIG[n.urgency].icon} {n.urgency}<br />{n.description.slice(0, 60)}...</Popup>
          </CircleMarker>
        ))}

        {/* Shelter markers — largest radius, shelter color */}
        {shelters.map((s) => (
          <CircleMarker key={s.id} center={[s.exact_lat, s.exact_lng]} radius={12}
            fillColor={getCategoryColor("shelter", theme)} fillOpacity={0.8}
            color="white" weight={3}
            eventHandlers={{ click: () => setSelectedPin({ type: "shelter", data: s }) }}
          >
            <Popup>🏠 {s.name}<br />{s.current_occupancy}/{s.capacity}</Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      <MapLegend />

      {selectedPin && (
        <PinDetailPopup
          mode="public"
          type={selectedPin.type}
          name={"name" in selectedPin.data ? selectedPin.data.name : undefined}
          phone={"phone" in selectedPin.data ? (selectedPin.data as {phone?: string | null}).phone : undefined}
          category={"category" in selectedPin.data ? (selectedPin.data as {category?: NeedCategory}).category : undefined}
          urgency={"urgency" in selectedPin.data ? (selectedPin.data as {urgency?: import("@/lib/types").NeedUrgency}).urgency : undefined}
          status={"status" in selectedPin.data ? selectedPin.data.status : undefined}
          description={"description" in selectedPin.data ? (selectedPin.data as {description?: string}).description : undefined}
          approxLat={"approx_lat" in selectedPin.data ? selectedPin.data.approx_lat : undefined}
          approxLng={"approx_lng" in selectedPin.data ? selectedPin.data.approx_lng : undefined}
          createdAt={selectedPin.data.created_at}
          onClose={() => setSelectedPin(null)}
        />
      )}
    </div>
  );
}
