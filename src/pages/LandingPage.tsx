import React from 'react';
import { 
  Sparkles, 
  MapPin, 
  Navigation, 
  IndianRupee, 
  Compass, 
  Share2, 
  Sun, 
  ShieldCheck, 
  ArrowRight, 
  Calendar,
  Users,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { POPULAR_DESTINATIONS } from '../services/placesService';

interface LandingPageProps {
  onPlanTrip: () => void;
  onExploreDemo: () => void;
  onSelectQuickDestination: (dest: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onPlanTrip,
  onExploreDemo,
  onSelectQuickDestination,
}) => {
  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-8 sm:pt-16 pb-12 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300/80 text-emerald-800 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Plan smarter. Travel better.</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-stone-900 tracking-tight leading-[1.08]">
            Your perfect trip, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
              planned by AI.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-stone-600 leading-relaxed font-normal">
            Tell us where you're going, what you love, and your budget. TripGenie creates a personalized travel itinerary with optimized routes, real-world recommendations, and interactive Leaflet maps.
          </p>

          {/* CTA Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={onPlanTrip}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-emerald-600/30 hover:shadow-2xl hover:shadow-emerald-600/40 active:scale-95 transition-all flex items-center justify-center gap-2.5"
            >
              <span>Plan My Trip</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={onExploreDemo}
              className="w-full sm:w-auto px-7 py-4 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-bold text-base rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Compass className="w-5 h-5 text-emerald-600" />
              <span>Explore Demo Trip (Goa)</span>
            </button>
          </div>

          {/* Proof Badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-500 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Real Google Places & Coordinates</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Dietary Friendly Recommendations</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Interactive Map & Route Timing</span>
            </div>
          </div>
        </div>

        {/* Visual Dashboard Preview Card */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200/90 overflow-hidden p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <span className="text-xs font-bold text-stone-400 pl-2">
                  TripGenie Live Preview • Goa Coastal Escape
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  ₹15,000 Budget • 2 Travelers
                </span>
                <span className="text-xs font-bold text-stone-600 bg-stone-100 px-3 py-1 rounded-full">
                  3 Days • Rental Bike
                </span>
              </div>
            </div>

            {/* Split preview snippet */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Timeline Column */}
              <div className="lg:col-span-7 space-y-3">
                <div className="bg-stone-900 text-white p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
                      Day 1 • Candolim & Sinquerim
                    </span>
                    <h4 className="font-bold text-sm mt-1">Fort Aguada, Beach Sports & Golden Sunset</h4>
                  </div>
                  <div className="text-right text-xs text-amber-300 font-bold">
                    31°C Sunny
                  </div>
                </div>

                <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                      <MapPin className="w-4 h-4" />
                    </span>
                    <div>
                      <h5 className="font-bold text-xs text-stone-900">Fort Aguada & Lighthouse</h5>
                      <p className="text-[11px] text-stone-500">17th-century coastal fort overlooking Arabian Sea</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700">09:30 AM</span>
                </div>

                <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
                      <MapPin className="w-4 h-4" />
                    </span>
                    <div>
                      <h5 className="font-bold text-xs text-stone-900">Sinquerim Beach Water Adventures</h5>
                      <p className="text-[11px] text-stone-500">Curved sandy bay below fort with jet skiing</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700">02:30 PM</span>
                </div>

                <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-purple-100 text-purple-800">
                      <MapPin className="w-4 h-4" />
                    </span>
                    <div>
                      <h5 className="font-bold text-xs text-stone-900">Lower Aguada Sunset Point</h5>
                      <p className="text-[11px] text-stone-500">Rocky cliff ledge with unobstructed twilight horizon</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700">05:15 PM</span>
                </div>
              </div>

              {/* Map Preview Column */}
              <div className="lg:col-span-5 bg-stone-100 rounded-2xl border border-stone-200 p-4 flex flex-col justify-between relative overflow-hidden min-h-[260px]">
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg shadow-xs">
                    Interactive Map Engine
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    18.5 km • 45 min Transit
                  </span>
                </div>

                {/* Styled illustration pins */}
                <div className="relative z-10 py-6 text-center space-y-2">
                  <div className="inline-flex items-center gap-2 bg-emerald-600 text-white px-3 py-1.5 rounded-full shadow-lg text-xs font-bold animate-pulse">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Live GPS Pin: Aguada Fort (15.492°N, 73.773°E)</span>
                  </div>
                  <p className="text-[11px] text-stone-600">
                    Pins, directions, and marker tooltips remain synchronized with your schedule.
                  </p>
                </div>

                <div className="relative z-10 text-center">
                  <button
                    type="button"
                    onClick={onExploreDemo}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                  >
                    Open Full Interactive Map & Itinerary →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Sections */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Designed for travelers who value their time.
          </h2>
          <p className="max-w-xl mx-auto text-sm text-stone-600">
            Everything you need for an unforgettable getaway, from smart grouping to live route recalculation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">AI Trip Planning</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Generate personalized itineraries based on your budget, travel interests, dietary preferences, and travel party in seconds.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">Interactive Leaflet Maps</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Explore destinations, attractions, restaurants, hotels, and routes on a fluid interactive map with day-by-day filtering and multiple tile styles.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
              <Navigation className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">Smart Route Sequencing</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Stops are grouped intelligently geographically to minimize zigzagging transit and maximize your vacation relaxation.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <IndianRupee className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">Transparent Budgeting</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Detailed expense estimates across stays, dining, transit, and entry fees, with total and per-person cost toggles.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">Dietary Respect</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Explicit dining recommendations honoring Pure Vegetarian, Vegan, Jain, or Non-Vegetarian culinary preferences.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
              <Share2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">Easy Export & Sharing</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Export clean formatted PDF itineraries for offline travel or share private/public web links with friends.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Destination Quick-Pick Carousel */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black text-stone-900">Popular Destinations</h3>
            <p className="text-xs text-stone-500">Click any destination to start planning immediately</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {POPULAR_DESTINATIONS.slice(0, 6).map((dest, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onSelectQuickDestination(dest.description)}
              className="p-3 bg-white hover:bg-emerald-50 border border-stone-200 hover:border-emerald-400 rounded-2xl text-left transition-all shadow-xs group"
            >
              <span className="text-xs font-black text-stone-900 group-hover:text-emerald-700 block">
                {dest.mainText}
              </span>
              <span className="text-[11px] text-stone-500 block truncate">
                {dest.secondaryText}
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
