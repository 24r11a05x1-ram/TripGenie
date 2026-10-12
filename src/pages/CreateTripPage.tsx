import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Users, 
  IndianRupee, 
  Compass, 
  Utensils, 
  Bike, 
  FileText, 
  Check, 
  Loader2,
  Search
} from 'lucide-react';
import { TripPreferences, TravelStyle, FoodPreference, TransportationMode, Currency, BudgetTier, CompleteTrip } from '../types/trip';
import { POPULAR_DESTINATIONS, searchPlaces, PlaceSuggestion } from '../services/placesService';

interface CreateTripPageProps {
  onTripGenerated: (trip: CompleteTrip) => void;
  onCancel: () => void;
  initialDestination?: string;
}

const TRAVEL_STYLES: { id: TravelStyle; label: string; icon: string }[] = [
  { id: 'beach', label: 'Beach & Coastal', icon: '🏖️' },
  { id: 'adventure', label: 'Adventure & Thrills', icon: '🏄‍♂️' },
  { id: 'culture', label: 'Culture & Heritage', icon: '🏛️' },
  { id: 'relaxation', label: 'Relaxation & Wellness', icon: '🧘‍♀️' },
  { id: 'food', label: 'Food & Culinary', icon: '🍲' },
  { id: 'nature', label: 'Nature & Scenery', icon: '🌿' },
  { id: 'history', label: 'History & Forts', icon: '🏰' },
  { id: 'photography', label: 'Photography', icon: '📸' },
  { id: 'nightlife', label: 'Nightlife & Lounges', icon: '🍹' },
  { id: 'romantic', label: 'Romantic', icon: '🌅' },
  { id: 'family', label: 'Family Friendly', icon: '👨‍👩‍👦' },
  { id: 'spiritual', label: 'Spiritual', icon: '🪔' },
  { id: 'shopping', label: 'Shopping & Bazaars', icon: '🛍️' },
];

const FOOD_OPTIONS: { id: FoodPreference; label: string; desc: string }[] = [
  { id: 'vegetarian', label: 'Pure Vegetarian', desc: '100% vegetarian culinary experiences' },
  { id: 'non-vegetarian', label: 'Non-Vegetarian', desc: 'Seafood, regional meat & poultry' },
  { id: 'vegan', label: 'Vegan', desc: 'Strictly plant-based dishes' },
  { id: 'jain', label: 'Jain Friendly', desc: 'No root vegetables, strict pure veg' },
  { id: 'no-preference', label: 'No Preference', desc: 'Any local specialty' },
];

const TRANSPORT_OPTIONS: { id: TransportationMode; label: string; desc: string; icon: string }[] = [
  { id: 'rental-bike', label: 'Rental Bike / Scooter', desc: 'Zippy, economical coastal exploration', icon: '🛵' },
  { id: 'rental-car', label: 'Rental Car', desc: 'Self-drive freedom with AC comfort', icon: '🚗' },
  { id: 'taxi', label: 'Private Taxi / Cabs', desc: 'Chauffeur-driven convenient transit', icon: '🚕' },
  { id: 'public-transport', label: 'Public Transit', desc: 'Budget buses & local trains', icon: '🚌' },
  { id: 'walking', label: 'Walking & Cycling', desc: 'Slow, foot-powered urban exploration', icon: '🚶' },
];

const GENERATION_STEPS = [
  'Understanding travel preferences & party size',
  'Discovering real verified attractions & landmarks',
  'Finding suitable dietary-compliant restaurants',
  'Grouping nearby locations to minimize transit',
  'Calculating routes, distances & travel durations',
  'Sequencing daily chronological schedules',
  'Estimating transparent itemized trip expenses',
];

