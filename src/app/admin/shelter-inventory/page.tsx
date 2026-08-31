"use client";

import { useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Plus,
  Home,
  Save,
  AlertTriangle,
  Droplet,
  BriefcaseMedical,
  Package,
} from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  category: "Essentials" | "Medical" | "Equipment";
  quantity: number;
  lowStockThreshold: number;
}

interface Shelter {
  id: string;
  name: string;
  status: "Active" | "Inactive";
  capacity: number;
  inventory: InventoryItem[];
}

const INITIAL_SHELTERS: Shelter[] = [
  {
    id: "1",
    name: "Kathmandu Central Relief Center",
    status: "Active",
    capacity: 450,
    inventory: [
      { id: "1", name: "Clean Water (Litres)", category: "Essentials", quantity: 1200, lowStockThreshold: 200 },
      { id: "2", name: "Medical Kits", category: "Medical", quantity: 15, lowStockThreshold: 20 },
      { id: "3", name: "Blankets", category: "Essentials", quantity: 350, lowStockThreshold: 50 },
    ],
  },
  {
    id: "2",
    name: "Bhaktapur Temporary Shelter",
    status: "Active",
    capacity: 200,
    inventory: [
      { id: "4", name: "Clean Water (Litres)", category: "Essentials", quantity: 800, lowStockThreshold: 200 },
      { id: "5", name: "First Aid Kits", category: "Medical", quantity: 8, lowStockThreshold: 10 },
      { id: "6", name: "Tents", category: "Equipment", quantity: 45, lowStockThreshold: 15 },
    ],
  },
  {
    id: "3",
    name: "Gorkha Emergency Camp",
    status: "Active",
    capacity: 300,
    inventory: [
      { id: "7", name: "Rice (Kg)", category: "Essentials", quantity: 500, lowStockThreshold: 100 },
      { id: "8", name: "Torches", category: "Equipment", quantity: 120, lowStockThreshold: 30 },
    ],
  },
];

const CATEGORY_CONFIG = {
  Essentials: { color: "#0072B2", bg: "#0072B2", icon: Droplet },
  Medical: { color: "#c57199", bg: "#c57199", icon: BriefcaseMedical },
  Equipment: { color: "#6b7280", bg: "#6b7280", icon: Package },
};

