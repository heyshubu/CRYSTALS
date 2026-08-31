"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Loader2,
  Sparkles,
  CheckCircle2,
  Building2,
  Package,
  Edit3,
  Trash2,
  Key,
  Copy,
  AlertCircle,
  MapPin,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/hooks/use-session";

import { useTheme } from "@/lib/theme-context";
import { CATEGORY_CONFIG, URGENCY_CONFIG, getCategoryColor, getUrgencyColor } from "@/lib/map-icons";
import dynamic from "next/dynamic";
const DashboardMap = dynamic(() => import("@/components/DashboardMap").then(m => ({ default: m.DashboardMap })), { ssr: false });
import { UrgencyBadge, AvailabilityIndicator } from "@/components/UrgencyBadge";
import type {
  Need,
  Responder,
  PublicShelter,
  ShelterInventoryItem,
  NeedCategory,
  NeedUrgency,
} from "@/lib/types";

const URGENCY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };
const SKILLS: NeedCategory[] = ["food", "water", "medical", "shelter", "transport"];

export default function SuperadminPage() {
  const router = useRouter();
  const { session, mounted } = useSession();
  const { theme } = useTheme();
  // Data state
  const [responders, setResponders] = useState<Responder[]>([]);
  const [needs, setNeeds] = useState<Need[]>([]);
  const [shelters, setShelters] = useState<PublicShelter[]>([]);
  const [inventory, setInventory] = useState<ShelterInventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [activeTab, setActiveTab] = useState<"roster" | "needs" | "inventory" | "shelters">("roster");
  const [showAddResponder, setShowAddResponder] = useState(false);
  const [newResp, setNewResp] = useState({ name: "", phone: "", skill: "food" as NeedCategory, coverage: "" });
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Inventory state
  const [selectedShelter, setSelectedShelter] = useState<string>("");
  const [newItem, setNewItem] = useState({ item_name: "", quantity: 0, unit: "units" });
  const [editingItem, setEditingItem] = useState<string | null>(null);

  // Match state
  const [matchSuggestions, setMatchSuggestions] = useState<
    Record<string, Responder | null>
  >({});

  // Shelter creation state
  const [showAddShelter, setShowAddShelter] = useState(false);
  const [newShelter, setNewShelter] = useState({ name: "", lat: 0, lng: 0, capacity: 50 });

  // ── Shelter actions
  const addShelter = async () => {
    setActionLoading("add-shelter");
    const res = await fetch("/api/data/shelters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newShelter),
    });
    const data = await res.json();
    if (res.ok && data.shelter) {
      setShelters((prev) => [...prev, data.shelter].sort((a, b) => a.name.localeCompare(b.name)));
      setShowAddShelter(false);
      setNewShelter({ name: "", lat: 0, lng: 0, capacity: 50 });
    } else {
      alert(data.error || "Failed to create shelter.");
    }
    setActionLoading(null);
  };

  // ── Fetch data ─────────────────────────────────────────────
  useEffect(() => {
    if (!session || session.role !== "superadmin") return;

    const fetchData = async () => {
      setLoading(true);
      const [respRes, needsRes, sheltersRes, invRes] = await Promise.all([
        fetch("/api/admin/responders").then((r) => r.json()),
        fetch("/api/data/needs").then((r) => r.json()),
        fetch("/api/data/shelters").then((r) => r.json()),
        fetch("/api/admin/inventory").then((r) => r.json()),
      ]);

      if (respRes.responders) setResponders(respRes.responders);
      if (Array.isArray(needsRes)) {
        setNeeds(
          (needsRes as Need[]).sort(
            (a, b) => (URGENCY_ORDER[a.urgency] ?? 2) - (URGENCY_ORDER[b.urgency] ?? 2)
          )
        );
      }
      if (Array.isArray(sheltersRes)) {
        setShelters(sheltersRes as PublicShelter[]);
        if (sheltersRes.length > 0 && !selectedShelter) {
          setSelectedShelter(sheltersRes[0].id);
        }
      }
      if (invRes.items) setInventory(invRes.items);
      setLoading(false);
    };

    fetchData();
  }, [session]);

  // ── Responder actions ──────────────────────────────────────
  const addResponder = async () => {
    setActionLoading("add-resp");
    const res = await fetch("/api/admin/responders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newResp),
    });
    const data = await res.json();
    if (res.ok && data.responder) {
      setResponders((prev) => [...prev, data.responder].sort((a, b) => a.name.localeCompare(b.name)));
      setShowAddResponder(false);
      setNewResp({ name: "", phone: "", skill: "food", coverage: "" });
    } else {
      alert(data.error || "Failed to add responder.");
    }
    setActionLoading(null);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // ── Matching actions ───────────────────────────────────────
  const getSuggestion = async (needId: string) => {
    setActionLoading(`match-${needId}`);
    const res = await fetch("/api/admin/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ needId }),
    });
    const data = await res.json();
    setMatchSuggestions((prev) => ({ ...prev, [needId]: data.suggestedResponder }));
    setActionLoading(null);
  };

  const acceptSuggestion = async (needId: string, responderId: string) => {
    setActionLoading(`assign-${needId}`);
    const res = await fetch("/api/admin/match", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ needId, responderId }),
    });
    if (res.ok) {
      setNeeds((prev) => prev.filter((n) => n.id !== needId));
      // Refresh responders (availability may have changed)
      const respRes = await fetch("/api/admin/responders").then((r) => r.json());
      if (respRes.responders) setResponders(respRes.responders);
    } else {
      const data = await res.json();
      alert(data.error || "Failed to assign.");
    }
    setActionLoading(null);
  };

  // ── Inventory actions ──────────────────────────────────────
  const saveItem = async () => {
    if (!selectedShelter || !newItem.item_name) return;
    setActionLoading("inventory");
    const res = await fetch("/api/admin/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shelter_id: selectedShelter, ...newItem }),
    });
    if (res.ok) {
      const invRes = await fetch("/api/admin/inventory").then((r) => r.json());
      if (invRes.items) setInventory(invRes.items);
      setNewItem({ item_name: "", quantity: 0, unit: "units" });
      setEditingItem(null);
    }
    setActionLoading(null);
  };

  const deleteItem = async (itemId: string) => {
    const res = await fetch("/api/admin/inventory", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId }),
    });
    if (res.ok) {
      setInventory((prev) => prev.filter((i) => i.id !== itemId));
    }
  };

  // Show consistent loading placeholder until localStorage is read (avoids hydration mismatch)
  if (!mounted) {
    return (
      <div className="p-4 max-w-lg mx-auto flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  // ── Redirect to login if not authenticated ───
  if (!session || session.role !== "superadmin") {
    return (
      <div className="p-4 max-w-lg mx-auto flex flex-col items-center justify-center min-h-[60vh]">
        <Key className="w-12 h-12 text-purple-400 mb-4" />
        <h1 className="text-xl font-bold mb-2">Coordinator Access Required</h1>
        <p className="text-gray-500 text-sm mb-6">Please sign in with your coordinator passcode.</p>
        <button onClick={() => router.push("/login")} className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700">
          Go to Login
        </button>
      </div>
    );
  }

  // ── Dashboard ──────────────────────────────────────────────
  const unassignedNeeds = needs.filter((n) => !n.is_assigned);
  const totalAssigned = needs.filter((n) => n.is_assigned).length;
  const availableResponders = responders.filter((r) => r.availability === "available").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header with stats */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Coordinator Dashboard</h1>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500">Responders</p>
            <p className="text-2xl font-bold text-gray-900">{responders.length}</p>
            <p className="text-[10px] text-green-600">{availableResponders} available</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500">Open Needs</p>
            <p className="text-2xl font-bold text-orange-600">{unassignedNeeds.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500">Assigned</p>
            <p className="text-2xl font-bold text-blue-600">{totalAssigned}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500">Shelters</p>
            <p className="text-2xl font-bold text-purple-600">{shelters.length}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "roster" as const, label: "Responders", icon: Users, count: responders.length },
          { key: "needs" as const, label: "Needs", icon: AlertCircle, count: unassignedNeeds.length },
          { key: "shelters" as const, label: "Shelters", icon: Building2, count: shelters.length },
          { key: "inventory" as const, label: "Inventory", icon: Package },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-sm font-medium border transition ${
              activeTab === tab.key
                ? "border-purple-500 bg-purple-50 text-purple-700"
                : "border-gray-200 text-gray-500"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.count !== undefined && (
              <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 rounded-full">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Dashboard Map — responder mode with exact locations */}
      {!loading && (
        <DashboardMap
          needs={needs}
          checkIns={[]}
          shelters={shelters}
          actions={unassignedNeeds.slice(0, 5).map((n) => (
            { label: `✨ Assign (${n.category})`, onClick: () => { setActiveTab("needs"); }, variant: "primary" as const }
          ))}
        />
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        </div>
      ) : (
        <>
          {/* ── ROSTER TAB ──────────────────────────────── */}
          {activeTab === "roster" && (
            <div>
              <button
                onClick={() => setShowAddResponder(!showAddResponder)}
                className="w-full mb-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Responder
              </button>

              {showAddResponder && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-4">
                  <h3 className="font-semibold mb-3">New Responder</h3>
                  <input
                    type="text"
                    value={newResp.name}
                    onChange={(e) => setNewResp({ ...newResp, name: e.target.value })}
                    placeholder="Name *"
                    className="w-full px-3 py-2 border rounded-lg text-sm mb-2"
                  />
                  <input
                    type="tel"
                    value={newResp.phone}
                    onChange={(e) => setNewResp({ ...newResp, phone: e.target.value })}
                    placeholder="Phone (optional)"
                    className="w-full px-3 py-2 border rounded-lg text-sm mb-2"
                  />
                  <select
                    value={newResp.skill}
                    onChange={(e) => setNewResp({ ...newResp, skill: e.target.value as NeedCategory })}
                    className="w-full px-3 py-2 border rounded-lg text-sm mb-2"
                  >
                    {SKILLS.map((s) => (
                      <option key={s} value={s}>
                        {CATEGORY_CONFIG[s].emoji} {s}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={newResp.coverage}
                    onChange={(e) => setNewResp({ ...newResp, coverage: e.target.value })}
                    placeholder="Coverage area (e.g. Kathmandu) *"
                    className="w-full px-3 py-2 border rounded-lg text-sm mb-3"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={addResponder}
                      disabled={actionLoading === "add-resp" || !newResp.name || !newResp.coverage}
                      className="flex-1 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                    >
                      {actionLoading === "add-resp" ? (
                        <Loader2 className="inline w-4 h-4 animate-spin" />
                      ) : (
                        "Create & Generate Code"
                      )}
                    </button>
                    <button
                      onClick={() => setShowAddResponder(false)}
                      className="px-4 py-2 text-gray-500 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {responders.map((r) => (
                  <div
                    key={r.id}
                    className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-gray-50">
                          {CATEGORY_CONFIG[r.skill as NeedCategory]?.emoji}
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm text-gray-900">{r.name}</h3>
                          <p className="text-xs text-gray-500">{r.coverage} · {r.skill}</p>
                        </div>
                      </div>
                      <AvailabilityIndicator availability={r.availability} />
                    </div>
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
                      <Key className="w-3 h-3 text-gray-400" />
                      <code className="text-xs bg-gray-100 px-2 py-0.5 rounded font-mono">
                        {r.login_code}
                      </code>
                      <button
                        onClick={() => copyCode(r.login_code)}
                        className="text-xs text-blue-600 hover:underline flex items-center gap-0.5 ml-auto"
                      >
                        <Copy className="w-3 h-3" />
                        {copiedCode === r.login_code ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── NEEDS TAB ───────────────────────────────── */}
          {activeTab === "needs" && (
            <div>
              {unassignedNeeds.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No unassigned needs.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {unassignedNeeds.map((need) => {
                    const suggestion = matchSuggestions[need.id];
                    return (
                      <div
                        key={need.id}
                        className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">
                            {CATEGORY_CONFIG[need.category as NeedCategory]?.emoji}
                          </span>
                          <span className="font-semibold text-sm capitalize">{need.category}</span>
                          <UrgencyBadge urgency={need.urgency} />
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{need.description}</p>

                        {/* Get suggestion button */}
                        {!suggestion && (
                          <button
                            onClick={() => getSuggestion(need.id)}
                            disabled={actionLoading === `match-${need.id}`}
                            className="w-full py-2 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-sm font-medium hover:bg-purple-100 flex items-center justify-center gap-2"
                          >
                            {actionLoading === `match-${need.id}` ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Sparkles className="w-4 h-4" />
                            )}
                            Suggest Best Match
                          </button>
                        )}

                        {/* Suggestion result */}
                        {suggestion && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm">
                                  {CATEGORY_CONFIG[suggestion.skill as NeedCategory]?.emoji}
                                </span>
                                <span className="font-medium text-sm">{suggestion.name}</span>
                                <span className="text-xs text-gray-500">{suggestion.coverage}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => acceptSuggestion(need.id, suggestion.id)}
                              disabled={actionLoading === `assign-${need.id}`}
                              className="w-full py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                              {actionLoading === `assign-${need.id}` ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <CheckCircle2 className="w-4 h-4" />
                              )}
                              Accept & Assign
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── SHELTERS TAB ───────────────────────────── */}
          {activeTab === "shelters" && (
            <div>
              <button
                onClick={() => setShowAddShelter(!showAddShelter)}
                className="w-full mb-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Shelter
              </button>

              {showAddShelter && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-4">
                  <h3 className="font-semibold mb-3 text-sm">New Shelter</h3>
                  <input
                    type="text"
                    value={newShelter.name}
                    onChange={(e) => setNewShelter({ ...newShelter, name: e.target.value })}
                    placeholder="Shelter name *"
                    className="w-full px-3 py-2 border rounded-lg text-sm mb-2"
                  />
                  <div className="flex gap-2 mb-2">
                    <input
                      type="number"
                      step="any"
                      value={newShelter.lat || ""}
                      onChange={(e) => setNewShelter({ ...newShelter, lat: parseFloat(e.target.value) || 0 })}
                      placeholder="Latitude *"
                      className="flex-1 px-3 py-2 border rounded-lg text-sm"
                    />
                    <input
                      type="number"
                      step="any"
                      value={newShelter.lng || ""}
                      onChange={(e) => setNewShelter({ ...newShelter, lng: parseFloat(e.target.value) || 0 })}
                      placeholder="Longitude *"
                      className="flex-1 px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                  <input
                    type="number"
                    value={newShelter.capacity}
                    onChange={(e) => setNewShelter({ ...newShelter, capacity: parseInt(e.target.value) || 0 })}
                    min={1}
                    placeholder="Capacity *"
                    className="w-full px-3 py-2 border rounded-lg text-sm mb-3"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={addShelter}
                      disabled={actionLoading === "add-shelter" || !newShelter.name || !newShelter.capacity}
                      className="flex-1 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                    >
                      {actionLoading === "add-shelter" ? <Loader2 className="inline w-4 h-4 animate-spin" /> : "Create"}
                    </button>
                    <button
                      onClick={() => setShowAddShelter(false)}
                      className="px-4 py-2 text-gray-500 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Shelter list */}
              <div className="space-y-3">
                {shelters.map((s) => (
                  <div key={s.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-purple-600" />
                        <h3 className="font-semibold text-sm text-gray-900">{s.name}</h3>
                      </div>
                      <span className="text-xs text-gray-500">
                        {s.current_occupancy}/{s.capacity} ({Math.round((s.current_occupancy / s.capacity) * 100)}%)
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <MapPin className="w-3 h-3" />
                      {s.exact_lat.toFixed(4)}, {s.exact_lng.toFixed(4)}
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 mt-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          s.current_occupancy / s.capacity >= 0.9 ? "bg-red-500" : s.current_occupancy / s.capacity >= 0.7 ? "bg-orange-500" : "bg-green-500"
                        }`}
                        style={{ width: `${Math.min(100, Math.round((s.current_occupancy / s.capacity) * 100))}%` }}
                      />
                    </div>
                  </div>
                ))}
                {shelters.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <Building2 className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p>No shelters yet. Create one above.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── INVENTORY TAB ───────────────────────────── */}
          {activeTab === "inventory" && (
            <div>
              {/* Shelter selector */}
              <select
                value={selectedShelter}
                onChange={(e) => setSelectedShelter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4"
              >
                {shelters.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.current_occupancy}/{s.capacity})
                  </option>
                ))}
              </select>

              {/* Current items */}
              <div className="space-y-3 mb-4">
                {inventory
                  .filter((i) => i.shelter_id === selectedShelter)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-medium text-sm">{item.item_name}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          {item.quantity} {item.unit}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingItem(item.id);
                            setNewItem({
                              item_name: item.item_name,
                              quantity: item.quantity,
                              unit: item.unit,
                            });
                          }}
                          className="text-blue-600 hover:underline"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="text-red-500 hover:underline"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                {inventory.filter((i) => i.shelter_id === selectedShelter).length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">No items yet.</p>
                )}
              </div>

              {/* Add/edit item form */}
              <div className="bg-gray-50 border rounded-xl p-4">
                <h3 className="font-semibold text-sm mb-3">
                  {editingItem ? "Edit Item" : "Add Item"}
                </h3>
                <input
                  type="text"
                  value={newItem.item_name}
                  onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })}
                  placeholder="Item name (e.g. Blankets) *"
                  className="w-full px-3 py-2 border rounded-lg text-sm mb-2"
                />
                <div className="flex gap-2 mb-3">
                  <input
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                    min={0}
                    placeholder="Quantity"
                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                  />
                  <input
                    type="text"
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    placeholder="Unit"
                    className="w-24 px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={saveItem}
                    disabled={actionLoading === "inventory" || !newItem.item_name}
                    className="flex-1 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                  >
                    {actionLoading === "inventory" ? (
                      <Loader2 className="inline w-4 h-4 animate-spin" />
                    ) : editingItem ? (
                      "Update"
                    ) : (
                      "Add"
                    )}
                  </button>
                  {editingItem && (
                    <button
                      onClick={() => {
                        setEditingItem(null);
                        setNewItem({ item_name: "", quantity: 0, unit: "units" });
                      }}
                      className="px-4 py-2 text-gray-500 text-sm"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
