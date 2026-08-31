// ─── Shared types matching the Supabase schema ────────────────

export type CheckInStatus = "safe" | "need_help";

export type NeedCategory = "food" | "water" | "medical" | "shelter" | "transport";
export type NeedUrgency = "low" | "medium" | "high";
export type NeedStatus = "open" | "in_progress" | "resolved";

export type Availability = "available" | "busy" | "offline";

// ─── Public-facing rows (from restricted views) ───────────────

export interface PublicCheckIn {
  id: string;
  name: string | null;
  status: CheckInStatus;
  approx_lat: number;
  approx_lng: number;
  created_at: string;
}

export interface PublicNeed {
  id: string;
  category: NeedCategory;
  urgency: NeedUrgency;
  description: string;
  status: NeedStatus;
  is_assigned: boolean;
  approx_lat: number;
  approx_lng: number;
  created_at: string;
}

export interface PublicShelter {
  id: string;
  name: string;
  exact_lat: number;
  exact_lng: number;
  capacity: number;
  current_occupancy: number;
  created_at: string;
}

// ─── Full rows (backend / responder / admin views) ────────────

export interface CheckIn extends PublicCheckIn {
  phone: string | null;
  exact_lat: number;
  exact_lng: number;
}

export interface Need extends PublicNeed {
  name: string | null;
  phone: string | null;
  ai_suggested_category: NeedCategory | null;
  ai_suggested_urgency: NeedUrgency | null;
  exact_lat: number;
  exact_lng: number;
  assigned_responder_id: string | null;
}

export interface Responder {
  id: string;
  name: string;
  phone: string | null;
  skill: NeedCategory;
  coverage: string;
  availability: Availability;
  login_code: string;
  created_at: string;
}

export interface ShelterInventoryItem {
  id: string;
  shelter_id: string;
  item_name: string;
  quantity: number;
  unit: string;
  created_at: string;
}

// ─── Map pin (unified for Leaflet markers) ────────────────────

export type PinType = "check_in" | "need" | "shelter";

export interface MapPin {
  id: string;
  type: PinType;
  lat: number;
  lng: number;
  category?: NeedCategory;  // for needs
  urgency?: NeedUrgency;    // for needs
  status?: CheckInStatus | NeedStatus;
  label: string;
}
