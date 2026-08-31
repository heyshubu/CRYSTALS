"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle2, MapPin, Loader2, LogOut, Building2,
  Phone, Hand, CheckSquare, AlertCircle, Save,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession, type ResponderSession } from "@/lib/hooks/use-session";
import { useTheme } from "@/lib/theme-context";
import { CATEGORY_CONFIG, URGENCY_CONFIG, getCategoryColor, getUrgencyColor } from "@/lib/map-icons";
import dynamic from "next/dynamic";
const DashboardMap = dynamic(() => import("@/components/DashboardMap").then(m => ({ default: m.DashboardMap })), { ssr: false });
import { UrgencyBadge, OccupancyBar } from "@/components/UrgencyBadge";
import type { Need, PublicShelter, NeedCategory, NeedUrgency } from "@/lib/types";

const URGENCY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };

export default function ResponderPage() {
  const router = useRouter();
  const { session, mounted } = useSession();
  const { theme } = useTheme();
  const responder = (session as ResponderSession)?.responder;

  const [needs, setNeeds] = useState<Need[]>([]);
  const [assignedTask, setAssignedTask] = useState<Need | null>(null);
  const [shelters, setShelters] = useState<PublicShelter[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [availability, setAvailability] = useState("available");
  const [showMap, setShowMap] = useState(false);

  // Shelter occupancy editing state
  const [shelterOccupancy, setShelterOccupancy] = useState<Record<string, number>>({});
  const [savingShelters, setSavingShelters] = useState(false);

  // Initialize shelter occupancy from fetched data
  useEffect(() => {
    if (shelters.length > 0) {
      const initial: Record<string, number> = {};
      shelters.forEach((s) => { initial[s.id] = s.current_occupancy; });
      setShelterOccupancy((prev) => {
        // Only set if empty (don't overwrite user edits)
        if (Object.keys(prev).length === 0) return initial;
        return prev;
      });
    }
  }, [shelters]);

  const fetchData = async (resp: { id: string }) => {
    try {
      const [needsRes, taskRes, sheltersRes] = await Promise.all([
        fetch("/api/data/needs?full=true").then((r) => r.json()),
        fetch(`/api/responder/task?responderId=${resp.id}`).then((r) => r.json()),
        fetch("/api/data/shelters").then((r) => r.json()),
      ]);
      if (Array.isArray(needsRes)) {
        setNeeds(needsRes.sort((a: Need, b: Need) => (URGENCY_ORDER[a.urgency] ?? 2) - (URGENCY_ORDER[b.urgency] ?? 2)));
      }
      if (taskRes && taskRes.task) setAssignedTask(taskRes.task); else setAssignedTask(null);
      if (Array.isArray(sheltersRes)) setShelters(sheltersRes);
    } catch { /* ignore */ }
    setLoading(false);
  };

  // Fetch data when session is confirmed and mounted
  useEffect(() => {
    if (!mounted || !session || session.role !== "responder") return;
    const resp = (session as ResponderSession).responder;
    if (!resp) return;
    setAvailability(resp.availability || "available");
    fetchData(resp);
    const interval = setInterval(() => fetchData(resp), 10000);
    return () => clearInterval(interval);
  }, [mounted, session]);

  const markComplete = async (needId: string) => {
    setActionLoading(needId);
    const res = await fetch("/api/responder/task", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ needId }) });
    if (res.ok) { setAssignedTask(null); setNeeds((prev) => prev.filter((n) => n.id !== needId)); }
    setActionLoading(null);
  };

  const pickUpNeed = async (needId: string) => {
    if (!responder) return;
    setActionLoading(needId);
    const res = await fetch("/api/responder/pickup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ needId, responderId: responder.id }) });
    if (res.ok && responder) fetchData(responder);
    else { const d = await res.json(); alert(d.error || "Failed."); }
    setActionLoading(null);
  };

  const toggleAvailability = async (a: string) => {
    if (!responder) return;
    const res = await fetch("/api/responder/availability", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ responderId: responder.id, availability: a }) });
    if (res.ok) setAvailability(a);
  };

  const saveAllShelters = async () => {
    setSavingShelters(true);
    const results = await Promise.all(
      shelters.map((s) =>
        fetch("/api/responder/shelter", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ shelterId: s.id, current_occupancy: shelterOccupancy[s.id] ?? s.current_occupancy }),
        })
      )
    );
    const allOk = results.every((r) => r.ok);
    if (allOk) {
      setShelters((prev) => prev.map((s) => ({ ...s, current_occupancy: shelterOccupancy[s.id] ?? s.current_occupancy })));
    }
    setSavingShelters(false);
  };

  // Safety timeout: force loading false after 5s so user never sees infinite spinner
  useEffect(() => {
    if (!mounted || !session || session.role !== "responder") return;
    const timeout = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(timeout);
  }, [mounted, session]);

  // ── Loading state ──────────────────────────────────────────
  if (!mounted) {
    return (<div className="p-4 max-w-lg mx-auto flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>);
  }

  // ── Redirect to login if not authenticated ───
  if (!session || session.role !== "responder") {
    return (
      <div className="p-4 max-w-lg mx-auto flex flex-col items-center justify-center min-h-[60vh]">
        <CheckSquare className="w-12 h-12 text-blue-400 mb-4" />
        <h1 className="text-xl font-bold mb-2">Responder Access Required</h1>
        <p className="text-gray-500 text-sm mb-6">Please sign in with your responder code.</p>
        <button onClick={() => router.push("/login")} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700">
          Go to Login
        </button>
      </div>
    );
  }

  const unassignedNeeds = needs.filter((n) => !n.is_assigned && n.status === "open");

  // ── Availability colors ────────────────────────────────────
  const availColors: Record<string, Record<string, string>> = {
    available: { normal: "#22c55e", deuteranomaly: "#009988", protanomaly: "#009988", deuteranopia: "#00aacc", protanopia: "#00aacc" },
    busy:      { normal: "#f97316", deuteranomaly: "#ee7733", protanomaly: "#dd6633", deuteranopia: "#ee8833", protanopia: "#ddaa33" },
    offline:   { normal: "#6b7280", deuteranomaly: "#555555", protanomaly: "#555555", deuteranopia: "#444444", protanopia: "#555555" },
  };

  // ── Main dashboard ─────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      {/* Availability toggle */}
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-xl font-bold text-gray-900">
          Welcome, <span className="text-blue-600">{responder?.name}</span>
        </h1>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
          {["available", "busy", "offline"].map((a) => {
            const c = availColors[a][theme];
            return (
              <button key={a} onClick={() => toggleAvailability(a)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  availability === a ? "text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
                style={availability === a ? { backgroundColor: c } : undefined}
              >
                {a.charAt(0).toUpperCase() + a.slice(1)}
              </button>
            );
          })}
        </div>
      </div>
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
        ) : (
          <div className="space-y-6">
            {/* ── Assigned Task Card ──────────────────────────── */}
            {assignedTask && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ backgroundColor: getCategoryColor(assignedTask.category as NeedCategory, theme) + "15" }}>
                    {CATEGORY_CONFIG[assignedTask.category as NeedCategory]?.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <UrgencyBadge urgency={assignedTask.urgency} />
                      <span className="font-bold text-gray-900 capitalize">{assignedTask.category} Supply Distribution</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{assignedTask.description}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <MapPin className="w-3 h-3" />
                      {assignedTask.exact_lat?.toFixed(4)}, {assignedTask.exact_lng?.toFixed(4)}
                      {assignedTask.phone && <><span className="mx-1">·</span><Phone className="w-3 h-3" />{assignedTask.phone}</>}
                    </div>
                  </div>
                  <button onClick={() => markComplete(assignedTask.id)} disabled={actionLoading === assignedTask.id}
                    className="flex-shrink-0 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 text-sm">
                    {actionLoading === assignedTask.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    Mark Complete
                  </button>
                </div>
              </div>
            )}

            {/* ── Two-column layout ──────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Left: Needs List */}
              <div className="lg:col-span-3">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bold text-gray-900">Needs List</h2>
                  <button onClick={() => setShowMap(!showMap)}
                    className="text-sm text-blue-600 hover:underline font-medium">
                    {showMap ? "Hide Map" : "View Map"}
                  </button>
                </div>

                {/* Map toggle */}
                {showMap && !loading && (
                  <div className="mb-4">
                    <DashboardMap needs={needs} checkIns={[]} shelters={shelters} />
                  </div>
                )}

                {/* Needs items */}
                <div className="space-y-3">
                  {unassignedNeeds.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
                      <CheckCircle2 className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <p>No unassigned needs right now.</p>
                    </div>
                  ) : (
                    unassignedNeeds.map((need) => {
                      const catCfg = CATEGORY_CONFIG[need.category as NeedCategory];
                      return (
                        <div key={need.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                            style={{ backgroundColor: getCategoryColor(need.category as NeedCategory, theme) + "15" }}>
                            {catCfg?.emoji}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-sm">{catCfg?.label} Shortage</h3>
                            <div className="flex items-center gap-2 mt-0.5">
                              <MapPin className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{need.exact_lat?.toFixed(2)}, {need.exact_lng?.toFixed(2)}</span>
                              <UrgencyBadge urgency={need.urgency} />
                            </div>
                          </div>
                          <button onClick={() => pickUpNeed(need.id)}
                            disabled={actionLoading === need.id || !!assignedTask}
                            className="flex-shrink-0 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50 disabled:opacity-50 disabled:border-gray-300 disabled:text-gray-400 transition-colors">
                            {actionLoading === need.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Pick Up"}
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right: Shelter Occupancy Editor */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-bold text-gray-900">Shelter Occupancy Editor</h2>
                  </div>

                  <div className="space-y-4">
                    {shelters.map((shelter) => {
                      const current = shelterOccupancy[shelter.id] ?? shelter.current_occupancy;
                      const pct = shelter.capacity > 0 ? Math.round((current / shelter.capacity) * 100) : 0;
                      const isOver90 = pct >= 90;

                      return (
                        <div key={shelter.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-gray-900 text-sm">{shelter.name}</h3>
                            <span className={`text-xs font-semibold ${isOver90 ? "text-red-600" : "text-gray-500"}`}>
                              {pct}% Full
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mb-2">Capacity: {shelter.capacity}</p>
                          <input
                            type="number"
                            value={current}
                            onChange={(e) => setShelterOccupancy({ ...shelterOccupancy, [shelter.id]: parseInt(e.target.value) || 0 })}
                            min={0}
                            max={shelter.capacity}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      );
                    })}
                  </div>

                  <button onClick={saveAllShelters} disabled={savingShelters}
                    className="w-full mt-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
                    {savingShelters ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Occupancy Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}
