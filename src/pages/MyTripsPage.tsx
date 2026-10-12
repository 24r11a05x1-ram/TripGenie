import React, { useState } from 'react';
import { 
  FolderKanban, 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  IndianRupee, 
  ArrowRight, 
  Copy, 
  Trash2, 
  Plus 
} from 'lucide-react';
import { CompleteTrip } from '../types/trip';

interface MyTripsPageProps {
  savedTrips: CompleteTrip[];
  onOpenTrip: (trip: CompleteTrip) => void;
  onOpenCreateTrip: () => void;
  onDuplicateTrip: (trip: CompleteTrip) => void;
  onDeleteTrip: (tripId: string) => void;
}

export const MyTripsPage: React.FC<MyTripsPageProps> = ({
  savedTrips,
  onOpenTrip,
  onOpenCreateTrip,
  onDuplicateTrip,
  onDeleteTrip,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTrips = savedTrips.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">My Saved Trips</h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage your personal travel itineraries and past vacations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destination or trip..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="button"
            onClick={onOpenCreateTrip}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Trip</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      {filteredTrips.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
          <p className="text-sm text-stone-500">No trips found matching "{searchQuery}".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col"
            >
              <div className="relative h-44 overflow-hidden bg-stone-100">
                <img
                  src={trip.coverImage || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'}
                  alt={trip.destination}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-bold text-base line-clamp-1">{trip.title}</h3>
                  <div className="flex items-center gap-1 text-xs text-stone-200 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{trip.destination}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="grid grid-cols-2 gap-2 text-xs text-stone-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>{trip.summary.totalDays} Days</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-stone-400" />
                    <span>{trip.preferences.travelers} Travelers</span>
                  </div>
                  <div className="flex items-center gap-1 font-bold text-stone-900">
                    <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                    <span>₹{trip.budget.totalEstimatedCost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="text-stone-500 capitalize">
                    {trip.preferences.transportation.replace('-', ' ')}
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenTrip(trip)}
                    className="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>View Itinerary</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDuplicateTrip(trip)}
                    title="Duplicate"
                    className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl"
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
                    title="Delete"
                    className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
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
