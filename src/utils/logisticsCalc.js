// Logistics cost estimation logic for the Harga Logistik calculator.
//
// Distance: estimated using the haversine (great-circle) formula between two
// cities' coordinates, then scaled by a road-distance factor since actual
// roads are never a straight line. This is an ESTIMATE only.
//
// Cost formula (from internal rate sheet):
//   - First 80km (or less) = flat "based cost"
//   - Beyond 80km = based cost + (distance - 80) * cost per km

export const vehicleTypes = [
  { id: "cde", label: "CDE 2-3 Ton", baseCost: 850000, costPerKm: 8000 },
  { id: "cde-long", label: "CDE-LONG 3-4 Ton", baseCost: 950000, costPerKm: 8500 },
  { id: "cdd", label: "CDD 4-7 Ton", baseCost: 1150000, costPerKm: 9500 },
  { id: "dt", label: "DT 7-10 Ton", baseCost: 1250000, costPerKm: 11000 },
  { id: "fuso", label: "FUSO WB 10-13 Ton", baseCost: 1500000, costPerKm: 13000 },
];

// Roads are never a straight line — scale the great-circle distance up to
// better approximate real driving distance in Indonesia.
const ROAD_DISTANCE_FACTOR = 1.35;
const BASE_INCLUDED_KM = 80;

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

// Great-circle distance between two lat/lng points, in kilometers.
export function haversineDistanceKm(a, b) {
  const R = 6371; // Earth radius in km
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
}

export function estimateRoadDistanceKm(cityA, cityB) {
  const straight = haversineDistanceKm(cityA, cityB);
  return straight * ROAD_DISTANCE_FACTOR;
}

export function estimateCost(distanceKm, vehicle) {
  if (distanceKm <= BASE_INCLUDED_KM) {
    return vehicle.baseCost;
  }
  const extraKm = distanceKm - BASE_INCLUDED_KM;
  return vehicle.baseCost + extraKm * vehicle.costPerKm;
}

export function formatRupiah(value) {
  return "Rp " + Math.round(value).toLocaleString("id-ID");
}
