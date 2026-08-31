"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle2, AlertTriangle, MapPin, Loader2, LogOut, Building2,
  Phone, ChevronDown, ChevronUp, Hand, CheckSquare,
} from "lucide-react";
import { useSession, type ResponderSession } from "@/frontend/use-session";
import { useTheme } from "@/frontend/theme-context";
import { CATEGORY_CONFIG, URGENCY_CONFIG, getCategoryColor, getUrgencyColor } from "@/frontend/map-icons";
import dynamic from "next/dynamic";
const DashboardMap = dynamic(() => import("@/frontend/DashboardMap").then(m => ({ default: m.DashboardMap })), { ssr: false });
import { UrgencyBadge, AvailabilityIndicator, OccupancyBar } from "@/frontend/UrgencyBadge";
import type { Need, PublicShelter, NeedCategory, NeedUrgency } from "@/shared/types";

const URGENCY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };

export default function ResponderPage() {
  const { session, mounted, login, logout } = useSession();
  const { theme } = useTheme();
  const [code, setCode] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const responder = (session as ResponderSession)?.responder;

  const [needs, setNeeds] = useState<Need[]>([]);
  const [assignedTask, setAssignedTask] = useState<Need | null>(null);
  const [shelters, setShelters] = useState<PublicShelter[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [availability, setAvailability] = useState(responder?.availability || "available");
  const [showShelters, setShowShelters] = useState(false);
  const [editingShelter, setEditingShelter] = useState<string | null>(null);
  const [newOccupancy, setNewOccupancy] = useState(0);

  const handleLogin = async () => {
    if (!code.trim()) return;
    setLoggingIn(true);
    setLoginError("");
    const result = await login(code.trim());
    setLoggingIn(false);
    if (result.error) setLoginError(result.error);
  };

  const fetchData = async () => {
    if (!responder) return;
    try {
      const [needsRes, taskRes, sheltersRes] = await Promise.all([
        fetch("/api/data/needs?full=true").then((r) => r.json()),
        fetch(`/api/responder/task?responderId=${responder.id}`).then((r) => r.json()),
        fetch("/api/data/shelters").then((r) => r.json()),
      ]);
      if (Array.isArray(needsRes)) {
        setNeeds(needsRes.sort((a: Need, b: Need) => (URGENCY_ORDER[a.urgency] ?? 2) - (URGENCY_ORDER[b.urgency] ?? 2)));
      }
      if (taskRes.task) setAssignedTask(taskRes.task);
      if (Array.isArray(sheltersRes)) setShelters(sheltersRes);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => {
    if (!responder) return;
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [responder]);

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
    if (res.ok) fetchData();
    else { const d = await res.json(); alert(d.error || "Failed."); }
    setActionLoading(null);
  };

  const toggleAvailability = async (a: string) => {
    if (!responder) return;
    const res = await fetch("/api/responder/availability", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ responderId: responder.id, availability: a }) });
    if (res.ok) setAvailability(a);
  };

  const updateShelterOccupancy = async (sid: string) => {
    const res = await fetch("/api/responder/shelter", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ shelterId: sid, current_occupancy: newOccupancy }) });
    if (res.ok) { setShelters((prev) => prev.map((s) => s.id === sid ? { ...s, current_occupancy: newOccupancy } : s)); setEditingShelter(null); }
  };

  if (!mounted) {
    return (<div className="p-4 max-w-lg mx-auto flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>);
  }

  if (!session) {
    return (
      <div className="p-4 max-w-lg mx-auto flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4"><CheckSquare className="w-6 h-6 text-blue-600" /></div>
        <h1 className="text-xl font-bold mb-2">Responder Login</h1>
        <p className="text-gray-500 text-sm mb-6">Enter your personal access code.</p>
        <input type="text" value={code} onChange={(e) => { setCode(e.target.value); setLoginError(""); }}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          placeholder="Your access code" className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 text-center text-lg tracking-widest" />
        {loginError && <p className="text-red-500 text-sm mb-4">{loginError}</p>}
        <button onClick={handleLogin} disabled={loggingIn} className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50">
          {loggingIn ? <Loader2 className="inline w-5 h-5 animate-spin" /> : "Enter"}
        </button>
      </div>
    );
  }

  const unassignedNeeds = needs.filter((n) => !n.is_assigned && n.status === "open");

  // Availability button styles with theme-aware colors + icon
  const availStyles: Record<string, { active: string; inactive: string; icon: string }> = {
    available: { active: `border-2 bg-opacity-10`, inactive: "border-gray-200 text-gray-500", icon: "✓" },
    busy:      { active: `border-2 bg-opacity-10`, inactive: "border-gray-200 text-gray-500", icon: "⏸" },
    offline:   { active: `border-2 bg-opacity-10`, inactive: "border-gray-200 text-gray-500", icon: "⊘" },
  };

  const availColors: Record<string, Record<string, string>> = {
    available: { default: "#22c55e", colorblind: "#009988", "high-contrast": "#008844" },
    busy:      { default: "#f97316", colorblind: "#ee7733", "high-contrast": "#ee6600" },
    offline:   { default: "#6b7280", colorblind: "#555555", "high-contrast": "#333333" },
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold">Welcome, {responder?.name}</h1>
          <p className="text-xs text-gray-400">{responder?.skill} · {responder?.coverage}</p>
        </div>
        <button onClick={logout} className="p-2 text-gray-400 hover:text-gray-600"><LogOut className="w-5 h-5" /></button>
      </div>

      {/* Availability toggle — icon + text for non-color redundancy */}
      <div className="flex gap-2 mb-6">
        {["available", "busy", "offline"].map((a) => {
          const c = availColors[a][theme];
          return (
            <button key={a} onClick={() => toggleAvailability(a)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition capitalize flex items-center justify-center gap-1 ${
                availability === a ? "" : "border-gray-200 text-gray-500"
              }`}
              style={availability === a ? { borderColor: c, backgroundColor: c + "15", color: c } : undefined}
            >
              {availStyles[a].icon} {a}
            </button>
          );
        })}
      </div>

      {/* Dashboard Map — responder mode with exact locations */}
      {!loading && (
        <DashboardMap
          needs={needs}
          checkIns={[]}
          shelters={shelters}
          actions={assignedTask ? [
            { label: "✓ Mark Complete", onClick: () => markComplete(assignedTask.id), variant: "success" as const }
          ] : unassignedNeeds.slice(0, 5).map((n) => (
            { label: `🤚 Pick Up (${n.category})`, onClick: () => pickUpNeed(n.id), variant: "primary" as const, disabled: !!assignedTask }
          ))}
        />
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
      ) : (
        <>
          {assignedTask && (
            <div className="mb-6">
              <h2 className="font-semibold text-gray-800 mb-2 flex items-center gap-2"><CheckSquare className="w-5 h-5 text-blue-600" />My Assigned Task</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{CATEGORY_CONFIG[assignedTask.category as NeedCategory]?.emoji}</span>
                  <span className="font-semibold capitalize">{assignedTask.category}</span>
                  <UrgencyBadge urgency={assignedTask.urgency} />
                </div>
                <p className="text-sm text-gray-600 mb-2">{assignedTask.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{assignedTask.exact_lat?.toFixed(4)}, {assignedTask.exact_lng?.toFixed(4)}</span>
                  {assignedTask.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{assignedTask.phone}</span>}
                </div>
                <button onClick={() => markComplete(assignedTask.id)} disabled={actionLoading === assignedTask.id}
                  className="w-full py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2">
                  {actionLoading === assignedTask.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Mark Complete
                </button>
              </div>
            </div>
          )}

          {unassignedNeeds.length > 0 && (
            <div className="mb-6">
              <h2 className="font-semibold text-gray-800 mb-2 flex items-center gap-2"><Hand className="w-5 h-5 text-orange-600" />Available to Pick Up ({unassignedNeeds.length})</h2>
              <div className="space-y-3">
                {unassignedNeeds.map((need) => (
                  <div key={need.id} className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <span>{CATEGORY_CONFIG[need.category as NeedCategory]?.emoji}</span>
                      <span className="font-medium capitalize text-sm">{need.category}</span>
                      <UrgencyBadge urgency={need.urgency} />
                    </div>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{need.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3" />{need.exact_lat?.toFixed(3)}, {need.exact_lng?.toFixed(3)}</span>
                      <button onClick={() => pickUpNeed(need.id)} disabled={actionLoading === need.id || !!assignedTask}
                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1">
                        {actionLoading === need.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Hand className="w-3 h-3" />}Pick Up
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <h2 className="font-semibold text-gray-800 mb-2 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-gray-600" />All Needs ({needs.length})</h2>
            <div className="space-y-2">
              {needs.map((need) => (
                <div key={need.id}
                  className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3">
                  <span className="text-lg">{CATEGORY_CONFIG[need.category as NeedCategory]?.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm capitalize">{need.category}</span>
                      <UrgencyBadge urgency={need.urgency} />
                      {need.is_assigned && <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">Assigned</span>}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{need.description}</p>
                  </div>
                  <MapPin className="w-4 h-4 text-gray-300 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Shelter Occupancy */}
          <div>
            <button onClick={() => setShowShelters(!showShelters)} className="flex items-center gap-2 font-semibold text-gray-800 mb-2 w-full">
              <Building2 className="w-5 h-5 text-purple-600" />Shelter Occupancy
              {showShelters ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
            </button>
            {showShelters && (
              <div className="space-y-3">
                {shelters.map((shelter) => {
                  const editing = editingShelter === shelter.id;
                  return (
                    <div key={shelter.id} className="bg-white border border-gray-200 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-medium text-sm">{shelter.name}</h3>
                          <p className="text-xs text-gray-400">{shelter.current_occupancy}/{shelter.capacity}</p>
                        </div>
                        {!editing && <button onClick={() => { setEditingShelter(shelter.id); setNewOccupancy(shelter.current_occupancy); }} className="text-xs text-blue-600 hover:underline">Edit</button>}
                      </div>
                      <OccupancyBar current={shelter.current_occupancy} capacity={shelter.capacity} />
                      {editing && (
                        <div className="flex gap-2 mt-2">
                          <input type="number" value={newOccupancy} onChange={(e) => setNewOccupancy(parseInt(e.target.value) || 0)} min={0} max={shelter.capacity} className="flex-1 px-3 py-1.5 border rounded-lg text-sm" />
                          <button onClick={() => updateShelterOccupancy(shelter.id)} className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg">Save</button>
                          <button onClick={() => setEditingShelter(null)} className="px-3 py-1.5 text-gray-500 text-sm">Cancel</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>


        </>
      )}
    </div>
  );
}
