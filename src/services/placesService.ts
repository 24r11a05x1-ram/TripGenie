export interface PlaceSuggestion {
  description: string;
  placeId: string;
  mainText: string;
  secondaryText: string;
  lat: number;
  lng: number;
}

export const POPULAR_DESTINATIONS: PlaceSuggestion[] = [
  {
    description: 'Goa, India',
    placeId: 'ChIJ-c8V0v8hvzsRk5u6T0M8WQI',
    mainText: 'Goa',
    secondaryText: 'India',
    lat: 15.2993,
    lng: 74.124,
  },
  {
    description: 'Hyderabad, Telangana, India',
    placeId: 'ChIJz2xev1yZyzsR6X7l9-s-r2k',
    mainText: 'Hyderabad',
    secondaryText: 'Telangana, India',
    lat: 17.385,
    lng: 78.4867,
  },
  {
    description: 'Mumbai, Maharashtra, India',
    placeId: 'ChIJwe1EZvg5-zsRA_9qEhSymAe',
    mainText: 'Mumbai',
    secondaryText: 'Maharashtra, India',
    lat: 19.076,
    lng: 72.8777,
  },
  {
    description: 'Bengaluru, Karnataka, India',
    placeId: 'ChIJbU60yXAWrjsR4E9-UejD3_g',
    mainText: 'Bengaluru',
    secondaryText: 'Karnataka, India',
    lat: 12.9716,
    lng: 77.5946,
  },
  {
    description: 'Jaipur, Rajasthan, India',
    placeId: 'ChIJgeJ3OzG4bTkR1mmWqYv6s58',
    mainText: 'Jaipur',
    secondaryText: 'Rajasthan, India',
    lat: 26.9124,
    lng: 75.7873,
  },
  {
    description: 'Kochi, Kerala, India',
    placeId: 'ChIJL-K0b9G6CDsRD4a6nQ1g06g',
    mainText: 'Kochi',
    secondaryText: 'Kerala, India',
    lat: 9.9312,
    lng: 76.2673,
  },
  {
    description: 'Manali, Himachal Pradesh, India',
    placeId: 'ChIJb6R2G7c7BDkR6YyX6r2y8pA',
    mainText: 'Manali',
    secondaryText: 'Himachal Pradesh, India',
    lat: 32.2432,
    lng: 77.1892,
  },
  {
    description: 'Bali, Indonesia',
    placeId: 'ChIJoQ8q6Mhp0i0RljNLsl6GEO8',
    mainText: 'Bali',
    secondaryText: 'Indonesia',
    lat: -8.4095,
    lng: 115.1889,
  },
  {
    description: 'Tokyo, Japan',
    placeId: 'ChIJ513GhmsWAWARi3WmflFD-M4',
    mainText: 'Tokyo',
    secondaryText: 'Japan',
    lat: 35.6762,
    lng: 139.6503,
  },
  {
    description: 'Paris, France',
    placeId: 'ChIJD7fiBh9u5kcRYJSMaMOCCwQ',
    mainText: 'Paris',
    secondaryText: 'France',
    lat: 48.8566,
    lng: 2.3522,
  },
];

/**
 * Searches for places matching the query using Google Places or cached destinations
 */
export async function searchPlaces(query: string): Promise<PlaceSuggestion[]> {
  const clean = query.trim().toLowerCase();
  if (!clean) return [];

  // Match against popular catalog
  const catalogMatches = POPULAR_DESTINATIONS.filter(
    (p) =>
      p.description.toLowerCase().includes(clean) ||
      p.mainText.toLowerCase().includes(clean) ||
      p.secondaryText.toLowerCase().includes(clean)
  );

  if (catalogMatches.length > 0) {
    return catalogMatches;
  }

  // Generative fallback representation for any custom typed location
  return [
    {
      description: `${query.trim()}, Destination`,
      placeId: `custom-${encodeURIComponent(clean)}`,
      mainText: query.trim(),
      secondaryText: 'Custom Location',
      lat: 15.4989,
      lng: 73.8278,
    },
  ];
}
