export type BudgetTier = 'budget' | 'moderate' | 'luxury' | 'custom';

export type TravelStyle = 
  | 'adventure' 
  | 'beach' 
  | 'nature' 
  | 'history' 
  | 'culture' 
  | 'food' 
  | 'shopping' 
  | 'nightlife' 
  | 'photography' 
  | 'family' 
  | 'romantic' 
  | 'spiritual' 
  | 'relaxation';

export type FoodPreference = 
  | 'vegetarian' 
  | 'non-vegetarian' 
  | 'vegan' 
  | 'jain' 
  | 'no-preference';

export type TransportationMode = 
  | 'walking' 
  | 'public-transport' 
  | 'rental-bike' 
  | 'rental-car' 
  | 'taxi';

export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface TripPreferences {
  origin: string;
  originPlaceId?: string;
  originLat?: number;
  originLng?: number;
  destination: string;
  destinationPlaceId?: string;
  destinationLat?: number;
  destinationLng?: number;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  travelers: number;
  budgetTier: BudgetTier;
  customBudget?: number;
  currency: Currency;
  travelStyles: TravelStyle[];
  foodPreference: FoodPreference;
  transportation: TransportationMode;
  specialRequirements?: string;
}

export type ActivityCategory = 
  | 'attraction' 
  | 'beach' 
  | 'nature' 
  | 'culture' 
  | 'adventure' 
  | 'food' 
  | 'shopping' 
  | 'nightlife' 
  | 'relaxation' 
  | 'transit';

export interface Activity {
  id: string;
  dayNumber: number;
  sequenceOrder: number;
  name: string;
  category: ActivityCategory;
  description: string;
  placeId?: string;
  address: string;
  latitude: number;
  longitude: number;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  estimatedCost: number;
  currency: Currency;
  distanceToNextKm?: number;
  travelTimeToNextMin?: number;
  tags?: string[];
  tips?: string;
}

export interface Restaurant {
  id: string;
  dayNumber: number;
  sequenceOrder: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  placeId?: string;
  cuisine: string;
  address: string;
  latitude: number;
  longitude: number;
  rating?: number;
  estimatedPrice: number;
  foodSuitability?: string;
  highlights?: string;
}

export interface HotelSuggestion {
  id: string;
  name: string;
  placeId?: string;
  area: string;
  address: string;
  latitude: number;
  longitude: number;
  rating?: number;
  estimatedPricePerNight: number;
  priceLevel: string;
  amenities: string[];
}

export interface DayWeather {
  tempC: number;
  condition: string;
  icon: string;
  precipitationProb: number;
  summary: string;
}

export interface DailyItinerary {
  dayNumber: number;
  date: string;
  title: string;
  theme: string;
  weather?: DayWeather;
  activities: Activity[];
  restaurants: Restaurant[];
  estimatedDayCost: number;
  dayRouteSummary?: {
    distanceKm: number;
    durationMin: number;
  };
}

export interface BudgetBreakdown {
  accommodation: number;
  food: number;
  transportation: number;
  activities: number;
  miscellaneous: number;
  totalEstimatedCost: number;
  currency: Currency;
  costPerPerson: number;
  targetBudget: number;
  difference: number;
  isOverBudget: boolean;
  optimizationSuggestions?: string[];
}

export interface TripSummary {
  title: string;
  overview: string;
  totalDays: number;
  totalNights: number;
  bestTimeToVisit?: string;
  packingTips?: string[];
  highlights?: string[];
}

export interface CompleteTrip {
  id: string;
  userId?: string;
  title: string;
  destination: string;
  origin: string;
  coverImage?: string;
  preferences: TripPreferences;
  summary: TripSummary;
  days: DailyItinerary[];
  hotelSuggestions: HotelSuggestion[];
  budget: BudgetBreakdown;
  isPublic: boolean;
  shareId: string;
  createdAt: string;
  updatedAt: string;
  isDemo?: boolean;
}

export interface ModificationResult {
  updatedTrip: CompleteTrip;
  changesSummary: string[];
  message: string;
}
