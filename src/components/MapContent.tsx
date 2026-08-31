"use client";

import { useState, useEffect, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useFilters } from "@/lib/filter-context";
import { CATEGORY_CONFIG, URGENCY_CONFIG } from "@/lib/map-icons";
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

// ── Custom DivIcon factories ─────────────────────────────────────

function makeIcon(emoji: string, bg: string, size = 36, border = "white"): L.DivIcon {
  return L.divIcon({
    html: `<div style="
      width:${size}px;height:${size}px;
      background:${bg};
      border:2.5px solid ${border};
      border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      font-size:${Math.round(size * 0.5)}px;
      box-shadow:0 2px 6px rgba(0,0,0,0.28);
      cursor:pointer;
    ">${emoji}</div>`,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2)],
  });
}

function makeSquareIcon(emoji: string, bg: string, size = 32): L.DivIcon {
  return L.divIcon({
    html: `<div style="
      width:${size}px;height:${size}px;
      background:${bg};
      border:2px solid white;
      border-radius:6px;
      display:flex;align-items:center;justify-content:center;
      font-size:${Math.round(size * 0.5)}px;
      box-shadow:0 2px 6px rgba(0,0,0,0.28);
      cursor:pointer;
    ">${emoji}</div>`,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2)],
  });
}

// Category icon configs matching the picture
const CATEGORY_ICONS: Record<string, { emoji: string; bg: string; shape: "circle" | "square" }> = {
  food:      { emoji: "🍽️", bg: "#c57199", shape: "square" },
  water:     { emoji: "💧", bg: "#0072B2", shape: "square" },
  medical:   { emoji: "⛑️", bg: "#0072B2", shape: "circle" },
  shelter:   { emoji: "🏠", bg: "#fced47", shape: "circle" },
  transport: { emoji: "🚗", bg: "#6b7280", shape: "square" },
  safe:      { emoji: "✅", bg: "#22c55e", shape: "circle" },
  help:      { emoji: "🚨", bg: "#ef4444", shape: "circle" },
};

const URGENCY_BORDER: Record<string, string> = {
  high:   "#ef4444",
  medium: "#f97316",
  low:    "white",
};

function getMarkerIcon(category: string, urgency?: string): L.DivIcon {
  const cfg = CATEGORY_ICONS[category] ?? CATEGORY_ICONS.safe;
  const border = urgency ? (URGENCY_BORDER[urgency] ?? "white") : "white";
  return cfg.shape === "square"
    ? makeSquareIcon(cfg.emoji, cfg.bg)
    : makeIcon(cfg.emoji, cfg.bg, 36, border);
}

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
  const { urgency, resource } = useFilters();
  const [checkIns, setCheckIns] = useState<PublicCheckIn[]>([]);
  const [needs, setNeeds] = useState<PublicNeed[]>([]);
  const [shelters, setShelters] = useState<PublicShelter[]>([]);
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
        const apiCheckIns = Array.isArray(cRes) ? cRes : [];
        // Merge with local check-ins from localStorage
        const localCheckIns: PublicCheckIn[] = JSON.parse(localStorage.getItem("local_checkins") || "[]");
        setCheckIns([...apiCheckIns, ...localCheckIns]);
        if (Array.isArray(nRes)) setNeeds(nRes);
        if (Array.isArray(sRes)) setShelters(sRes);
        setConnected(true);
      } catch {
        // API unavailable — still show local check-ins
        const localCheckIns: PublicCheckIn[] = JSON.parse(localStorage.getItem("local_checkins") || "[]");
        setCheckIns(localCheckIns);
        setConnected(false);
      }
    };
    fetchAll();
    const interval = setInterval(fetchAll, 10000);
    return () => clearInterval(interval);
  }, []);

  // Apply filters from sidebar
  const filteredNeeds = needs.filter((n) => {
    const urgencyMatch = n.urgency === urgency;
    const resourceMatch = resource === null || n.category === resource;
    return urgencyMatch && resourceMatch;
  });

  const filteredShelters = resource === null || resource === "shelter" ? shelters : [];
  const filteredCheckIns = checkIns;

  return (
    <div className="relative h-full w-full">
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

      <MapContainer center={NEPAL_CENTER} zoom={DEFAULT_ZOOM} className="h-full w-full" zoomControl={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents onIdle={() => {}} />

        {/* Check-in markers */}
        {filteredCheckIns.map((c) => (
          <Marker
            key={c.id}
            position={[c.approx_lat, c.approx_lng]}
            icon={getMarkerIcon(c.status === "safe" ? "safe" : "help")}
            eventHandlers={{ click: () => setSelectedPin({ type: "check_in", data: c }) }}
          >
            <Popup>{c.status === "safe" ? "✅ Safe" : "🚨 Needs Help"} — {c.name || "Anonymous"}</Popup>
          </Marker>
        ))}

        {/* Need markers */}
        {filteredNeeds.map((n) => (
          <Marker
            key={n.id}
            position={[n.approx_lat, n.approx_lng]}
            icon={getMarkerIcon(n.category, n.urgency)}
            eventHandlers={{ click: () => setSelectedPin({ type: "need", data: n }) }}
          >
            <Popup>
              {CATEGORY_CONFIG[n.category].emoji} {CATEGORY_CONFIG[n.category].label} — {URGENCY_CONFIG[n.urgency].icon} {n.urgency}
              <br />{n.description.slice(0, 60)}...
            </Popup>
          </Marker>
        ))}

        {/* Shelter markers */}
        {filteredShelters.map((s) => (
          <Marker
            key={s.id}
            position={[s.exact_lat, s.exact_lng]}
            icon={getMarkerIcon("shelter")}
            eventHandlers={{ click: () => setSelectedPin({ type: "shelter", data: s }) }}
          >
            <Popup>🏠 {s.name}<br />{s.current_occupancy}/{s.capacity}</Popup>
          </Marker>
        ))}
      </MapContainer>

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
