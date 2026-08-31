/**
 * Fuzz a location by ~300 meters in a random direction.
 * Used server-side before writing to the database.
 *
 * Returns both the original (exact) and fuzzed (approximate) coordinates.
 */
export interface FuzzedLocation {
  exact_lat: number;
  exact_lng: number;
  approx_lat: number;
  approx_lng: number;
}

export function fuzzLocation(
  lat: number,
  lng: number,
  maxOffsetMeters: number = 300
): FuzzedLocation {
  const angle = Math.random() * 2 * Math.PI;
  const distance = Math.random() * maxOffsetMeters;

  // 111,320 meters per degree of latitude
  const dLat = (distance / 111320) * Math.cos(angle);
  // Longitude offset adjusted by cos(latitude)
  const dLng = (distance / (111320 * Math.cos((lat * Math.PI) / 180))) * Math.sin(angle);

  return {
    exact_lat: lat,
    exact_lng: lng,
    approx_lat: Math.round((lat + dLat) * 1e6) / 1e6,
    approx_lng: Math.round((lng + dLng) * 1e6) / 1e6,
  };
}
