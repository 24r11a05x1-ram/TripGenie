import { CompleteTrip } from '../types/trip';

/**
 * Triggers clean print-to-PDF formatting for the itinerary
 */
export function exportItineraryToPDF(trip: CompleteTrip) {
  // Add a print title
  const originalTitle = document.title;
  document.title = `TripGenie - ${trip.title} Itinerary`;

  // Trigger standard browser print which utilizes print media styles
  window.print();

  // Restore original title
  setTimeout(() => {
    document.title = originalTitle;
  }, 1000);
}
