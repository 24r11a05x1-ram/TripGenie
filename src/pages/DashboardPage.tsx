import React from 'react';
import { 
  Plus, 
  MapPin, 
  Calendar, 
  Users, 
  IndianRupee, 
  ArrowRight, 
  Compass, 
  FolderKanban, 
  Copy, 
  Trash2,
  Sparkles
} from 'lucide-react';
import { CompleteTrip } from '../types/trip';

interface DashboardPageProps {
  savedTrips: CompleteTrip[];
  onOpenTrip: (trip: CompleteTrip) => void;
  onOpenCreateTrip: () => void;
  onDuplicateTrip: (trip: CompleteTrip) => void;
  onDeleteTrip: (tripId: string) => void;
  onExploreDemo: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  savedTrips,
  onOpenTrip,
  onOpenCreateTrip,
  onDuplicateTrip,
  onDeleteTrip,
  onExploreDemo,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-bold border border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Travel Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Welcome back 👋
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-normal">
            Where are you going next? Plan a new adventure with optimized routes, interactive Google Maps, and budget tracking.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 z-10 w-full md:w-auto">
          <button
            type="button"
            onClick={onOpenCreateTrip}
            className="px-6 py-3.5 bg-white text-emerald-950 hover:bg-emerald-50 font-black text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Create New Trip</span>
          </button>

          <button
            type="button"
            onClick={onExploreDemo}
            className="px-5 py-3.5 bg-emerald-700/60 hover:bg-emerald-700 text-white border border-emerald-500/40 font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Goa Demo</span>
          </button>
        </div>
      </div>

      {/* Trips Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-stone-900 tracking-tight">
            Your Travel Itineraries
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Access, modify, or share your saved trips
          </p>
        </div>

        <span className="text-xs font-bold text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
          {savedTrips.length} Saved {savedTrips.length === 1 ? 'Trip' : 'Trips'}
        </span>
      </div>

      {/* Saved Trips Grid */}
      {savedTrips.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/80 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <FolderKanban className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-stone-800">No saved trips yet</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Start by planning your first AI-curated itinerary or explore our pre-built demo trip.
          </p>
          <button
            type="button"
            onClick={onOpenCreateTrip}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md"
          >
            + Create New Trip
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedTrips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col group"
            >
              {/* Cover Image Header */}
              <div className="relative h-44 overflow-hidden bg-stone-100">
                <img
                  src={trip.coverImage || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'}
                  alt={trip.destination}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute top-3 left-3">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-stone-900 shadow-xs">
                    {trip.summary.totalDays} Days / {trip.summary.totalNights} Nights
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-bold text-lg leading-tight line-clamp-1 drop-shadow-md">
                    {trip.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-stone-200 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{trip.destination}</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="grid grid-cols-2 gap-2 text-xs text-stone-600 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>{trip.preferences.startDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-stone-400" />
                    <span>{trip.preferences.travelers} Travelers</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-stone-900">
                    <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                    <span>₹{trip.budget.totalEstimatedCost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="text-[11px] text-stone-500 capitalize">
                    {trip.preferences.transportation.replace('-', ' ')}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenTrip(trip)}
                    className="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <span>Open Trip</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDuplicateTrip(trip)}
                    title="Duplicate Trip"
                    className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Delete "${trip.title}"?`)) {
                        onDeleteTrip(trip.id);
                      }
                    }}
                    title="Delete Trip"
                    className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
