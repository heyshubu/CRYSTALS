"use client";

import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "@/frontend/theme-context";
import {
  CATEGORY_CONFIG,
  URGENCY_CONFIG,
  getCategoryColor,
  getUrgencyColor,
} from "@/frontend/map-icons";
import { MapLegend } from "@/frontend/MapLegend";
import { PinDetailPopup } from "@/frontend/PinDetailPopup";
import type { NeedCategory, NeedUrgency } from "@/shared/types";

const NEPAL_CENTER: [number, number] = [27.7172, 85.324];
const DEFAULT_ZOOM = 7;

const CATEGORY_RADIUS: Record<string, number> = {
  food: 8, water: 9, medical: 10, shelter: 11, transport: 7, safe: 8,
};

/** Flexible need type — works with both PublicNeed and full Need (has exact_lat/exact_lng) */
interface MapNeed {
  id: string;
  category: string;
  urgency: string;
  description: string;
  status: string;
  is_assigned: boolean;
  approx_lat: number;
  approx_lng: number;
  exact_lat?: number;
  exact_lng?: number;
  name?: string | null;
  phone?: string | null;
  created_at: string;
}

interface MapCheckIn {
  id: string;
  name?: string | null;
  status: string;
  approx_lat: number;
  approx_lng: number;
  created_at: string;
}

interface MapShelter {
  id: string;
  name: string;
  exact_lat: number;
  exact_lng: number;
  capacity: number;
  current_occupancy: number;
  created_at: string;
}

interface ActionButton {
  label: string;
  onClick: () => void;
  variant?: "primary" | "success" | "danger";
  disabled?: boolean;
}

interface DashboardMapProps {
  needs: MapNeed[];
  checkIns: MapCheckIn[];
  shelters: MapShelter[];
  actions?: ActionButton[];
}

export function DashboardMap({ needs, checkIns, shelters, actions }: DashboardMapProps) {
  const { theme } = useTheme();
  const [selectedPin, setSelectedPin] = useState<{
    type: "check_in" | "need" | "shelter";
    data: MapNeed | MapCheckIn | MapShelter;
  } | null>(null);

  return (
    <div className="relative h-[50vh] rounded-xl overflow-hidden border border-gray-200 mb-4">
      <MapContainer center={NEPAL_CENTER} zoom={DEFAULT_ZOOM} className="h-full w-full" zoomControl={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Check-in markers */}
        {checkIns.map((c) => (
          <CircleMarker key={c.id} center={[c.approx_lat, c.approx_lng]} radius={8}
            fillColor={getCategoryColor("safe", theme)} fillOpacity={0.8}
            color="white" weight={2}
            eventHandlers={{ click: () => setSelectedPin({ type: "check_in", data: c }) }}
          >
            <Popup>✅ {c.name || "Anonymous"} — {c.status === "safe" ? "Safe" : "Needs Help"}</Popup>
          </CircleMarker>
        ))}

        {/* Need markers — exact locations in responder mode */}
        {needs.map((n) => (
          <CircleMarker key={n.id} center={[n.exact_lat ?? n.approx_lat, n.exact_lng ?? n.approx_lng]}
            radius={CATEGORY_RADIUS[n.category] || 9}
            fillColor={getCategoryColor(n.category as NeedCategory, theme)}
            fillOpacity={0.8}
            color={getUrgencyColor(n.urgency as NeedUrgency, theme)}
            weight={3}
            eventHandlers={{ click: () => setSelectedPin({ type: "need", data: n }) }}
          >
            <Popup>{CATEGORY_CONFIG[n.category as NeedCategory]?.emoji} {CATEGORY_CONFIG[n.category as NeedCategory]?.label} — {URGENCY_CONFIG[n.urgency as NeedUrgency]?.icon} {n.urgency}<br />{n.description.slice(0, 60)}...</Popup>
          </CircleMarker>
        ))}

        {/* Shelter markers */}
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
          mode="responder"
          type={selectedPin.type}
          name={"name" in selectedPin.data ? selectedPin.data.name : undefined}
          phone={"phone" in selectedPin.data ? (selectedPin.data as MapNeed).phone : undefined}
          category={"category" in selectedPin.data ? (selectedPin.data as MapNeed).category as NeedCategory : undefined}
          urgency={"urgency" in selectedPin.data ? (selectedPin.data as MapNeed).urgency as NeedUrgency : undefined}
          status={"status" in selectedPin.data ? selectedPin.data.status : undefined}
          description={"description" in selectedPin.data ? (selectedPin.data as MapNeed).description : undefined}
          approxLat={"approx_lat" in selectedPin.data ? selectedPin.data.approx_lat : undefined}
          approxLng={"approx_lng" in selectedPin.data ? selectedPin.data.approx_lng : undefined}
          exactLat={"exact_lat" in selectedPin.data ? (selectedPin.data as MapNeed).exact_lat : undefined}
          exactLng={"exact_lng" in selectedPin.data ? (selectedPin.data as MapNeed).exact_lng : undefined}
          createdAt={selectedPin.data.created_at}
          onClose={() => setSelectedPin(null)}
          actions={selectedPin.type === "need" && actions ? actions : undefined}
        />
      )}
    </div>
  );
}