export default function ShelterInventoryPage() {
  const [shelters, setShelters] = useState(INITIAL_SHELTERS);
  const [expandedId, setExpandedId] = useState<string | null>("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddItem, setShowAddItem] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({ name: "", category: "Essentials" as InventoryItem["category"], quantity: 0 });
  const [saved, setSaved] = useState(false);

  const filteredShelters = shelters.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.inventory.some((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  function toggleExpand(id: string) {
    setExpandedId(expandedId === id ? null : id);
  }

  function updateQuantity(shelterId: string, itemId: string, qty: number) {
    setShelters((prev) =>
      prev.map((s) =>
        s.id === shelterId
          ? {
              ...s,
              inventory: s.inventory.map((item) =>
                item.id === itemId ? { ...item, quantity: Math.max(0, qty) } : item
              ),
            }
          : s
      )
    );
  }

  function addItem(shelterId: string) {
    if (!newItem.name.trim()) return;
    const item: InventoryItem = {
      id: Date.now().toString(),
      name: newItem.name.trim(),
      category: newItem.category,
      quantity: newItem.quantity,
      lowStockThreshold: 10,
    };
    setShelters((prev) =>
      prev.map((s) =>
        s.id === shelterId ? { ...s, inventory: [...s.inventory, item] } : s
      )
    );
    setNewItem({ name: "", category: "Essentials", quantity: 0 });
    setShowAddItem(null);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Shelter Inventory Management
          </h1>
          <p className="text-gray-600">
            Monitor and update supplies across all active relief centers.
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search shelters or items..."
            className="pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0072B2] focus:border-transparent w-72"
          />
        </div>
      </div>

      {/* Shelter Cards */}
      <div className="space-y-4">
        {filteredShelters.map((shelter) => {
          const isExpanded = expandedId === shelter.id;
          return (
            <div
              key={shelter.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Shelter Header */}
              <button
                onClick={() => toggleExpand(shelter.id)}
                className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Home className="w-6 h-6 text-[#0072B2]" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-gray-900">
                      {shelter.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        {shelter.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        👥 {shelter.capacity} capacity
                      </span>
                    </div>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-gray-900">
                      Current Inventory
                    </h4>
                    <button
                      onClick={() =>
                        setShowAddItem(showAddItem === shelter.id ? null : shelter.id)
                      }
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-gray-300 text-sm font-semibold text-gray-600 hover:border-[#0072B2] hover:text-[#0072B2] transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Item
                    </button>
                  </div>

                  {/* Inventory Table */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      <div className="col-span-4">Item Name</div>
                      <div className="col-span-3">Category</div>
                      <div className="col-span-2">Quantity</div>
                      <div className="col-span-3 text-right">Status</div>
                    </div>

                    {/* Table Rows */}
                    {shelter.inventory.map((item) => {
                      const isLow = item.quantity <= item.lowStockThreshold;
                      const catConfig = CATEGORY_CONFIG[item.category];
                      const CatIcon = catConfig.icon;
                      return (
                        <div
                          key={item.id}
                          className={`grid grid-cols-12 gap-4 px-6 py-4 items-center border-t border-gray-100 ${
                            isLow ? "bg-yellow-50" : ""
                          }`}
                        >
                          <div className="col-span-4 font-medium text-gray-900">
                            {item.name}
                          </div>
                          <div className="col-span-3">
                            <span
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-white"
                              style={{ backgroundColor: catConfig.bg }}
                            >
                              <CatIcon className="w-3.5 h-3.5" />
                              {item.category}
                            </span>
                          </div>
                          <div className="col-span-2">
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(
                                  shelter.id,
                                  item.id,
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="w-24 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0072B2] focus:border-transparent text-sm font-medium"
                            />
                          </div>
                          <div className="col-span-3 text-right">
                            {isLow ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                Low Stock
                              </span>
                            ) : (
                              <span className="text-sm font-medium text-green-600">
                                Adequate
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {shelter.inventory.length === 0 && (
                      <div className="px-6 py-8 text-center text-gray-400 text-sm">
                        No items in inventory. Click &quot;Add Item&quot; to get started.
                      </div>
                    )}
                  </div>

                  {/* Add Item Form */}
                  {showAddItem === shelter.id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h5 className="text-sm font-bold text-gray-900 mb-3">
                        Add New Item
                      </h5>
                      <div className="grid grid-cols-12 gap-4">
                        <input
                          type="text"
                          value={newItem.name}
                          onChange={(e) =>
                            setNewItem({ ...newItem, name: e.target.value })
                          }
                          placeholder="Item name"
                          className="col-span-4 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0072B2] focus:border-transparent text-sm"
                        />
                        <select
                          value={newItem.category}
                          onChange={(e) =>
                            setNewItem({
                              ...newItem,
                              category: e.target.value as InventoryItem["category"],
                            })
                          }
                          className="col-span-3 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0072B2] focus:border-transparent text-sm bg-white"
                        >
                          <option value="Essentials">Essentials</option>
                          <option value="Medical">Medical</option>
                          <option value="Equipment">Equipment</option>
                        </select>
                        <input
                          type="number"
                          value={newItem.quantity}
                          onChange={(e) =>
                            setNewItem({
                              ...newItem,
                              quantity: parseInt(e.target.value) || 0,
                            })
                          }
                          placeholder="Qty"
                          className="col-span-2 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0072B2] focus:border-transparent text-sm"
                        />
                        <button
                          onClick={() => addItem(shelter.id)}
                          className="col-span-3 px-4 py-2 rounded-lg bg-[#0072B2] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                        >
                          Add to Inventory
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Save Button */}
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-bold transition-opacity hover:opacity-90"
                      style={{ backgroundColor: "#0072B2" }}
                    >
                      {saved ? (
                        <>✓ Saved!</>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