export const CreateTripPage: React.FC<CreateTripPageProps> = ({
  onTripGenerated,
  onCancel,
  initialDestination = 'Goa, India',
}) => {
  const [step, setStep] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentGenStep, setCurrentGenStep] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Destination autocomplete states
  const [originQuery, setOriginQuery] = useState('Hyderabad, India');
  const [originSuggestions, setOriginSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);

  const [destQuery, setDestQuery] = useState(initialDestination);
  const [destSuggestions, setDestSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);

  // Form State
  const [preferences, setPreferences] = useState<TripPreferences>({
    origin: 'Hyderabad, India',
    destination: initialDestination,
    startDate: '2026-11-14',
    endDate: '2026-11-17',
    adults: 2,
    children: 0,
    travelers: 2,
    budgetTier: 'custom',
    customBudget: 15000,
    currency: 'INR',
    travelStyles: ['beach', 'adventure'],
    foodPreference: 'vegetarian',
    transportation: 'rental-bike',
    specialRequirements: 'Keep travel time low and include sunset locations.',
  });

  // Calculate days and nights
  const totalDays = Math.max(
    1,
    Math.ceil(
      (new Date(preferences.endDate).getTime() - new Date(preferences.startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1
  );
  const totalNights = Math.max(0, totalDays - 1);

  // Search origin places
  useEffect(() => {
    if (originQuery.trim()) {
      searchPlaces(originQuery).then(setOriginSuggestions);
    }
  }, [originQuery]);

  // Search dest places
  useEffect(() => {
    if (destQuery.trim()) {
      searchPlaces(destQuery).then(setDestSuggestions);
    }
  }, [destQuery]);

  // Handle travel style toggle
  const toggleStyle = (style: TravelStyle) => {
    setPreferences((prev) => {
      const exists = prev.travelStyles.includes(style);
      if (exists) {
        if (prev.travelStyles.length === 1) return prev; // keep at least 1
        return { ...prev, travelStyles: prev.travelStyles.filter((s) => s !== style) };
      }
      return { ...prev, travelStyles: [...prev.travelStyles, style] };
    });
  };

  // Submit and Generate Itinerary
  const handleGenerate = async () => {
    setIsGenerating(true);
    setCurrentGenStep(0);
    setErrorMsg('');

    // Progressive step indicator timer
    const interval = setInterval(() => {
      setCurrentGenStep((prev) => {
        if (prev < GENERATION_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 600);

    try {
      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      });

      clearInterval(interval);

      if (!response.ok) {
        throw new Error('Failed to generate itinerary. Please try again.');
      }

      const trip: CompleteTrip = await response.json();
      onTripGenerated(trip);
    } catch (err: any) {
      clearInterval(interval);
      setIsGenerating(false);
      setErrorMsg(err.message || 'Error occurred while generating itinerary.');
    }
  };

  // Progress Bar percentage
  const progressPercent = Math.round((step / 9) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-20">
      {/* Top Header & Cancel */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-bold text-stone-500 hover:text-stone-900 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Dashboard</span>
        </button>

        <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Step {step} of 9
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden mb-8 shadow-inner">
        <div
          style={{ width: `${progressPercent}%` }}
          className="bg-emerald-600 h-full rounded-full transition-all duration-300"
        />
      </div>

      {/* Generating Animated Screen */}
      {isGenerating ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-xl text-center space-y-8 animate-in fade-in duration-300">
          <div className="relative inline-flex items-center justify-center">
            <div className="w-20 h-20 rounded-3xl bg-emerald-100 flex items-center justify-center text-emerald-600 animate-pulse">
              <Sparkles className="w-10 h-10" />
            </div>
            <div className="absolute -inset-2 border-2 border-emerald-500/40 border-t-emerald-600 rounded-3xl animate-spin" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-stone-900">
              TripGenie is crafting your itinerary...
            </h2>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Analyzing geography, verified Google coordinates, scenic sunset points, and vegetarian dining spots.
            </p>
          </div>

          {/* Progressive Checklist */}
          <div className="max-w-md mx-auto text-left space-y-3 bg-stone-50 p-6 rounded-2xl border border-stone-200/80">
            {GENERATION_STEPS.map((s, idx) => {
              const isDone = idx < currentGenStep;
              const isCurrent = idx === currentGenStep;

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 text-xs transition-opacity ${
                    isDone
                      ? 'text-emerald-700 font-semibold'
                      : isCurrent
                      ? 'text-stone-900 font-bold'
                      : 'text-stone-400 opacity-60'
                  }`}
                >
                  {isDone ? (
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  ) : isCurrent ? (
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Loader2 className="w-3 h-3 animate-spin" />
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center shrink-0 text-[10px] font-bold">
                      {idx + 1}
                    </span>
                  )}
                  <span>{s}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Multi-Step Wizard Card */
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-xl space-y-8">
          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* STEP 1: Destination & Origin */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-stone-900">Where are you heading?</h2>
                <p className="text-xs text-stone-500 mt-1">
                  Specify starting point and destination with real Google Places.
                </p>
              </div>

              {/* Origin Field */}
              <div className="relative">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Starting Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    value={originQuery}
                    onChange={(e) => {
                      setOriginQuery(e.target.value);
                      setPreferences((p) => ({ ...p, origin: e.target.value }));
                      setShowOriginSuggestions(true);
                    }}
                    onFocus={() => setShowOriginSuggestions(true)}
                    placeholder="e.g. Hyderabad, India"
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm font-semibold text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                {showOriginSuggestions && originSuggestions.length > 0 && (
                  <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-stone-200 rounded-2xl shadow-xl overflow-hidden max-h-48 overflow-y-auto">
                    {originSuggestions.map((s, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setOriginQuery(s.description);
                          setPreferences((p) => ({
                            ...p,
                            origin: s.description,
                            originPlaceId: s.placeId,
                            originLat: s.lat,
                            originLng: s.lng,
                          }));
                          setShowOriginSuggestions(false);
                        }}
                        className="px-4 py-2.5 hover:bg-emerald-50 cursor-pointer text-xs flex items-center justify-between"
                      >
                        <span className="font-semibold text-stone-800">{s.mainText}</span>
                        <span className="text-stone-400">{s.secondaryText}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Destination Field */}
              <div className="relative">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Destination
                </label>
                <div className="relative">
                  <Compass className="absolute left-3.5 top-3.5 w-4 h-4 text-emerald-600" />
                  <input
                    type="text"
                    value={destQuery}
                    onChange={(e) => {
                      setDestQuery(e.target.value);
                      setPreferences((p) => ({ ...p, destination: e.target.value }));
                      setShowDestSuggestions(true);
                    }}
                    onFocus={() => setShowDestSuggestions(true)}
                    placeholder="e.g. Goa, India"
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm font-semibold text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                {showDestSuggestions && destSuggestions.length > 0 && (
                  <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-stone-200 rounded-2xl shadow-xl overflow-hidden max-h-48 overflow-y-auto">
                    {destSuggestions.map((s, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setDestQuery(s.description);
                          setPreferences((p) => ({
                            ...p,
                            destination: s.description,
                            destinationPlaceId: s.placeId,
                            destinationLat: s.lat,
                            destinationLng: s.lng,
                          }));
                          setShowDestSuggestions(false);
                        }}
                        className="px-4 py-2.5 hover:bg-emerald-50 cursor-pointer text-xs flex items-center justify-between"
                      >
                        <span className="font-semibold text-stone-800">{s.mainText}</span>
                        <span className="text-stone-400">{s.secondaryText}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Popular Destination Quick Chips */}
              <div>
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-2">
                  Popular Hotspots
                </span>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_DESTINATIONS.slice(0, 5).map((pop, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setDestQuery(pop.description);
                        setPreferences((p) => ({
                          ...p,
                          destination: pop.description,
                          destinationPlaceId: pop.placeId,
                          destinationLat: pop.lat,
                          destinationLng: pop.lng,
                        }));
                      }}
                      className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-emerald-50 hover:text-emerald-700 text-xs font-semibold text-stone-700 transition-colors"
                    >
                      {pop.mainText}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Dates & Duration */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-stone-900">When are you traveling?</h2>
                <p className="text-xs text-stone-500 mt-1">
                  TripGenie calculates optimal daily pacing for your trip length.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={preferences.startDate}
                    onChange={(e) => setPreferences((p) => ({ ...p, startDate: e.target.value }))}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm font-semibold text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={preferences.endDate}
                    min={preferences.startDate}
                    onChange={(e) => setPreferences((p) => ({ ...p, endDate: e.target.value }))}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm font-semibold text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Duration calculation banner */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-900">Calculated Trip Duration</span>
                  <p className="text-lg font-black text-emerald-800">
                    {totalDays} Days / {totalNights} Nights
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-emerald-600 opacity-80" />
              </div>
            </div>
          )}

          {/* STEP 3: Travelers */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-stone-900">Who is traveling?</h2>
                <p className="text-xs text-stone-500 mt-1">
                  Helps size accommodations, transport, and activity tickets.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-stone-900">Adults</h4>
                    <span className="text-xs text-stone-500">Age 13+</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setPreferences((p) => {
                          const val = Math.max(1, p.adults - 1);
                          return { ...p, adults: val, travelers: val + p.children };
                        })
                      }
                      className="w-8 h-8 rounded-xl bg-white border border-stone-300 flex items-center justify-center font-bold text-stone-700 hover:bg-stone-100"
                    >
                      -
                    </button>
                    <span className="font-black text-base w-4 text-center">{preferences.adults}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setPreferences((p) => {
                          const val = p.adults + 1;
                          return { ...p, adults: val, travelers: val + p.children };
                        })
                      }
                      className="w-8 h-8 rounded-xl bg-white border border-stone-300 flex items-center justify-center font-bold text-stone-700 hover:bg-stone-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-stone-900">Children</h4>
                    <span className="text-xs text-stone-500">Ages 0 - 12</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setPreferences((p) => {
                          const val = Math.max(0, p.children - 1);
                          return { ...p, children: val, travelers: p.adults + val };
                        })
                      }
                      className="w-8 h-8 rounded-xl bg-white border border-stone-300 flex items-center justify-center font-bold text-stone-700 hover:bg-stone-100"
                    >
                      -
                    </button>
                    <span className="font-black text-base w-4 text-center">{preferences.children}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setPreferences((p) => {
                          const val = p.children + 1;
                          return { ...p, children: val, travelers: p.adults + val };
                        })
                      }
                      className="w-8 h-8 rounded-xl bg-white border border-stone-300 flex items-center justify-center font-bold text-stone-700 hover:bg-stone-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-stone-100 rounded-2xl text-xs font-bold text-stone-700 flex items-center justify-between">
                <span>Total Travel Group</span>
                <span className="text-sm font-black text-emerald-700">
                  {preferences.travelers} Traveler{preferences.travelers > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}

          {/* STEP 4: Budget */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-stone-900">What is your total budget?</h2>
                <p className="text-xs text-stone-500 mt-1">
                  Covers stays, local food, bike/cab transit, and activities.
                </p>
              </div>

              {/* Currency Selector */}
              <div className="flex items-center gap-2">
                {(['INR', 'USD', 'EUR', 'GBP'] as Currency[]).map((curr) => (
                  <button
                    key={curr}
                    type="button"
                    onClick={() => setPreferences((p) => ({ ...p, currency: curr }))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      preferences.currency === curr
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>

              {/* Tier Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'budget', label: 'Budget Explorer', desc: 'Hostels, local thalis, scooters', amount: 10000 },
                  { id: 'moderate', label: 'Moderate Comfort', desc: 'Resorts, beach cafes, rentals', amount: 25000 },
                  { id: 'luxury', label: 'Luxury Escape', desc: '5-star boutique villas, private sails', amount: 50000 },
                ].map((b) => (
                  <div
                    key={b.id}
                    onClick={() =>
                      setPreferences((p) => ({
                        ...p,
                        budgetTier: b.id as BudgetTier,
                        customBudget: b.amount,
                      }))
                    }
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      preferences.budgetTier === b.id
                        ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <h4 className="font-bold text-sm text-stone-900">{b.label}</h4>
                    <p className="text-[11px] text-stone-500 mt-1 leading-snug">{b.desc}</p>
                    <p className="font-black text-sm text-emerald-700 mt-2">
                      ~₹{b.amount.toLocaleString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>

              {/* Custom Budget Input */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Or enter exact custom budget (total for {preferences.travelers} travelers):
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3.5 top-3.5 w-4 h-4 text-emerald-600" />
                  <input
                    type="number"
                    value={preferences.customBudget || ''}
                    onChange={(e) =>
                      setPreferences((p) => ({
                        ...p,
                        budgetTier: 'custom',
                        customBudget: Number(e.target.value) || 0,
                      }))
                    }
                    placeholder="15000"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-2xl text-sm font-bold text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Travel Style */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-stone-900">What is your travel style?</h2>
                <p className="text-xs text-stone-500 mt-1">
                  Select all that you love (multi-select supported).
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {TRAVEL_STYLES.map((st) => {
                  const isSelected = preferences.travelStyles.includes(st.id);
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => toggleStyle(st.id)}
                      className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500/20 shadow-xs'
                          : 'border-stone-200 hover:border-stone-300 text-stone-700'
                      }`}
                    >
                      <span className="text-xl">{st.icon}</span>
                      <span className="text-xs leading-tight">{st.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: Food Preferences */}
          {step === 6 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-stone-900">Food & Dietary Preferences</h2>
                <p className="text-xs text-stone-500 mt-1">
                  We filter verified dining spots matching your exact culinary standards.
                </p>
              </div>

              <div className="space-y-2.5">
                {FOOD_OPTIONS.map((food) => (
                  <div
                    key={food.id}
                    onClick={() => setPreferences((p) => ({ ...p, foodPreference: food.id }))}
                    className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      preferences.foodPreference === food.id
                        ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-sm text-stone-900">{food.label}</h4>
                      <p className="text-xs text-stone-500 mt-0.5">{food.desc}</p>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        preferences.foodPreference === food.id
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : 'border-stone-300'
                      }`}
                    >
                      {preferences.foodPreference === food.id && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 7: Transportation Mode */}
          {step === 7 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-stone-900">How do you prefer to get around?</h2>
                <p className="text-xs text-stone-500 mt-1">
                  Routes and travel times will be computed specifically for this mode.
                </p>
              </div>

              <div className="space-y-2.5">
                {TRANSPORT_OPTIONS.map((tr) => (
                  <div
                    key={tr.id}
                    onClick={() => setPreferences((p) => ({ ...p, transportation: tr.id }))}
                    className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      preferences.transportation === tr.id
                        ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{tr.icon}</span>
                      <div>
                        <h4 className="font-bold text-sm text-stone-900">{tr.label}</h4>
                        <p className="text-xs text-stone-500 mt-0.5">{tr.desc}</p>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        preferences.transportation === tr.id
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : 'border-stone-300'
                      }`}
                    >
                      {preferences.transportation === tr.id && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 8: Special Requirements */}
          {step === 8 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-stone-900">Any special requests?</h2>
                <p className="text-xs text-stone-500 mt-1">
                  Tell AI if you prefer sunset viewpoints, less crowded beaches, or slow mornings.
                </p>
              </div>

              <div>
                <textarea
                  rows={4}
                  value={preferences.specialRequirements}
                  onChange={(e) => setPreferences((p) => ({ ...p, specialRequirements: e.target.value }))}
                  placeholder="e.g. Keep travel time low and include sunset locations."
                  className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                <span className="text-stone-400 font-semibold self-center">Quick tags:</span>
                {[
                  'Keep travel time low',
                  'Include scenic sunset spots',
                  'Prefer quiet secluded beaches',
                  'Budget-friendly pure veg thalis',
                ].map((tag, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() =>
                      setPreferences((p) => ({
                        ...p,
                        specialRequirements: p.specialRequirements
                          ? `${p.specialRequirements} ${tag}.`
                          : `${tag}.`,
                      }))
                    }
                    className="px-2.5 py-1 bg-stone-100 hover:bg-emerald-50 text-stone-700 rounded-lg"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 9: Final Review & Generate */}
          {step === 9 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-stone-900">Review Your Travel Preferences</h2>
                <p className="text-xs text-stone-500 mt-1">
                  Verify details before TripGenie runs itinerary generation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-stone-50 p-5 rounded-2xl border border-stone-200">
                <div>
                  <span className="text-stone-400 font-bold uppercase tracking-wider">Route</span>
                  <p className="font-bold text-stone-900 text-sm mt-0.5">
                    {preferences.origin} → {preferences.destination}
                  </p>
                </div>

                <div>
                  <span className="text-stone-400 font-bold uppercase tracking-wider">Dates</span>
                  <p className="font-bold text-stone-900 text-sm mt-0.5">
                    {preferences.startDate} to {preferences.endDate} ({totalDays} Days)
                  </p>
                </div>

                <div>
                  <span className="text-stone-400 font-bold uppercase tracking-wider">Travelers</span>
                  <p className="font-bold text-stone-900 text-sm mt-0.5">
                    {preferences.travelers} ({preferences.adults} Adults, {preferences.children} Children)
                  </p>
                </div>

                <div>
                  <span className="text-stone-400 font-bold uppercase tracking-wider">Budget</span>
                  <p className="font-bold text-emerald-700 text-sm mt-0.5">
                    ₹{(preferences.customBudget || 15000).toLocaleString('en-IN')} (
                    {preferences.budgetTier})
                  </p>
                </div>

                <div>
                  <span className="text-stone-400 font-bold uppercase tracking-wider">Dietary</span>
                  <p className="font-bold text-stone-900 text-sm mt-0.5 capitalize">
                    {preferences.foodPreference}
                  </p>
                </div>

                <div>
                  <span className="text-stone-400 font-bold uppercase tracking-wider">Transport</span>
                  <p className="font-bold text-stone-900 text-sm mt-0.5 capitalize">
                    {preferences.transportation.replace('-', ' ')}
                  </p>
                </div>
              </div>

              {preferences.specialRequirements && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                  <span className="font-bold block mb-0.5">Special Instructions:</span>
                  <span>{preferences.specialRequirements}</span>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="pt-4 flex items-center justify-between border-t border-stone-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 9 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 active:scale-95"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGenerate}
                className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm rounded-xl shadow-xl shadow-emerald-600/30 transition-all flex items-center gap-2 active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate My Itinerary</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
