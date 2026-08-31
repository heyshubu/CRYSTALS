"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Loader2,
  LogOut,
  Sparkles,
  Hand,
  CheckCircle2,
  Building2,
  Package,
  ChevronDown,
  ChevronUp,
  Edit3,
  Trash2,
  Key,
  Copy,
  AlertCircle,
} from "lucide-react";
import { useSession } from "@/lib/hooks/use-session";

import { useTheme } from "@/lib/theme-context";
import { CATEGORY_CONFIG, URGENCY_CONFIG, getCategoryColor, getUrgencyColor } from "@/lib/map-icons";
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
  const { session, mounted, login, logout } = useSession();
  const { theme } = useTheme();
  const [code, setCode] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  // Data state
  const [responders, setResponders] = useState<Responder[]>([]);
  const [needs, setNeeds] = useState<Need[]>([]);
  const [shelters, setShelters] = useState<PublicShelter[]>([]);
  const [inventory, setInventory] = useState<ShelterInventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [activeTab, setActiveTab] = useState<"roster" | "needs" | "inventory">("roster");
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

  // ── Login handler ──────────────────────────────────────────
  const handleLogin = async () => {
    if (!code.trim()) return;
    setLoggingIn(true);
    setLoginError("");
    const result = await login(code.trim());
    setLoggingIn(false);
    if (result.error) setLoginError(result.error);
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

  // ── Login screen ───────────────────────────────────────────
  if (!session || session.role !== "superadmin") {
    return (
      <div className="p-4 max-w-lg mx-auto flex flex-col items-center justify-center min-h-[60vh]">
        <Key className="w-12 h-12 text-purple-600 mb-4" />
        <h1 className="text-xl font-bold mb-2">Superadmin Login</h1>
        <p className="text-gray-500 text-sm mb-6">
          Enter the coordinator passcode.
        </p>
        <input
          type="password"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setLoginError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          placeholder="Coordinator passcode"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 text-center text-lg tracking-widest"
        />
        {loginError && (
          <p className="text-red-500 text-sm mb-4">{loginError}</p>
        )}
        <button
          onClick={handleLogin}
          disabled={loggingIn}
          className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50"
        >
          {loggingIn ? (
            <Loader2 className="inline w-5 h-5 animate-spin" />
          ) : (
            "Enter"
          )}
        </button>
      </div>
    );
  }

  // ── Dashboard ──────────────────────────────────────────────
  const unassignedNeeds = needs.filter((n) => !n.is_assigned);

  return (
    <div className="p-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Superadmin Dashboard</h1>
        <button onClick={logout} className="p-2 text-gray-400 hover:text-gray-600">
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "roster" as const, label: "Responders", icon: Users, count: responders.length },
          { key: "needs" as const, label: "Needs", icon: AlertCircle, count: unassignedNeeds.length },
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
                    className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{CATEGORY_CONFIG[r.skill as NeedCategory]?.emoji}</span>
                        <div>
                          <h3 className="font-semibold text-sm">{r.name}</h3>
                          <p className="text-xs text-gray-400">{r.coverage}</p>
                        </div>
                      </div>
                      <AvailabilityIndicator availability={r.availability} />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Key className="w-3 h-3 text-gray-400" />
                      <code className="text-xs bg-gray-100 px-2 py-0.5 rounded font-mono">
                        {r.login_code}
                      </code>
                      <button
                        onClick={() => copyCode(r.login_code)}
                        className="text-xs text-blue-600 hover:underline flex items-center gap-0.5"
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
