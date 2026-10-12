import { Activity, TransportationMode } from '../types/trip';

export interface RoutePoint {
  lat: number;
  lng: number;
}

export interface RouteLeg {
  fromActivityId: string;
  toActivityId: string;
  fromName: string;
  toName: string;
  distanceKm: number;
  durationMin: number;
}

export interface CalculatedDayRoute {
  dayNumber: number;
  totalDistanceKm: number;
  totalDurationMin: number;
  legs: RouteLeg[];
  polylineCoordinates: RoutePoint[];
  mode: TransportationMode;
}

/**
 * Calculates distance in kilometers between two lat/lng points using the Haversine formula.
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Computes road distance factor and average speed by travel mode
 */
function getSpeedAndFactor(mode: TransportationMode) {
  switch (mode) {
    case 'walking':
      return { speedKmH: 4.5, detourFactor: 1.25 };
    case 'rental-bike':
      return { speedKmH: 32, detourFactor: 1.35 };
    case 'rental-car':
    case 'taxi':
      return { speedKmH: 38, detourFactor: 1.4 };
    case 'public-transport':
      return { speedKmH: 24, detourFactor: 1.5 };
    default:
      return { speedKmH: 30, detourFactor: 1.35 };
  }
}

/**
 * Generates an interpolated polyline curve between points to simulate realistic road geometry
 */
function generateRoadCurve(p1: RoutePoint, p2: RoutePoint, segments = 6): RoutePoint[] {
  const points: RoutePoint[] = [p1];
  const dx = p2.lng - p1.lng;
  const dy = p2.lat - p1.lat;
  
  // Perpendicular offset for subtle natural curve
  const perpX = -dy * 0.12;
  const perpY = dx * 0.12;

  for (let i = 1; i < segments; i++) {
    const t = i / segments;
    const arch = Math.sin(t * Math.PI);
    points.push({
      lat: p1.lat + dy * t + perpY * arch,
      lng: p1.lng + dx * t + perpX * arch,
    });
  }
  points.push(p2);
  return points;
}

/**
 * Calculates day route stops, leg distances, travel durations and polyline geometry
 */
export function calculateDayRoute(
  activities: Activity[],
  mode: TransportationMode,
  dayNumber: number
): CalculatedDayRoute {
  if (activities.length === 0) {
    return {
      dayNumber,
      totalDistanceKm: 0,
      totalDurationMin: 0,
      legs: [],
      polylineCoordinates: [],
      mode,
    };
  }

  if (activities.length === 1) {
    return {
      dayNumber,
      totalDistanceKm: 0,
      totalDurationMin: 0,
      legs: [],
      polylineCoordinates: [{ lat: activities[0].latitude, lng: activities[0].longitude }],
      mode,
    };
  }

  const { speedKmH, detourFactor } = getSpeedAndFactor(mode);
  const legs: RouteLeg[] = [];
  const fullPolyline: RoutePoint[] = [];

  let totalDistKm = 0;
  let totalDurMin = 0;

  for (let i = 0; i < activities.length - 1; i++) {
    const curr = activities[i];
    const next = activities[i + 1];

    const straightLine = calculateHaversineDistanceKm(
      curr.latitude,
      curr.longitude,
      next.latitude,
      next.longitude
    );

    // Apply realistic road transit detour factor
    const legDist = Math.max(0.5, Number((straightLine * detourFactor).toFixed(1)));
    const legDuration = Math.max(4, Math.round((legDist / speedKmH) * 60));

    legs.push({
      fromActivityId: curr.id,
      toActivityId: next.id,
      fromName: curr.name,
      toName: next.name,
      distanceKm: legDist,
      durationMin: legDuration,
    });

    totalDistKm += legDist;
    totalDurMin += legDuration;

    // Build polyline between this pair
    const p1 = { lat: curr.latitude, lng: curr.longitude };
    const p2 = { lat: next.latitude, lng: next.longitude };
    const segmentPoints = generateRoadCurve(p1, p2);

    if (i === 0) {
      fullPolyline.push(...segmentPoints);
    } else {
      // Avoid duplicate consecutive point
      fullPolyline.push(...segmentPoints.slice(1));
    }
  }

  return {
    dayNumber,
    totalDistanceKm: Number(totalDistKm.toFixed(1)),
    totalDurationMin: totalDurMin,
    legs,
    polylineCoordinates: fullPolyline,
    mode,
  };
}

/**
 * Format minutes into readable "1 hr 15 min" or "45 min"
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remMin = minutes % 60;
  return remMin > 0 ? `${hours} hr ${remMin} min` : `${hours} hr`;
}

/**
 * Format kilometers
 */
export function formatDistance(km: number): string {
  return `${km.toFixed(1)} km`;
}
