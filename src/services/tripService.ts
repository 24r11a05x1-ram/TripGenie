import { CompleteTrip } from '../types/trip';
import { DEMO_GOA_TRIP } from '../data/demoTrip';

const STORAGE_KEY = 'tripgenie_saved_trips';

/**
 * Loads all saved trips from localStorage (with DEMO_GOA_TRIP as seed)
 */
export function getSavedTrips(): CompleteTrip[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed with default Goa demo trip
      localStorage.setItem(STORAGE_KEY, JSON.stringify([DEMO_GOA_TRIP]));
      return [DEMO_GOA_TRIP];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [DEMO_GOA_TRIP];
    }
    return parsed;
  } catch {
    return [DEMO_GOA_TRIP];
  }
}

/**
 * Gets a trip by its ID
 */
export function getTripById(id: string): CompleteTrip | null {
  const trips = getSavedTrips();
  const found = trips.find((t) => t.id === id);
  if (found) return found;

  if (id === DEMO_GOA_TRIP.id || id === 'demo' || id === DEMO_GOA_TRIP.shareId) {
    return DEMO_GOA_TRIP;
  }
  return null;
}

/**
 * Gets a public shared trip by shareId
 */
export function getSharedTrip(shareId: string): CompleteTrip | null {
  const trips = getSavedTrips();
  const found = trips.find((t) => t.shareId === shareId || t.id === shareId);
  if (found && found.isPublic) {
    return found;
  }
  if (shareId === DEMO_GOA_TRIP.shareId || shareId === 'goa-escape-2026') {
    return DEMO_GOA_TRIP;
  }
  return null;
}

/**
 * Saves or updates a trip
 */
export function saveTrip(trip: CompleteTrip): CompleteTrip {
  const trips = getSavedTrips();
  const existingIdx = trips.findIndex((t) => t.id === trip.id);

  const updatedTrip: CompleteTrip = {
    ...trip,
    updatedAt: new Date().toISOString(),
  };

  if (existingIdx >= 0) {
    trips[existingIdx] = updatedTrip;
  } else {
    trips.unshift(updatedTrip);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  return updatedTrip;
}

/**
 * Deletes a trip
 */
export function deleteTrip(id: string): boolean {
  const trips = getSavedTrips();
  const filtered = trips.filter((t) => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

/**
 * Duplicates a trip
 */
export function duplicateTrip(trip: CompleteTrip): CompleteTrip {
  const cloned: CompleteTrip = {
    ...JSON.parse(JSON.stringify(trip)),
    id: `trip-copy-${Date.now()}`,
    title: `${trip.title} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    shareId: `trip-${Math.random().toString(36).substring(2, 9)}`,
    isDemo: false,
  };

  saveTrip(cloned);
  return cloned;
}
