/**
 * Nepal districts grouped by province.
 * Used in location selectors across "I'm Safe" and "Report Need" pages.
 */

export interface District {
  name: string;
  province: number;
}

export const NEPAL_DISTRICTS: District[] = [
  // Province 1 (Koshi)
  { name: "Taplejung", province: 1 },
  { name: "Panchthar", province: 1 },
  { name: "Ilam", province: 1 },
  { name: "Jhapa", province: 1 },
  { name: "Morang", province: 1 },
  { name: "Sunsari", province: 1 },
  { name: "Dhankuta", province: 1 },
  { name: "Terhathum", province: 1 },
  { name: "Sankhuwasabha", province: 1 },
  { name: "Bhojpur", province: 1 },
  { name: "Solukhumbu", province: 1 },
  { name: "Khotang", province: 1 },
  { name: "Udayapur", province: 1 },

  // Province 2 (Madhesh)
  { name: "Saptari", province: 2 },
  { name: "Siraha", province: 2 },
  { name: "Dhanusha", province: 2 },
  { name: "Mahottari", province: 2 },
  { name: "Sarlahi", province: 2 },
  { name: "Rautahat", province: 2 },
  { name: "Bara", province: 2 },
  { name: "Parsa", province: 2 },

  // Province 3 (Bagmati)
  { name: "Dolakha", province: 3 },
  { name: "Rasuwa", province: 3 },
  { name: "Sindhupalchok", province: 3 },
  { name: "Kavrepalanchok", province: 3 },
  { name: "Bhaktapur", province: 3 },
  { name: "Kathmandu", province: 3 },
  { name: "Lalitpur", province: 3 },
  { name: "Nuwakot", province: 3 },
  { name: "Makwanpur", province: 3 },
  { name: "Chitwan", province: 3 },

  // Province 4 (Gandaki)
  { name: "Gorkha", province: 4 },
  { name: "Manang", province: 4 },
  { name: "Mustang", province: 4 },
  { name: "Myagdi", province: 4 },
  { name: "Kaski", province: 4 },
  { name: "Lamjung", province: 4 },
  { name: "Tanahu", province: 4 },
  { name: "Nawalpur", province: 4 },
  { name: "Syangja", province: 4 },
  { name: "Parbat", province: 4 },
  { name: "Baglung", province: 4 },

  // Province 5 (Lumbini)
  { name: "Myagdi", province: 5 },
  { name: "Kaski", province: 5 },
  { name: "Tanahu", province: 5 },
  { name: "Parbat", province: 5 },
  { name: "Baglung", province: 5 },
  { name: "Gulmi", province: 5 },
  { name: "Arghakhanchi", province: 5 },
  { name: "Palpa", province: 5 },
  { name: "Rupandehi", province: 5 },
  { name: "Kapilvastu", province: 5 },
  { name: "Dang", province: 5 },
  { name: "Banke", province: 5 },
  { name: "Bardiya", province: 5 },

  // Province 6 (Karnali)
  { name: "Humla", province: 6 },
  { name: "Mugu", province: 6 },
  { name: "Dolpa", province: 6 },
  { name: "Jumla", province: 6 },
  { name: "Kalikot", province: 6 },
  { name: "Dailekh", province: 6 },
  { name: "Jajarkot", province: 6 },

  // Province 7 (Sudurpashchim)
  { name: "Baitadi", province: 7 },
  { name: "Darchula", province: 7 },
  { name: "Dadeldhura", province: 7 },
  { name: "Doti", province: 7 },
  { name: "Achham", province: 7 },
  { name: "Kailali", province: 7 },
  { name: "Kanchanpur", province: 7 },
];

// Deduplicated sorted list
export const UNIQUE_DISTRICTS = [
  ...new Set(NEPAL_DISTRICTS.map((d) => d.name)),
].sort();

// Approximate center coords for each district (for "GPS not available" fallback)
export const DISTRICT_COORDS: Record<string, { lat: number; lng: number }> = {
  Kathmandu: { lat: 27.7172, lng: 85.324 },
  Lalitpur: { lat: 27.6644, lng: 85.3188 },
  Bhaktapur: { lat: 27.671, lng: 85.4298 },
  Kavrepalanchok: { lat: 27.627, lng: 85.549 },
  Sindhupalchok: { lat: 27.945, lng: 85.637 },
  Dolakha: { lat: 27.838, lng: 86.034 },
  Rasuwa: { lat: 28.073, lng: 85.282 },
  Nuwakot: { lat: 27.931, lng: 85.162 },
  Makwanpur: { lat: 27.527, lng: 84.985 },
  Chitwan: { lat: 27.529, lng: 84.354 },
  Gorkha: { lat: 28.0, lng: 84.633 },
  Kaski: { lat: 28.209, lng: 83.986 },
  Tanahu: { lat: 27.934, lng: 84.417 },
  Lamjung: { lat: 28.233, lng: 84.39 },
  Syangja: { lat: 28.077, lng: 83.67 },
  Parbat: { lat: 28.197, lng: 83.69 },
  Baglung: { lat: 28.333, lng: 83.585 },
  Nawalpur: { lat: 27.69, lng: 84.2 },
  Gulmi: { lat: 28.083, lng: 83.417 },
  Palpa: { lat: 27.867, lng: 83.542 },
  Rupandehi: { lat: 27.5, lng: 83.467 },
  Kapilvastu: { lat: 27.55, lng: 83.05 },
  Dang: { lat: 28.0, lng: 82.3 },
  Banke: { lat: 28.1, lng: 81.633 },
  Bardiya: { lat: 28.35, lng: 81.55 },
  Jhapa: { lat: 26.583, lng: 87.933 },
  Morang: { lat: 26.5, lng: 87.217 },
  Sunsari: { lat: 26.55, lng: 87.0 },
  Saptari: { lat: 26.517, lng: 86.833 },
  Siraha: { lat: 26.65, lng: 86.2 },
  Dhanusha: { lat: 26.6, lng: 85.967 },
  Mahottari: { lat: 26.683, lng: 85.833 },
  Sarlahi: { lat: 26.817, lng: 85.517 },
  Rautahat: { lat: 26.933, lng: 85.183 },
  Bara: { lat: 26.95, lng: 85.05 },
  Parsa: { lat: 27.1, lng: 84.85 },
  Kailali: { lat: 28.717, lng: 80.983 },
  Kanchanpur: { lat: 28.883, lng: 80.183 },
  Doti: { lat: 29.05, lng: 80.933 },
  Achham: { lat: 29.133, lng: 81.333 },
  Dadeldhura: { lat: 29.3, lng: 80.583 },
  Baitadi: { lat: 29.517, lng: 80.55 },
  Darchula: { lat: 29.85, lng: 80.533 },
  Humla: { lat: 29.833, lng: 81.833 },
  Mugu: { lat: 29.517, lng: 82.083 },
  Dolpa: { lat: 29.2, lng: 82.95 },
  Jumla: { lat: 29.275, lng: 82.188 },
  Kalikot: { lat: 29.167, lng: 81.667 },
  Dailekh: { lat: 28.833, lng: 81.7 },
  Jajarkot: { lat: 28.783, lng: 82.183 },
};
